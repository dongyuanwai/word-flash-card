import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import WordLearning from '../components/WordLearning.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/learning',
      name: 'learning',
      component: WordLearning
    }
  ]
})

export default router 