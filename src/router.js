import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from './stores/user'
import Home from './views/Home.vue'
import Quiz from './views/Quiz.vue'
import Profile from './views/Profile.vue'
import Leaderboard from './views/Leaderboard.vue'
import Login from './views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/quiz/:quizId?',
    name: 'quiz',
    component: Quiz,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: Leaderboard
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router