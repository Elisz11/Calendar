import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../Views/Home.view.vue'
import SettingsView from '../Views/Settings.view.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    }
  ],
})

export default router