import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../../config/database";
import { authenticate, authorize } from "../../middleware/auth";

// router for employee-scoped document operations (list, upload, delete)
const router = Router();
// separate router for global document actions (download by doc id)
export const documentRouter = Router();

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
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const employee = await prisma.employee.findUnique({ where: { id } });
      if (!employee) return res.status(404).json({ message: "Employee not found" });
      // multer guarantees file exists when this handler runs
      const file = req.file!;
      const filePath = `/uploads/documents/${file.filename}`;
      const doc = await prisma.employeeDocument.create({
        data: {
          employeeId: id,
          fileName: file.originalname,
          filePath,
          fileType: file.mimetype,
          fileSize: file.size,
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
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const docs = await prisma.employeeDocument.findMany({ where: { employeeId: id } });
      res.json(docs);
    } catch (err) {
      next(err);
    }
  }
);

// download route moved to separate router below

documentRouter.get(
  "/documents/:docId/download",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF", "VIEWER"),
  async (req, res, next) => {
    try {
      const docId = (Array.isArray(req.params.docId) ? req.params.docId[0] : req.params.docId) as string;
      const doc = await prisma.employeeDocument.findUnique({ where: { id: docId } });
      if (!doc) return res.status(404).json({ message: "Document not found" });
      const diskPath = path.join(uploadDir, path.basename(doc.filePath));
      res.download(diskPath, doc.fileName);
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
      const docId = (Array.isArray(req.params.docId) ? req.params.docId[0] : req.params.docId) as string;
      const doc = await prisma.employeeDocument.findUnique({ where: { id: docId } });
      if (!doc) return res.status(404).json({ message: "Document not found" });
      await prisma.employeeDocument.delete({ where: { id: docId } });
      fs.unlinkSync(path.join(uploadDir, path.basename(doc.filePath)));
      res.json({ message: "Deleted" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
