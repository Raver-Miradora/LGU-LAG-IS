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

router.get(
  "/:id/idcard",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF", "VIEWER"),
  async (req, res, next) => {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const employee = await prisma.employee.findUnique({ where: { id } });
      if (!employee) return res.status(404).json({ message: "Employee not found" });

      const doc = new PDFDocument({ size: [CARD_W, CARD_H], margin: 0 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=idcard-${employee.employeeNo}.pdf`);
      doc.pipe(res);

      // ─── FRONT SIDE ──────────────────────────────
      // background
      doc.rect(0, 0, CARD_W, CARD_H).fill("#f0f4ff");

      // header band
      doc.rect(0, 0, CARD_W, 32).fill("#1e40af");
      doc.fillColor("#fff").fontSize(5).text("Republic of the Philippines", 0, 4, { align: "center", width: CARD_W });
      doc.fontSize(5).text("Province of Camarines Sur", 0, 10, { align: "center", width: CARD_W });
      doc.fontSize(7).font("Helvetica-Bold").text("Municipality of Lagonoy", 0, 17, { align: "center", width: CARD_W });
      doc.fontSize(4).font("Helvetica").text("EMPLOYEE IDENTIFICATION CARD", 0, 26, { align: "center", width: CARD_W });

      // Photo placeholder or actual photo
      const photoX = 10;
      const photoY = 38;
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
      const textX = 62;
      doc.fillColor("#222").font("Helvetica-Bold").fontSize(8);
      doc.text(`${employee.lastName}, ${employee.firstName}`, textX, 40, { width: CARD_W - textX - 10 });
      doc.font("Helvetica").fontSize(6);
      doc.text(employee.position, textX, 52, { width: CARD_W - textX - 10 });
      doc.text(employee.department, textX, 60, { width: CARD_W - textX - 10 });
      doc.text(`ID: ${employee.employeeNo}`, textX, 72, { width: CARD_W - textX - 10 });

      const currentYear = new Date().getFullYear();
      doc.fontSize(5).text(`Valid Until: December ${currentYear + 1}`, textX, 82, { width: CARD_W - textX - 10 });

      // QR code
      const qrData = await QRCode.toDataURL(employee.employeeNo, { margin: 0, width: 120 });
      doc.image(Buffer.from(qrData.split(",")[1], "base64"), CARD_W - 50, 70, { width: 40, height: 40 });

      // ─── BACK SIDE ───────────────────────────────
      doc.addPage({ size: [CARD_W, CARD_H], margin: 0 });
      doc.rect(0, 0, CARD_W, CARD_H).fill("#f0f4ff");

      doc.fillColor("#222").font("Helvetica-Bold").fontSize(7);
      doc.text("EMERGENCY CONTACT", 10, 12, { width: CARD_W - 20 });
      doc.font("Helvetica").fontSize(6);
      doc.text(`Name: ${employee.emergencyContact || "_________________"}`, 10, 24);
      doc.text(`Phone: ${employee.emergencyPhone || "_________________"}`, 10, 34);
      doc.text(`Blood Type: ${employee.bloodType || "____"}`, 10, 44);

      doc.moveDown(1);
      doc.fontSize(5).text("If found, please return to:", 10, 60);
      doc.font("Helvetica-Bold").fontSize(6).text("Municipality of Lagonoy", 10, 70);
      doc.font("Helvetica").fontSize(5).text("Lagonoy, Camarines Sur", 10, 78);

      // Signature line
      doc.text("_______________________", CARD_W - 95, 110);
      doc.font("Helvetica-Bold").fontSize(5).text("Mayor's Signature", CARD_W - 85, 120);

      // Save IdCard record if not already saved for this year
      const existingCard = await prisma.idCard.findFirst({
        where: { employeeId: id, expiryDate: { gte: new Date() } },
      });
      if (!existingCard) {
        await prisma.idCard.create({
          data: {
            employeeId: id,
            idNumber: `LGU-${employee.employeeNo}-${currentYear}`,
            issueDate: new Date(),
            expiryDate: new Date(`${currentYear + 1}-12-31`),
            qrData: employee.employeeNo,
            template: "CR80_V1",
          },
        });
      }

      doc.end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
