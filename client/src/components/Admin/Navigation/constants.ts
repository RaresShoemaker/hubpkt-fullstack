import { NavigationItem } from './navigation.types';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  // Category management items
  {
    label: 'Products',
    type: 'category',
    category: 'products'
  },
  {
    label: 'Orders',
    type: 'category',
    category: 'orders'
  },
  {
    label: 'Users',
    type: 'category',
    category: 'users'
  },
  // Regular pages
  {
    label: 'Analytics',
    type: 'page',
    path: '/dashboard/analytics'
  },
  {
    label: 'Settings',
    type: 'page',
    path: '/dashboard/settings'
  }
];