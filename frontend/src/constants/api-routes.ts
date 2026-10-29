export const API_ROUTES = {
  catalog: {
    works: '/works',
    suppliers: '/suppliers',
    users: '/users',
  },
  orders: {
    list: '/orders',
    byId: (id: number) => `/orders/${id}`,
    approve: (id: number) => `/orders/${id}/approve`,
    reject: (id: number) => `/orders/${id}/reject`,
  },
  approvalRules: {
    byWork: (workId: number | string) => `/works/${workId}/approval-rules`,
  },
} as const;
