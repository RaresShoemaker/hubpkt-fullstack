import express from 'express';
import { UserController } from '../controllers/index';
import { verifyAuth } from '../middlewares/verifyAuth';

const router = express.Router();

router.route('/').get(verifyAuth, UserController.me);
router.route('/register').post(UserController.userRegister);
router.route('/login').post(UserController.loginUser);
router.route('/logout').post(UserController.logoutUser);

export default router;
