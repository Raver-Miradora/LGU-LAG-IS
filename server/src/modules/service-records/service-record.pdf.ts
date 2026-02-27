import { Router } from "express";
import PDFDocument from "pdfkit";
import prisma from "../../config/database";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

router.get(
  "/:id/pdf",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF", "VIEWER"),
  async (req, res, next) => {
    try {
      const employee = await prisma.employee.findUnique({
        where: { id: req.params.id },
        include: { serviceRecords: true },
      });
      if (!employee) return res.status(404).json({ message: "Employee not found" });
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=service-records-${employee.employeeNo}.pdf`);
      doc.pipe(res);
      doc.fontSize(16).text(`Service Records for ${employee.lastName}, ${employee.firstName}`);
      doc.moveDown();
      employee.serviceRecords.forEach((sr, i) => {
        doc.fontSize(12).text(
          `${i + 1}. ${sr.dateFrom.toISOString().slice(0,10)} - ${sr.dateTo ? sr.dateTo.toISOString().slice(0,10) : 'Present'} | ${sr.designation} | ${sr.status} | ${sr.salary} | ${sr.office}`
        );
      });
      doc.end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
