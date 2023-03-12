import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('../views/person/Tasks.vue')
  },
  {
    path: '/people',
    name: 'People',
    component: () => import('../views/admin/People.vue')
  },
  {
    path: '/companies',
    name: 'Companies',
    component: () => import('../views/admin/Companies.vue')
  },
  {
    path: '/profile',
    nane: 'Profile',
    component: () => import('../views/person/Profile.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'active',
  routes
})

router.beforeEach(async (to) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const auth = useAuthStore()
  if (authRequired && !auth.isAuthenticated) {
    return '/login'
  }
  if (!authRequired && auth.isAuthenticated && auth.isAdmin) {
    return '/companies'
  }
  if (!authRequired && auth.isAuthenticated && !auth.isAdmin) {
    return '/tasks'
  }
})
export default router
