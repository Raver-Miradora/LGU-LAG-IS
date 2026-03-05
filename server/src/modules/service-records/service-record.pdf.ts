import { Router } from "express";
import PDFDocument from "pdfkit";
import prisma from "../../config/database";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

function formatPHDate(d: Date | null | undefined): string {
  if (!d) return "";
  return d.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
}

router.get(
  "/:id/pdf",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF", "VIEWER"),
  async (req, res, next) => {
    try {
      const employee = await prisma.employee.findUnique({
        where: { id: req.params.id },
        include: { serviceRecords: { orderBy: { dateFrom: "asc" } } },
      });
      if (!employee) return res.status(404).json({ message: "Employee not found" });

      const doc = new PDFDocument({ size: "LEGAL", margin: 50 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=service-records-${employee.employeeNo}.pdf`);
      doc.pipe(res);

      // ─── Header / Letterhead ──────────────────────
      doc.fontSize(10).text("Republic of the Philippines", { align: "center" });
      doc.fontSize(10).text("Province of Camarines Sur", { align: "center" });
      doc.fontSize(12).font("Helvetica-Bold").text("Municipality of Lagonoy", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(14).font("Helvetica-Bold").text("SERVICE RECORD", { align: "center", underline: true });
      doc.moveDown(0.5);

      // ─── Employee Info ────────────────────────────
      doc.font("Helvetica").fontSize(10);
      doc.text(`Name: ${employee.lastName}, ${employee.firstName} ${employee.middleName || ""}`, 50);
      doc.text(`Employee No: ${employee.employeeNo}`);
      doc.text(`Date of Birth: ${formatPHDate(employee.birthdate as any)}`);
      doc.moveDown(0.5);

      // ─── Table Header ────────────────────────────
      const tableTop = doc.y;
      const col = { from: 50, to: 140, designation: 230, status: 370, salary: 450, office: 520 };
      const colW = { from: 90, to: 90, designation: 140, status: 80, salary: 70, office: 90 };

      doc.font("Helvetica-Bold").fontSize(8);
      doc.text("SERVICE", col.from, tableTop, { width: colW.from });
      doc.text("INCLUSIVE DATES", col.from, tableTop + 10, { width: colW.from + colW.to });
      doc.text("From", col.from, tableTop + 22, { width: colW.from });
      doc.text("To", col.to, tableTop + 22, { width: colW.to });
      doc.text("DESIGNATION", col.designation, tableTop + 10, { width: colW.designation });
      doc.text("STATUS", col.status, tableTop + 10, { width: colW.status });
      doc.text("SALARY", col.salary, tableTop + 10, { width: colW.salary });
      doc.text("OFFICE", col.office, tableTop + 10, { width: colW.office });

      // horizontal line below header
      const lineY = tableTop + 35;
      doc.moveTo(50, lineY).lineTo(610, lineY).stroke();

      // ─── Table Rows ──────────────────────────────
      let y = lineY + 5;
      doc.font("Helvetica").fontSize(8);

      for (const sr of employee.serviceRecords) {
        if (y > 880) {
          doc.addPage();
          y = 50;
        }
        doc.text(formatPHDate(sr.dateFrom), col.from, y, { width: colW.from });
        doc.text(sr.dateTo ? formatPHDate(sr.dateTo) : "Present", col.to, y, { width: colW.to });
        doc.text(sr.designation, col.designation, y, { width: colW.designation });
        doc.text(sr.status, col.status, y, { width: colW.status });
        doc.text(sr.salary?.toLocaleString("en-PH") ?? "", col.salary, y, { width: colW.salary });
        doc.text(sr.office, col.office, y, { width: colW.office });
        y += 18;
      }

      // ─── Footer / Signatory ──────────────────────
      doc.moveDown(3);
      const footerY = Math.max(y + 40, 750);
      doc.fontSize(9).text("Issued in compliance with Executive Order No. 54 dated August 10, 1954, and in", 50, footerY);
      doc.text("accordance with Circular No. 58, dated August 10, 1954 of the system.", 50);
      doc.moveDown(2);
      doc.font("Helvetica-Bold").fontSize(10).text("___________________________", 350, footerY + 50);
      doc.fontSize(9).text("Authorized Signatory", 380, footerY + 65);

      // ─── Page number ─────────────────────────────
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(7).text(`Page ${i + 1} of ${range.count}`, 50, 920, { align: "center" });
      }

      doc.end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
