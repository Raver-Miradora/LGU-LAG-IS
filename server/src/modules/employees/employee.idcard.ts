import { Router } from "express";
import QRCode from "qrcode";
// @ts-ignore: missing types for pdfkit package
import PDFDocument from "pdfkit";
import prisma from "../../config/database";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

router.get(
  "/:id/idcard",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF", "VIEWER"),
  async (req, res, next) => {
    try {
      const employee = await prisma.employee.findUnique({ where: { id: req.params.id } });
      if (!employee) return res.status(404).json({ message: "Employee not found" });
      const doc = new PDFDocument({ size: [350, 220] });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=idcard-${employee.employeeNo}.pdf`);
      doc.pipe(res);
      doc.rect(0, 0, 350, 220).fill('#f3f4f6');
      doc.fillColor('#222').fontSize(14).text('LGU Lagonoy', 20, 20);
      doc.fontSize(10).text('Employee ID Card', 20, 40);
      doc.fontSize(12).text(`${employee.lastName}, ${employee.firstName}`, 20, 70);
      doc.fontSize(10).text(`Position: ${employee.position}`, 20, 90);
      doc.fontSize(10).text(`Dept: ${employee.department}`, 20, 105);
      doc.fontSize(10).text(`ID: ${employee.employeeNo}`, 20, 120);
      // Generate QR code with employee ID
      const qrData = await QRCode.toDataURL(employee.employeeNo);
      doc.image(Buffer.from(qrData.split(",")[1], 'base64'), 250, 60, { width: 70, height: 70 });
      doc.end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
