const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/IndexPage.vue') },
      { path: 'crear', component: () => import('@/pages/CrearAnuncioPage.vue') },
      { path: 'carrito', component: () => import('@/pages/CarritoPage.vue') },
      { path: 'estadisticas', component: () => import('@/pages/EstadisticasPage.vue') },
      { path: 'anuncio/:id', component: () => import('@/pages/AnuncioPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
]

export default routes
