import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/let-us-chat/'),
  routes: [
    {
      path: '/',
      name: 'chat',
      component: () => import ('../views/ChatRoomView.vue')
    },
  ]
})

export default router
