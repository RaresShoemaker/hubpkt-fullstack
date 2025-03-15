import { Router } from 'express';
import multer from 'multer';
import { verifyAuth } from '../middlewares/verifyAuth';
import { CategoryDesignController } from '../controllers/index';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all design elements for a category
router.get('/category/:categoryId', CategoryDesignController.getCategoryDesignElements);

// Design Element routes
router.post('/elements', verifyAuth, upload.single('image'), CategoryDesignController.createDesignElement);
router.patch('/elements/:id', verifyAuth, upload.single('image'), CategoryDesignController.updateDesignElement);
router.delete('/elements/:id', verifyAuth, CategoryDesignController.deleteDesignElement);
router.get('/elements/category/:categoryId', CategoryDesignController.getDesignElementsByDeviceSize);
router.post('/elements/category/:categoryId/reorder', verifyAuth, CategoryDesignController.reorderDesignElements);

// HTML Element routes
router.post('/html-elements', verifyAuth, CategoryDesignController.createHtmlElement);
router.patch('/html-elements/:id', verifyAuth, CategoryDesignController.updateHtmlElement);
router.delete('/html-elements/:id', verifyAuth, CategoryDesignController.deleteHtmlElement);

export default router;