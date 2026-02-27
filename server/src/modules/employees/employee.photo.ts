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
const upload = multer({ storage });

router.post(
  "/:id/photo",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF"),
  upload.single("photo"),
  async (req, res, next) => {
    try {
      const employee = await prisma.employee.findUnique({ where: { id: req.params.id } });
      if (!employee) return res.status(404).json({ message: "Employee not found" });
      const photoUrl = `/uploads/photos/${req.file.filename}`;
      await prisma.employee.update({ where: { id: req.params.id }, data: { photoUrl } });
      res.json({ photoUrl });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
