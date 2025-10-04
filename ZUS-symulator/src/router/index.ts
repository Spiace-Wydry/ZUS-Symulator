import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/WelcomeView.vue') },
    { path: '/simulate', name: 'simulate', component: () => import('@/views/SimulationView.vue') },
    { path: '/results', name: 'results', component: () => import('@/views/ResultsView.vue') },
    { path: '/advanced', name: 'advanced', component: () => import('@/views/AdvancedDashboardView.vue') },
    { path: '/admin', name: 'admin', component: () => import('@/views/AdminPanelView.vue') },
  ],
})

export default router
