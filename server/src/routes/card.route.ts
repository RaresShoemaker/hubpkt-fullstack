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
router.patch('/:id/order', verifyAuth, CardController.updateCardOrder);
router.post('/reorder', verifyAuth, CardController.reorderCards);
router.delete('/:id', verifyAuth, CardController.deleteCard);

router.get('/home', CardController.getCardsHomepage);

router.get('/filter/filtered', verifyAuth, CardController.getFilteredCards);
router.get('/filter/hot', verifyAuth, CardController.getHotCards);
router.get('/filter/discover', verifyAuth, CardController.getDiscoverCards);
router.get('/filter/available', verifyAuth, CardController.getAvailableCards);
router.get('/filter/active', verifyAuth, CardController.getActiveCards);
router.get('/filter/randomized', verifyAuth, CardController.getCardsWithRandomizedOrder);
router.get('/filter/category/:categoryId', verifyAuth, CardController.getCardsByCategory);

export default router;