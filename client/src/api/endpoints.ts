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
    clientCategories: '/categories/category/client',
  },
  cards: {
    // Basic CRUD endpoints
    list: '/cards',
    create: '/cards',
    getOne: (id: string) => `/cards/${id}`,
    update: (id: string) => `/cards/${id}`,
    updateOrder: (id: string) => `/cards/${id}/order`,
    reorder: '/cards/reorder',
    delete: (id: string) => `/cards/${id}`,

    getHomeCards: '/cards/home/cards',
    getCreatorsCards: '/cards/creator/cards',
    
    // Filtering endpoints
    filtered: '/cards/filter/filtered',
    hot: '/cards/filter/hot',
    discover: '/cards/filter/discover',
    available: '/cards/filter/available',
    active: '/cards/filter/active',
    randomized: '/cards/filter/randomized',
    byCategory: (categoryId: string) => `/cards/filter/category/${categoryId}`,
  },
  categoryDesigns: {
    // Category Design endpoints
    create: '/category-designs',
    getOne: (id: string) => `/category-designs/elements/${id}`,
    getByCategory: (categoryId: string) => `/category-designs/category/${categoryId}`,
    update: (id: string) => `/category-designs/${id}`,
    delete: (id: string) => `/category-designs/${id}`,
    
    // Design Element endpoints
    createElement: '/category-designs/elements',
    updateElement: (id: string) => `/category-designs/elements/${id}`,
    deleteElement: (id: string) => `/category-designs/elements/${id}`,
    getElementsByDeviceSize: (categoryId: string) => `/category-designs/elements/category/${categoryId}`,
    reorderElements: (categoryId: string) => `/category-designs/elements/${categoryId}/reorder`,
    getCategoryDesignById: (id: string) => `/category-designs/design/${id}`,
    
    // HTML Element endpoints
    createHtmlElement: '/category-designs/html-elements',
    updateHtmlElement: (id: string) => `/category-designs/html-elements/${id}`,
    deleteHtmlElement: (id: string) => `/category-designs/html-elements/${id}`,
  },
} as const;