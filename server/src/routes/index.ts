import express from 'express';
import userRoute from './user.route';
import categoryRoute from './category.route';
import cardRoute from './card.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/cards',
    route: cardRoute,
  }
]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
})

export default router;