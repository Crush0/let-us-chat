import './assets/main.css'

import chatDirectives from "@/utils/chatDirectives"
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
// import router from './router'

const app = createApp(App)
app.use(createPinia())
// app.use(router)
app.use(chatDirectives)

app.mount('#app')
