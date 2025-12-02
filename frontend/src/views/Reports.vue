<template>
  <v-container fluid class="pa-4">
    <v-row>
      <!-- 통계 요약 카드 -->
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title>
            <v-icon class="mr-2">mdi-chart-box</v-icon>
            이번 달 점검 현황 요약
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6" sm="3">
                <div class="text-center pa-4 rounded bg-primary-lighten-5">
                  <div class="text-h4 font-weight-bold text-primary">156</div>
                  <div class="text-caption">총 점검 건수</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="text-center pa-4 rounded bg-success-lighten-5">
                  <div class="text-h4 font-weight-bold text-success">142</div>
                  <div class="text-caption">정상 판정</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="text-center pa-4 rounded bg-warning-lighten-5">
                  <div class="text-h4 font-weight-bold text-warning">11</div>
                  <div class="text-caption">수리 완료</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="text-center pa-4 rounded bg-error-lighten-5">
                  <div class="text-h4 font-weight-bold text-error">3</div>
                  <div class="text-caption">고장 미처리</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- 차트 영역 -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-chart-bar</v-icon>
            월별 점검 현황
          </v-card-title>
          <v-card-text>
            <div style="height: 300px;">
              <Bar :data="monthlyChartData" :options="chartOptions" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-chart-pie</v-icon>
            고장 유형별 분포
          </v-card-title>
          <v-card-text>
            <div style="height: 300px;">
              <Pie :data="faultTypeChartData" :options="pieChartOptions" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <!-- 보고서 생성 -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-file-document</v-icon>
            보고서 생성
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="reportType"
              :items="reportTypes"
              label="보고서 유형"
              variant="outlined"
              class="mb-3"
            ></v-select>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="reportDateFrom"
                  label="시작일"
                  type="date"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="reportDateTo"
                  label="종료일"
                  type="date"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-select
              v-model="reportFormat"
              :items="['PDF', 'Excel', 'Word']"
              label="파일 형식"
              variant="outlined"
              class="mb-3"
            ></v-select>
            <v-btn color="primary" block size="large" @click="generateReport" :loading="generating">
              <v-icon class="mr-2">mdi-file-export</v-icon>
              보고서 생성
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 최근 생성 보고서 -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-folder-open</v-icon>
            최근 생성 보고서
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                v-for="report in recentReports"
                :key="report.id"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getFileColor(report.format)" size="36">
                    <v-icon size="small" color="white">{{ getFileIcon(report.format) }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ report.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ report.date }} | {{ report.size }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn icon="mdi-download" size="small" variant="text" color="primary"></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" color="success">
      보고서가 생성되었습니다.
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

const reportType = ref('')
const reportDateFrom = ref('')
const reportDateTo = ref('')
const reportFormat = ref('PDF')
const generating = ref(false)
const snackbar = ref(false)

const reportTypes = [
  '월간 점검 현황 보고서',
  '고장 분석 보고서',
  '분전반별 점검 이력',
  '작업자별 점검 실적',
  '전체 자산 현황'
]

const recentReports = ref([
  { id: 1, name: '11월 월간 점검 현황', date: '2024-11-30', format: 'PDF', size: '2.3MB' },
  { id: 2, name: '11월 고장 분석 보고서', date: '2024-11-28', format: 'Excel', size: '1.8MB' },
  { id: 3, name: '10월 월간 점검 현황', date: '2024-10-31', format: 'PDF', size: '2.1MB' },
  { id: 4, name: '3분기 실적 보고서', date: '2024-10-15', format: 'Word', size: '3.5MB' },
])

const monthlyChartData = ref({
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  datasets: [
    {
      label: '점검 완료',
      backgroundColor: '#4CAF50',
      data: [120, 135, 142, 138, 145, 150, 148, 155, 160, 158, 156, 0]
    },
    {
      label: '고장 발생',
      backgroundColor: '#FF5252',
      data: [8, 12, 6, 9, 11, 7, 10, 8, 5, 9, 14, 0]
    }
  ]
})

const faultTypeChartData = ref({
  labels: ['차단기 불량', '누전', '접지 이상', '케이블 손상', '콘센트 불량', '기타'],
  datasets: [{
    data: [25, 20, 15, 18, 12, 10],
    backgroundColor: ['#FF5252', '#FFC107', '#2196F3', '#9C27B0', '#FF9800', '#607D8B']
  }]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' }
  }
})

const pieChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right' }
  }
})

const getFileColor = (format) => {
  switch (format) {
    case 'PDF': return 'error'
    case 'Excel': return 'success'
    case 'Word': return 'primary'
    default: return 'grey'
  }
}

const getFileIcon = (format) => {
  switch (format) {
    case 'PDF': return 'mdi-file-pdf-box'
    case 'Excel': return 'mdi-file-excel'
    case 'Word': return 'mdi-file-word'
    default: return 'mdi-file'
  }
}

const generateReport = () => {
  generating.value = true
  setTimeout(() => {
    generating.value = false
    snackbar.value = true
  }, 2000)
}
</script>
