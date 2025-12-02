<template>
  <v-container fluid class="pa-4">
    <!-- 상단 통계 카드 -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card color="primary" variant="flat">
          <v-card-text class="text-white">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ stats.totalPanels }}</div>
                <div class="text-subtitle-1">전체 분전반</div>
              </div>
              <v-icon size="48" color="white" opacity="0.7">mdi-lightning-bolt</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card color="success" variant="flat">
          <v-card-text class="text-white">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ stats.normalPanels }}</div>
                <div class="text-subtitle-1">정상 가동</div>
              </div>
              <v-icon size="48" color="white" opacity="0.7">mdi-check-circle</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card color="warning" variant="flat">
          <v-card-text class="text-white">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ stats.pendingInspection }}</div>
                <div class="text-subtitle-1">점검 대기</div>
              </div>
              <v-icon size="48" color="white" opacity="0.7">mdi-clock-outline</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card color="error" variant="flat">
          <v-card-text class="text-white">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h4 font-weight-bold">{{ stats.faultPanels }}</div>
                <div class="text-subtitle-1">고장/이상</div>
              </div>
              <v-icon size="48" color="white" opacity="0.7">mdi-alert-circle</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 차트 및 최근 점검 -->
    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-chart-bar</v-icon>
            월별 점검 현황
          </v-card-title>
          <v-card-text>
            <div class="chart-container" style="height: 300px;">
              <Bar :data="chartData" :options="chartOptions" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-clipboard-list</v-icon>
            오늘의 점검 스케줄
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                v-for="schedule in todaySchedules"
                :key="schedule.id"
                :subtitle="schedule.location"
              >
                <template v-slot:prepend>
                  <v-avatar :color="schedule.status === 'completed' ? 'success' : 'warning'" size="32">
                    <v-icon size="small" color="white">
                      {{ schedule.status === 'completed' ? 'mdi-check' : 'mdi-clock' }}
                    </v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ schedule.panelName }}</v-list-item-title>
                <template v-slot:append>
                  <span class="text-caption">{{ schedule.time }}</span>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 최근 알림 및 분전반 위치 -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-bell-ring</v-icon>
            최근 알림
          </v-card-title>
          <v-card-text>
            <v-timeline density="compact" side="end">
              <v-timeline-item
                v-for="alert in recentAlerts"
                :key="alert.id"
                :dot-color="alert.type === 'error' ? 'error' : alert.type === 'warning' ? 'warning' : 'info'"
                size="small"
              >
                <div class="d-flex justify-space-between">
                  <span class="font-weight-medium">{{ alert.message }}</span>
                  <span class="text-caption text-grey">{{ alert.time }}</span>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-map-marker</v-icon>
            분전반 위치 현황
          </v-card-title>
          <v-card-text>
            <div class="location-placeholder d-flex align-center justify-center" style="height: 250px; background: #f5f5f5; border-radius: 8px;">
              <div class="text-center">
                <v-icon size="64" color="grey">mdi-map</v-icon>
                <p class="text-grey mt-2">GPS 위치 지도</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const stats = ref({
  totalPanels: 1000,
  normalPanels: 892,
  pendingInspection: 85,
  faultPanels: 23
})

const chartData = ref({
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  datasets: [
    {
      label: '정상',
      backgroundColor: '#4CAF50',
      data: [65, 59, 80, 81, 56, 55, 40, 72, 68, 75, 82, 78]
    },
    {
      label: '고장',
      backgroundColor: '#FF5252',
      data: [5, 8, 3, 4, 7, 2, 6, 4, 3, 5, 2, 4]
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  }
})

const todaySchedules = ref([
  { id: 1, panelName: '분전반 #A-001', location: '1공장 A구역', time: '09:00', status: 'completed' },
  { id: 2, panelName: '분전반 #A-015', location: '1공장 B구역', time: '10:30', status: 'completed' },
  { id: 3, panelName: '분전반 #B-003', location: '2공장 C구역', time: '14:00', status: 'pending' },
  { id: 4, panelName: '분전반 #B-022', location: '2공장 D구역', time: '15:30', status: 'pending' },
  { id: 5, panelName: '분전반 #C-008', location: '3공장 E구역', time: '16:30', status: 'pending' },
])

const recentAlerts = ref([
  { id: 1, message: '분전반 #B-015 누전 감지', type: 'error', time: '10분 전' },
  { id: 2, message: '분전반 #A-032 점검 완료', type: 'info', time: '25분 전' },
  { id: 3, message: '분전반 #C-001 전압 이상', type: 'warning', time: '1시간 전' },
  { id: 4, message: '분전반 #A-018 정기점검 예정', type: 'info', time: '2시간 전' },
])
</script>

<style scoped>
.chart-container {
  position: relative;
}
</style>
