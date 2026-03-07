import { Router } from "express";
import QRCode from "qrcode";
// @ts-ignore: missing types for pdfkit package
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import prisma from "../../config/database";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

// CR-80 card = 3.375" × 2.125" → in points: 243 × 153
const CARD_W = 243;
const CARD_H = 153;

/**
 * Batch ID Card Generation
 * POST /employees/batch-idcard
 * Body: { employeeIds: string[] }
 * Returns a single PDF with all ID cards (front+back per employee), 2 cards per page
 */
router.post(
  "/batch-idcard",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN"),
  async (req, res, next) => {
    try {
      const { employeeIds } = req.body;
      if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
        return res.status(400).json({ message: "employeeIds array is required" });
      }

      const employees = await prisma.employee.findMany({
        where: { id: { in: employeeIds }, isActive: true },
        orderBy: { lastName: "asc" },
      });

      if (employees.length === 0) {
        return res.status(404).json({ message: "No active employees found" });
      }

      // A4 page with 2 cards per row (front+back side by side)
      const doc = new PDFDocument({ size: "A4", margin: 30 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=batch-idcards-${Date.now()}.pdf`
      );
      doc.pipe(res);

      const currentYear = new Date().getFullYear();
      const pageMargin = 30;
      const cardGap = 15;

      for (let i = 0; i < employees.length; i++) {
        const employee = employees[i];
        // 2 employees per page (stacked vertically)
        const cardIndex = i % 2;
        if (i > 0 && cardIndex === 0) doc.addPage();

        const yOffset = pageMargin + cardIndex * (CARD_H + cardGap + CARD_H + cardGap + 10);
        const frontX = pageMargin;
        const backX = pageMargin + CARD_W + cardGap;

        // ─── FRONT ─────────────────────────────────
        // Background
        doc.save();
        doc.rect(frontX, yOffset, CARD_W, CARD_H).fill("#f0f4ff");

        // Header band
        doc.rect(frontX, yOffset, CARD_W, 32).fill("#1e40af");
        doc.fillColor("#fff").fontSize(5);
        doc.text("Republic of the Philippines", frontX, yOffset + 4, { align: "center", width: CARD_W });
        doc.fontSize(5).text("Province of Camarines Sur", frontX, yOffset + 10, { align: "center", width: CARD_W });
        doc.fontSize(7).font("Helvetica-Bold").text("Municipality of Lagonoy", frontX, yOffset + 17, { align: "center", width: CARD_W });
        doc.fontSize(4).font("Helvetica").text("EMPLOYEE IDENTIFICATION CARD", frontX, yOffset + 26, { align: "center", width: CARD_W });

        // Photo
        const photoX = frontX + 10;
        const photoY = yOffset + 38;
        const photoW = 45;
        const photoH = 55;

        if (employee.photoUrl) {
          const photoPath = path.join(__dirname, "../../../uploads/photos", path.basename(employee.photoUrl));
          if (fs.existsSync(photoPath)) {
            doc.image(photoPath, photoX, photoY, { width: photoW, height: photoH, cover: [photoW, photoH] });
          } else {
            doc.rect(photoX, photoY, photoW, photoH).fill("#e5e7eb");
            doc.fillColor("#999").fontSize(5).text("No Photo", photoX + 5, photoY + 22);
          }
        } else {
          doc.rect(photoX, photoY, photoW, photoH).fill("#e5e7eb");
          doc.fillColor("#999").fontSize(5).text("No Photo", photoX + 5, photoY + 22);
        }

        // Employee details
        const textX = frontX + 62;
        doc.fillColor("#222").font("Helvetica-Bold").fontSize(8);
        doc.text(`${employee.lastName}, ${employee.firstName}`, textX, yOffset + 40, { width: CARD_W - 62 - 10 });
        doc.font("Helvetica").fontSize(6);
        doc.text(employee.position, textX, yOffset + 52, { width: CARD_W - 62 - 10 });
        doc.text(employee.department, textX, yOffset + 60, { width: CARD_W - 62 - 10 });
        doc.text(`ID: ${employee.employeeNo}`, textX, yOffset + 72, { width: CARD_W - 62 - 10 });
        doc.fontSize(5).text(`Valid Until: December ${currentYear + 1}`, textX, yOffset + 82, { width: CARD_W - 62 - 10 });

        // QR code
        const qrData = await QRCode.toDataURL(employee.employeeNo, { margin: 0, width: 120 });
        doc.image(Buffer.from(qrData.split(",")[1], "base64"), frontX + CARD_W - 50, yOffset + 70, { width: 40, height: 40 });

        doc.restore();

        // ─── BACK ──────────────────────────────────
        doc.save();
        doc.rect(backX, yOffset, CARD_W, CARD_H).fill("#f0f4ff");

        doc.fillColor("#222").font("Helvetica-Bold").fontSize(7);
        doc.text("EMERGENCY CONTACT", backX + 10, yOffset + 12, { width: CARD_W - 20 });
        doc.font("Helvetica").fontSize(6);
        doc.text(`Name: ${employee.emergencyContact || "_________________"}`, backX + 10, yOffset + 24);
        doc.text(`Phone: ${employee.emergencyPhone || "_________________"}`, backX + 10, yOffset + 34);
        doc.text(`Blood Type: ${employee.bloodType || "____"}`, backX + 10, yOffset + 44);

        doc.fontSize(5).text("If found, please return to:", backX + 10, yOffset + 60);
        doc.font("Helvetica-Bold").fontSize(6).text("Municipality of Lagonoy", backX + 10, yOffset + 70);
        doc.font("Helvetica").fontSize(5).text("Lagonoy, Camarines Sur", backX + 10, yOffset + 78);

        doc.text("_______________________", backX + CARD_W - 95, yOffset + 110);
        doc.font("Helvetica-Bold").fontSize(5).text("Mayor's Signature", backX + CARD_W - 85, yOffset + 120);

        doc.restore();

        // Add cut line label
        doc.save();
        doc.fontSize(5).fillColor("#bbb").font("Helvetica");
        doc.text("✂ FRONT", frontX, yOffset + CARD_H + 2, { width: CARD_W, align: "center" });
        doc.text("✂ BACK", backX, yOffset + CARD_H + 2, { width: CARD_W, align: "center" });
        doc.restore();

        // Save IdCard record if not already saved
        const existingCard = await prisma.idCard.findFirst({
          where: { employeeId: employee.id, expiryDate: { gte: new Date() } },
        });
        if (!existingCard) {
          await prisma.idCard.create({
            data: {
              employeeId: employee.id,
              idNumber: `LGU-${employee.employeeNo}-${currentYear}`,
              issuedDate: new Date(),
              expiryDate: new Date(`${currentYear + 1}-12-31`),
              qrData: employee.employeeNo,
            },
          });
        }
      }

      doc.end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
