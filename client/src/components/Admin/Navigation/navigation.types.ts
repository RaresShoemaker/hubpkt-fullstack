export type NavigationType = 'category' | 'page';

export interface BaseNavigationItem {
  label: string;
  type: NavigationType;
  icon?: React.ReactNode;
}

export interface CategoryNavigationItem extends BaseNavigationItem {
  type: 'category';
  category: string;  // For URLs like /dashboard?category=products
}

export interface PageNavigationItem extends BaseNavigationItem {
  type: 'page';
  path: string;     // For URLs like /dashboard/settings or /analytics
}

export type NavigationItem = CategoryNavigationItem | PageNavigationItem;