export const API_ENDPOINTS = {
  auth: {
    me: '/user',
    register: '/user/register',
    login: '/user/login',
    logout: '/user/logout',
  },
  categories: {
    list: '/categories',
    create: '/categories',
    getOne: (id: string) => `/categories/${id}`,
    update: (id: string) => `/categories/${id}`,
    updateOrder: (id: string) => `/categories/${id}/order`,
    reorder: '/categories/reorder',
    delete: (id: string) => `/categories/${id}`,
  },
  cards: {
    list: '/cards',
    create: '/cards',
    getOne: (id: string) => `/cards/${id}`,
    update: (id: string) => `/cards/${id}`,
    updateOrder: (id: string) => `/cards/${id}/order`,
    reorder: '/cards/reorder',
    delete: (id: string) => `/cards/${id}`,
  },
} as const;