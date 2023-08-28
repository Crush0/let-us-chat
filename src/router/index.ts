import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory('/let-us-chat/'),
  routes: [
    {
      path: '/',
      name: 'chat',
      component: () => import ('../views/ChatRoomView.vue')
    },
  ]
})

export default router
