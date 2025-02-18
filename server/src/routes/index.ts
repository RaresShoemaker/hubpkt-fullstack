import express from 'express';
import userRoute from './user.route';
import categoryRoute from './category.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  }
]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
})

export default router;