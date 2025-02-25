import { Router } from 'express';
import multer from 'multer';
import { CategoryController } from '../controllers/index';
import { verifyAuth } from '../middlewares/verifyAuth';

const router = Router();
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 500 * 1024 // 500KB
	}
});

router.post('/', verifyAuth, upload.single('image'), CategoryController.createCategory);
router.patch('/:id', verifyAuth, upload.single('image'), CategoryController.updateCategory);
router.post('/reorder', verifyAuth, CategoryController.reorderCategories);
router.get('/', CategoryController.listCategories);
router.get('/:id', CategoryController.getCategory);
router.delete('/:id', verifyAuth, CategoryController.deleteCategory);

export default router;
