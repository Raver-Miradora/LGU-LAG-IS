import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../../config/database";
import { authenticate, authorize } from "../../middleware/auth";

const router = Router();

const uploadDir = path.join(__dirname, "../../../uploads/photos");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `emp_${req.params.id}_${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|gif|webp)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, png, gif, webp) are allowed") as any, false);
    }
  },
});

router.post(
  "/:id/photo",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF"),
  upload.single("photo"),
  async (req, res, next) => {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const employee = await prisma.employee.findUnique({ where: { id } });
      if (!employee) return res.status(404).json({ message: "Employee not found" });
      if (!req.file) return res.status(400).json({ message: "No photo file uploaded" });

      // Remove old photo file if exists
      if (employee.photoUrl) {
        const oldPath = path.join(uploadDir, path.basename(employee.photoUrl));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const photoUrl = `/uploads/photos/${req.file.filename}`;
      await prisma.employee.update({ where: { id }, data: { photoUrl } });
      res.json({ photoUrl });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
