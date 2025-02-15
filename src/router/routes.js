const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'main', component: () => import('pages/IndexPage.vue') },
      { path: 'admin', component: () => import('pages/AdminPage.vue') },
      { path: 'grafana', component: () => import('pages/GrafanaPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
