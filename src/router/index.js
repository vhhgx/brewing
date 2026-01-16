import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页', showBottomSheet: true }
  },
  {
    path: '/recipe/:id',
    name: 'RecipeDetail',
    component: () => import('@/components/recipes/RecipeDetail.vue'),
    meta: { title: '方案详情', showBottomSheet: false }
  },
  {
    path: '/brewing/:recipeId',
    name: 'Brewing',
    component: () => import('@/views/BrewingView.vue'),
    meta: { title: '准备冲煮', showBottomSheet: false }
  },
  {
    path: '/tasting/:recordId',
    name: 'TastingNotes',
    component: () => import('@/views/TastingNotesView.vue'),
    meta: { title: '品鉴记录', showBottomSheet: false }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/HistoryView.vue'),
    meta: { title: '历史记录', showBottomSheet: true }
  },
  {
    path: '/record/:id',
    name: 'RecordDetail',
    component: () => import('@/components/tasting/RecordDetail.vue'),
    meta: { title: '记录详情', showBottomSheet: false }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: '个人中心', showBottomSheet: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫：设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 手冲咖啡助手` : '手冲咖啡助手'
  next()
})

export default router
