import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../../config/database";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();
const uploadDir = path.join(__dirname, "../../../uploads/documents");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `empdoc_${req.params.id}_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

router.post(
  "/:id/documents",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF"),
  upload.single("document"),
  async (req, res, next) => {
    try {
      const employee = await prisma.employee.findUnique({ where: { id: req.params.id } });
      if (!employee) return res.status(404).json({ message: "Employee not found" });
      const filePath = `/uploads/documents/${req.file.filename}`;
      const doc = await prisma.employeeDocument.create({
        data: {
          employeeId: req.params.id,
          fileName: req.file.originalname,
          filePath,
          fileType: req.file.mimetype,
          fileSize: req.file.size,
        },
      });
      res.json(doc);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:id/documents",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF", "VIEWER"),
  async (req, res, next) => {
    try {
      const docs = await prisma.employeeDocument.findMany({ where: { employeeId: req.params.id } });
      res.json(docs);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/documents/:docId",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF"),
  async (req, res, next) => {
    try {
      const doc = await prisma.employeeDocument.findUnique({ where: { id: req.params.docId } });
      if (!doc) return res.status(404).json({ message: "Document not found" });
      await prisma.employeeDocument.delete({ where: { id: req.params.docId } });
      fs.unlinkSync(path.join(uploadDir, path.basename(doc.filePath)));
      res.json({ message: "Deleted" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
