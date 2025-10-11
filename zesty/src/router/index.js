import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FridgeView from '@/views/FridgeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/userhome',
      name: 'userhome',
      component: () => import('../views/UserHomeView.vue'),
    },
    {
      path: '/fridge',
      name: 'Fridge',
      component: () => import('../views/FridgeView.vue'),
    },
    {
      path: '/recipe',
      name: 'Recipe',
      component: () => import('../views/RecipeView.vue'),
    },
  ],
})

export default router
