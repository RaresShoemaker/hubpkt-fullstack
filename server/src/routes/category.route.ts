import { Router } from "express";
import multer from "multer";
import {CategoryController} from "../controllers/index";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 // 500KB
  }
});

router.post("/", upload.single("image"), CategoryController.createCategory);
router.patch("/:id", upload.single("image"), CategoryController.updateCategory);
router.patch("/:id/order", CategoryController.updateCategoryOrder);
router.post("/reorder", CategoryController.reorderCategories);
router.get("/", CategoryController.listCategories);
router.get("/:id", CategoryController.getCategory);
router.delete("/:id", CategoryController.deleteCategory);

export default router;