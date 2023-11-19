import { createRouter, createWebHistory } from 'vue-router'
import QuizBuilder from '../components/QuizBuilder.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: QuizBuilder
    }
  ]
})

export default router
