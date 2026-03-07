import { Router } from "express";
import ExcelJS from "exceljs";
import prisma from "../../config/database";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

/**
 * Export employee masterlist to Excel
 * GET /employees/export?format=xlsx|csv&department=...&status=...&isActive=...
 */
router.get(
  "/export",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF"),
  async (req, res, next) => {
    try {
      const { format = "xlsx", department, status, isActive } = req.query;

      const where: any = {};
      if (department) where.department = String(department);
      if (status) where.employmentStatus = String(status);
      if (isActive !== undefined && isActive !== "") {
        where.isActive = isActive === "true";
      } else {
        where.isActive = true;
      }

      const employees = await prisma.employee.findMany({
        where,
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        include: { serviceRecords: { orderBy: { dateFrom: "desc" }, take: 1 } },
      });

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "LGUIS - Municipality of Lagonoy";
      workbook.created = new Date();

      const sheet = workbook.addWorksheet("Employees");

      // Title row
      sheet.mergeCells("A1:L1");
      const titleCell = sheet.getCell("A1");
      titleCell.value = "Municipality of Lagonoy — Employee Masterlist";
      titleCell.font = { size: 14, bold: true };
      titleCell.alignment = { horizontal: "center" };

      sheet.mergeCells("A2:L2");
      const dateCell = sheet.getCell("A2");
      dateCell.value = `Generated: ${new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}`;
      dateCell.font = { size: 10, italic: true };
      dateCell.alignment = { horizontal: "center" };

      // Header row
      const headers = [
        "Employee No.",
        "Last Name",
        "First Name",
        "Middle Name",
        "Department",
        "Position",
        "Employment Status",
        "Date Hired",
        "Salary Grade",
        "Contact No.",
        "Email",
        "Status",
      ];

      const headerRow = sheet.addRow(headers);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1E40AF" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Data rows
      for (const emp of employees) {
        const row = sheet.addRow([
          emp.employeeNo,
          emp.lastName,
          emp.firstName,
          emp.middleName ?? "",
          emp.department,
          emp.position,
          emp.employmentStatus.replace(/_/g, " "),
          emp.dateHired
            ? new Date(emp.dateHired).toLocaleDateString("en-PH")
            : "",
          emp.salaryGrade ?? "",
          emp.phone ?? "",
          emp.email ?? "",
          emp.isActive ? "Active" : "Archived",
        ]);
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }

      // Summary row
      sheet.addRow([]);
      sheet.addRow([`Total Employees: ${employees.length}`]);

      // Auto-width columns
      sheet.columns.forEach((col) => {
        let maxLen = 12;
        col.eachCell?.({ includeEmpty: false }, (cell) => {
          const len = String(cell.value ?? "").length;
          if (len > maxLen) maxLen = len;
        });
        col.width = Math.min(maxLen + 2, 40);
      });

      if (format === "csv") {
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=employee-masterlist-${Date.now()}.csv`
        );
        await workbook.csv.write(res);
      } else {
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=employee-masterlist-${Date.now()}.xlsx`
        );
        await workbook.xlsx.write(res);
      }

      res.end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
