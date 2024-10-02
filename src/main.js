import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import load from './utils/loading.js'

import './assets/style/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(router).use(pinia).mount('#app')

export default app
