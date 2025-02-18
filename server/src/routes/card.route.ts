import { Router } from 'express';
import multer from 'multer';
import { verifyAuth } from '../middlewares/verifyAuth';
import * as CardController from '../controllers/card.controller';

const router = Router();

// Multer configuration for handling file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

// Routes
router.post('/', verifyAuth, upload.single('image'), CardController.createCard);
router.put('/:id', verifyAuth, upload.single('image'), CardController.updateCard);
router.get('/:id', verifyAuth, CardController.getCard);
router.get('/', verifyAuth, CardController.listCards);
router.put('/:id/order', verifyAuth, CardController.updateCardOrder);
router.post('/reorder', verifyAuth, CardController.reorderCards);
router.delete('/:id', verifyAuth, CardController.deleteCard);

export default router;