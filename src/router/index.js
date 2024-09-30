import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/home.vue'
import Default from '../layout/defaultLayout.vue'
import app from '@/main.js'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Default,
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth', // 平滑滚动
      }
    }
  },
})

// router.beforeEach((to, from, next) => {
//   app.config.globalProperties.$loading.show({txt: '加载中'})
//   setTimeout(() => {
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth' // 平滑滚动效果
//     });
//     next();
//   }, 1000)
// });
//
// router.afterEach((to, from) => {
//   setTimeout(() => {
//     app.config.globalProperties.$loading.hide()
//   }, 1000)
// })

export default router
