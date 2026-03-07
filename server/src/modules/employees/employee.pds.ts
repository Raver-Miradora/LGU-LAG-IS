import { Router } from "express";
// @ts-ignore: missing types for pdfkit package
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import prisma from "../../config/database";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

function fmt(d: Date | null | undefined): string {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function safe(v: string | null | undefined, fallback = "N/A"): string {
  return v || fallback;
}

/**
 * Personal Data Sheet (PDS) — CSC Form 212 style
 * Generates a multi-page PDF with the employee's complete profile.
 */
router.get(
  "/:id/pds",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF", "VIEWER"),
  async (req, res, next) => {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
          serviceRecords: { orderBy: { dateFrom: "asc" } },
        },
      });
      if (!employee) return res.status(404).json({ message: "Employee not found" });

      const doc = new PDFDocument({ size: "A4", margins: { top: 40, bottom: 40, left: 40, right: 40 } });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=pds-${employee.employeeNo}.pdf`
      );
      doc.pipe(res);

      const pageW = 515; // usable width (595.28 - 40*2)

      // ═══════════════════════════════════════════════
      // PAGE 1 — Personal Information
      // ═══════════════════════════════════════════════

      // Header
      doc.rect(40, 40, pageW, 30).fill("#1e40af");
      doc.fillColor("#fff").font("Helvetica-Bold").fontSize(11);
      doc.text("PERSONAL DATA SHEET (CS Form No. 212)", 40, 47, { align: "center", width: pageW });
      doc.fillColor("#333");

      doc.moveDown(0.3);
      doc.font("Helvetica").fontSize(7);
      doc.text("Revised 2017", 40, 75, { align: "center", width: pageW });

      doc.moveDown(0.5);
      let y = 90;

      // Section header helper
      function sectionHeader(title: string) {
        doc.rect(40, y, pageW, 18).fill("#e0e7ff");
        doc.fillColor("#1e40af").font("Helvetica-Bold").fontSize(9);
        doc.text(title, 45, y + 4);
        doc.fillColor("#333");
        y += 22;
      }

      // Field helper (label: value)
      function field(label: string, value: string, x: number, width: number) {
        doc.font("Helvetica").fontSize(7).fillColor("#666");
        doc.text(label, x, y, { width });
        doc.font("Helvetica-Bold").fontSize(9).fillColor("#333");
        doc.text(value, x, y + 9, { width });
      }

      // Row helper (advances y)
      function nextRow(height = 24) {
        y += height;
        if (y > 760) {
          doc.addPage();
          y = 50;
        }
      }

      // ─── I. PERSONAL INFORMATION ──────────────────
      sectionHeader("I. PERSONAL INFORMATION");

      // Row 1: Surname, First, Middle, Suffix
      field("SURNAME", employee.lastName, 45, 120);
      field("FIRST NAME", employee.firstName, 170, 120);
      field("MIDDLE NAME", safe(employee.middleName), 300, 120);
      field("NAME EXTENSION", safe(employee.suffix, ""), 430, 80);
      nextRow(28);

      // Row 2: Birthdate, Place of Birth, Sex, Civil Status
      field("DATE OF BIRTH", fmt(employee.birthdate), 45, 120);
      field("PLACE OF BIRTH", safe(employee.placeOfBirth), 170, 150);
      field("SEX", employee.gender, 330, 60);
      field("CIVIL STATUS", employee.civilStatus, 400, 110);
      nextRow(28);

      // Row 3: Citizenship, Height, Weight, Blood Type
      field("CITIZENSHIP", safe(employee.citizenship, "Filipino"), 45, 120);
      field("HEIGHT (m)", safe(employee.height), 170, 80);
      field("WEIGHT (kg)", safe(employee.weight), 260, 80);
      field("BLOOD TYPE", safe(employee.bloodType), 350, 80);
      nextRow(28);

      // Row 4: GSIS, PAG-IBIG, PhilHealth
      field("GSIS ID NO.", safe(employee.gsisNo), 45, 120);
      field("PAG-IBIG ID NO.", safe(employee.pagibigNo), 170, 120);
      field("PHILHEALTH NO.", safe(employee.philhealthNo), 300, 120);
      nextRow(28);

      // Row 5: SSS, TIN
      field("SSS NO.", safe(employee.sssNo), 45, 120);
      field("TIN NO.", safe(employee.tinNo), 170, 120);
      field("EMPLOYEE NO.", employee.employeeNo, 300, 120);
      nextRow(28);

      // Row 6: Address
      field("RESIDENTIAL ADDRESS", safe(employee.residentialAddress, employee.address), 45, 230);
      field("PERMANENT ADDRESS", safe(employee.permanentAddress, employee.address), 285, 230);
      nextRow(28);

      // Row 7: Contact, Email
      field("TELEPHONE / MOBILE NO.", safe(employee.contactNo), 45, 200);
      field("E-MAIL ADDRESS", safe(employee.email), 260, 250);
      nextRow(32);

      // ─── II. FAMILY BACKGROUND ────────────────────
      sectionHeader("II. FAMILY BACKGROUND");

      // Spouse
      field("SPOUSE'S NAME", safe(employee.spouseName), 45, 200);
      field("OCCUPATION", safe(employee.spouseOccupation), 260, 120);
      field("EMPLOYER", safe(employee.spouseEmployer), 390, 120);
      nextRow(28);

      field("EMPLOYER BUSINESS ADDRESS", safe(employee.spouseBusinessAddress), 45, 200);
      field("SPOUSE CONTACT NO.", safe(employee.spouseContactNo), 260, 200);
      nextRow(28);

      // Father / Mother
      field("FATHER'S NAME", safe(employee.fatherName), 45, 230);
      field("MOTHER'S MAIDEN NAME", safe(employee.motherName), 285, 230);
      nextRow(28);

      // Children
      const children = Array.isArray(employee.children) ? employee.children : [];
      if (children.length > 0) {
        doc.font("Helvetica").fontSize(7).fillColor("#666");
        doc.text("CHILDREN", 45, y);
        y += 12;
        for (const child of children as Array<{ name?: string; birthdate?: string }>) {
          doc.font("Helvetica").fontSize(8).fillColor("#333");
          doc.text(`• ${child.name ?? ""}`, 50, y, { width: 200 });
          doc.text(child.birthdate ? child.birthdate : "", 260, y, { width: 120 });
          nextRow(14);
        }
      }
      nextRow(10);

      // ─── III. EDUCATIONAL BACKGROUND ──────────────
      sectionHeader("III. EDUCATIONAL BACKGROUND");

      const education = Array.isArray(employee.educationBg) ? employee.educationBg : [];
      if (education.length > 0) {
        // Table header
        doc.font("Helvetica-Bold").fontSize(7).fillColor("#666");
        doc.text("LEVEL", 45, y, { width: 80 });
        doc.text("SCHOOL", 130, y, { width: 150 });
        doc.text("DEGREE/COURSE", 290, y, { width: 120 });
        doc.text("YEAR", 420, y, { width: 80 });
        nextRow(14);

        doc.fillColor("#333").font("Helvetica").fontSize(8);
        for (const edu of education as Array<Record<string, string>>) {
          doc.text(edu.level ?? "", 45, y, { width: 80 });
          doc.text(edu.school ?? "", 130, y, { width: 150 });
          doc.text(edu.degree ?? edu.course ?? "", 290, y, { width: 120 });
          doc.text(edu.yearGraduated ?? edu.year ?? "", 420, y, { width: 80 });
          nextRow(14);
        }
      } else {
        doc.font("Helvetica").fontSize(8).fillColor("#999");
        doc.text("No education records provided", 45, y);
        nextRow(16);
      }
      nextRow(10);

      // ─── IV. CIVIL SERVICE ELIGIBILITY ────────────
      sectionHeader("IV. CIVIL SERVICE ELIGIBILITY");

      const eligibility = Array.isArray(employee.eligibility) ? employee.eligibility : [];
      if (eligibility.length > 0) {
        doc.font("Helvetica-Bold").fontSize(7).fillColor("#666");
        doc.text("ELIGIBILITY", 45, y, { width: 150 });
        doc.text("RATING", 200, y, { width: 60 });
        doc.text("DATE OF EXAM", 270, y, { width: 100 });
        doc.text("PLACE OF EXAM", 380, y, { width: 130 });
        nextRow(14);

        doc.fillColor("#333").font("Helvetica").fontSize(8);
        for (const el of eligibility as Array<Record<string, string>>) {
          doc.text(el.name ?? el.eligibility ?? "", 45, y, { width: 150 });
          doc.text(el.rating ?? "", 200, y, { width: 60 });
          doc.text(el.dateOfExam ?? el.date ?? "", 270, y, { width: 100 });
          doc.text(el.placeOfExam ?? el.place ?? "", 380, y, { width: 130 });
          nextRow(14);
        }
      } else {
        doc.font("Helvetica").fontSize(8).fillColor("#999");
        doc.text("No eligibility records provided", 45, y);
        nextRow(16);
      }

      // ═══════════════════════════════════════════════
      // PAGE 2+ — Work Experience (Service Records)
      // ═══════════════════════════════════════════════
      doc.addPage();
      y = 50;

      sectionHeader("V. WORK EXPERIENCE");

      if (employee.serviceRecords.length > 0) {
        // Table header
        doc.font("Helvetica-Bold").fontSize(7).fillColor("#666");
        doc.text("FROM", 45, y, { width: 70 });
        doc.text("TO", 115, y, { width: 70 });
        doc.text("POSITION TITLE", 190, y, { width: 130 });
        doc.text("DEPT/OFFICE", 325, y, { width: 100 });
        doc.text("SALARY", 430, y, { width: 60 });
        doc.text("APPT", 495, y, { width: 50 });
        nextRow(14);

        // Separator
        doc.moveTo(45, y).lineTo(555, y).lineWidth(0.5).stroke();
        y += 4;

        doc.fillColor("#333").font("Helvetica").fontSize(8);
        for (const sr of employee.serviceRecords) {
          doc.text(fmt(sr.dateFrom), 45, y, { width: 70 });
          doc.text(sr.dateTo ? fmt(sr.dateTo) : "Present", 115, y, { width: 70 });
          doc.text(sr.designation, 190, y, { width: 130 });
          doc.text(sr.office, 325, y, { width: 100 });
          doc.text(sr.salary ? `₱${Number(sr.salary).toLocaleString()}` : "", 430, y, { width: 60 });
          doc.text(sr.status, 495, y, { width: 50 });
          nextRow(16);
        }
      } else {
        doc.font("Helvetica").fontSize(8).fillColor("#999");
        doc.text("No work experience records", 45, y);
        nextRow(16);
      }

      // ═══════════════════════════════════════════════
      // Employment Details Section
      // ═══════════════════════════════════════════════
      nextRow(10);
      sectionHeader("CURRENT EMPLOYMENT DETAILS");

      field("POSITION", employee.position, 45, 200);
      field("DEPARTMENT", employee.department, 260, 200);
      nextRow(28);

      field("EMPLOYMENT STATUS", employee.employmentStatus.replace(/_/g, " "), 45, 150);
      field("DATE HIRED", fmt(employee.dateHired), 200, 120);
      field(
        "SALARY GRADE",
        employee.salaryGrade ? `SG-${employee.salaryGrade} Step ${employee.stepIncrement ?? 1}` : "N/A",
        330,
        120
      );
      nextRow(28);

      field("EMERGENCY CONTACT", safe(employee.emergencyContact), 45, 200);
      field("EMERGENCY PHONE", safe(employee.emergencyPhone), 260, 200);
      nextRow(32);

      // ─── Photo ────────────────────────────────────
      if (employee.photoUrl) {
        const photoPath = path.join(__dirname, "../../../uploads/photos", path.basename(employee.photoUrl));
        if (fs.existsSync(photoPath)) {
          nextRow(10);
          doc.font("Helvetica-Bold").fontSize(8).fillColor("#666");
          doc.text("ID PHOTO", 45, y);
          y += 12;
          doc.image(photoPath, 45, y, { width: 72, height: 90 });
          y += 95;
        }
      }

      // ─── Signature ────────────────────────────────
      nextRow(20);
      doc.font("Helvetica").fontSize(8).fillColor("#333");
      doc.text(
        "I declare under oath that I have personally accomplished this Personal Data Sheet which is a true, correct and complete statement pursuant to the provisions of pertinent laws, rules and regulations of the Republic of the Philippines.",
        45,
        y,
        { width: pageW, align: "justify" }
      );
      nextRow(40);

      // Signature lines
      doc.text("_________________________________", 45, y);
      doc.text("_________________________________", 310, y);
      nextRow(14);
      doc.font("Helvetica-Bold").fontSize(8);
      doc.text("Government Issued ID", 45, y);
      doc.text("Date Accomplished", 310, y);
      nextRow(25);

      doc.text("_________________________________", 45, y);
      doc.font("Helvetica").fontSize(8);
      nextRow(14);
      doc.font("Helvetica-Bold");
      doc.text("Signature", 45, y);

      // ─── Page numbers ─────────────────────────────
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.font("Helvetica").fontSize(7).fillColor("#999");
        doc.text(
          `CS Form No. 212 (Revised 2017) — Page ${i + 1} of ${range.count}`,
          40,
          790,
          { align: "center", width: pageW }
        );
      }

      doc.end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
