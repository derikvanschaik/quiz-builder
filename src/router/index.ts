import { createRouter, createWebHistory } from 'vue-router'
import QuizBuilder from '../components/QuizBuilder.vue'
import QuizTaker from '../components/QuizTaker.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: QuizBuilder
    },
    {
      path: '/browse',
      name: 'browse',
      component: QuizTaker
    }
  ]
})

export default router
