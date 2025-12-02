import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: '점검 서버 대시보드' }
  },
  {
    path: '/scan',
    name: 'QRScan',
    component: () => import('../views/QRScan.vue'),
    meta: { title: 'QR코드 스캔' }
  },
  {
    path: '/panel/:id',
    name: 'PanelInfo',
    component: () => import('../views/PanelInfo.vue'),
    meta: { title: '분전반 설비 정보' }
  },
  {
    path: '/checklist/:id',
    name: 'Checklist',
    component: () => import('../views/Checklist.vue'),
    meta: { title: '체크리스트 점검' }
  },
  {
    path: '/inspection/:id',
    name: 'Inspection',
    component: () => import('../views/Inspection.vue'),
    meta: { title: '점검 결과 입력' }
  },
  {
    path: '/fault-report/:id',
    name: 'FaultReport',
    component: () => import('../views/FaultReport.vue'),
    meta: { title: '고장 신고' }
  },
  {
    path: '/repair-complete/:id',
    name: 'RepairComplete',
    component: () => import('../views/RepairComplete.vue'),
    meta: { title: '수리 완료' }
  },
  {
    path: '/panels',
    name: 'PanelList',
    component: () => import('../views/PanelList.vue'),
    meta: { title: '분전반 목록' }
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: () => import('../views/Schedule.vue'),
    meta: { title: '점검 스케줄' }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/History.vue'),
    meta: { title: '작업 이력' }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/Reports.vue'),
    meta: { title: '보고서' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '스마트 분전반 관제 시스템'
  next()
})

export default router
