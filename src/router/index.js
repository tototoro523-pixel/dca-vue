import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AnalysisInputView from '@/views/AnalysisInputView.vue'
import AnalysisResultView from '@/views/AnalysisResultView.vue'
import AiReportView from '@/views/AiReportView.vue'
import HistoryView from '@/views/HistoryView.vue'
import GuideView from '@/views/GuideView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: AnalysisInputView,
    },
    {
      path: '/result',
      name: 'result',
      component: AnalysisResultView,
    },
    {
      path: '/ai-report',
      name: 'ai-report',
      component: AiReportView,
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView,
    },
    {
      path: '/guide',
      name: 'guide',
      component: GuideView,
    },
  ],
})

export default router
