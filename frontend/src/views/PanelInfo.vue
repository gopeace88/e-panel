<template>
  <v-container fluid class="pa-4">
    <!-- 미등록 분전반 경고 -->
    <v-alert v-if="panel.unregistered" type="warning" variant="tonal" class="mb-4">
      <v-icon class="mr-2">mdi-alert-circle</v-icon>
      미등록 분전반입니다. 시스템에 등록되지 않은 분전반 ID입니다.
    </v-alert>

    <!-- 고장 알림 -->
    <v-alert v-if="panel.fault" type="error" variant="tonal" class="mb-4">
      <div class="d-flex align-center">
        <v-icon class="mr-2" size="large">mdi-alert-octagon</v-icon>
        <div>
          <div class="font-weight-bold">{{ panel.fault.type }}</div>
          <div class="text-caption">감지 시간: {{ panel.fault.detected }}</div>
          <div class="text-body-2">{{ panel.fault.description }}</div>
        </div>
      </div>
    </v-alert>

    <!-- 점검필요 알림 -->
    <v-alert v-if="panel.warning" type="warning" variant="tonal" class="mb-4">
      <div class="d-flex align-center">
        <v-icon class="mr-2" size="large">mdi-clock-alert</v-icon>
        <div>
          <div class="font-weight-bold">{{ panel.warning.type }}</div>
          <div class="text-caption">예정일: {{ panel.warning.dueDate }}</div>
          <div class="text-body-2">{{ panel.warning.description }}</div>
        </div>
      </div>
    </v-alert>

    <v-row>
      <v-col cols="12" md="6">
        <!-- 분전반 기본 정보 -->
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-information</v-icon>
            분전반 설비 정보
            <v-spacer></v-spacer>
            <v-chip :color="getStatusColor(panel.status)" size="small">
              {{ panel.status }}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <v-table density="comfortable">
              <tbody>
                <tr>
                  <td class="font-weight-bold text-grey-darken-1" width="40%">분전반 코드</td>
                  <td>
                    <v-chip color="primary" size="small" variant="outlined">
                      {{ panel.id }}
                    </v-chip>
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold text-grey-darken-1">분전반 명칭</td>
                  <td>{{ panel.name }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold text-grey-darken-1">전압 타입</td>
                  <td>
                    <v-chip :color="panel.type === '440V' ? 'blue' : 'amber'" size="small">
                      {{ panel.type }}
                    </v-chip>
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold text-grey-darken-1">정격 용량</td>
                  <td>{{ panel.rating }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold text-grey-darken-1">설치 위치</td>
                  <td>{{ panel.location }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold text-grey-darken-1">건물 / 층</td>
                  <td>{{ panel.building }} / {{ panel.floor }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold text-grey-darken-1">회로 수</td>
                  <td>{{ panel.activeCircuits }} / {{ panel.circuitCount }} 사용중</td>
                </tr>
                <tr>
                  <td class="font-weight-bold text-grey-darken-1">제조사 / 모델</td>
                  <td>{{ panel.manufacturer }} / {{ panel.model }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold text-grey-darken-1">설치일</td>
                  <td>{{ panel.installDate }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold text-grey-darken-1">마지막 점검일</td>
                  <td>{{ panel.lastInspection }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold text-grey-darken-1">다음 점검 예정</td>
                  <td>
                    <v-chip
                      :color="isOverdue(panel.nextInspection) ? 'error' : 'success'"
                      size="small"
                      variant="tonal"
                    >
                      {{ panel.nextInspection }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- GPS 위치 -->
        <v-card class="mt-4">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-map-marker</v-icon>
            GPS 위치 정보
          </v-card-title>
          <v-card-text>
            <div class="location-map d-flex align-center justify-center"
                 style="height: 200px; background: #e8f5e9; border-radius: 8px;">
              <div class="text-center">
                <v-icon size="48" color="success">mdi-map-marker-check</v-icon>
                <p class="mt-2">위도: {{ panel.gps?.lat?.toFixed(4) || '-' }}</p>
                <p>경도: {{ panel.gps?.lng?.toFixed(4) || '-' }}</p>
                <v-btn
                  size="small"
                  variant="text"
                  color="primary"
                  :href="`https://www.google.com/maps?q=${panel.gps?.lat},${panel.gps?.lng}`"
                  target="_blank"
                >
                  <v-icon class="mr-1">mdi-google-maps</v-icon>
                  지도에서 보기
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <!-- 실시간 모니터링 -->
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-gauge</v-icon>
            실시간 모니터링
            <v-spacer></v-spacer>
            <v-chip size="x-small" color="success" variant="tonal">
              <v-icon start size="small">mdi-circle</v-icon>
              실시간
            </v-chip>
          </v-card-title>
          <v-card-text>
            <!-- 3상 전압/전류 -->
            <v-row dense class="mb-4">
              <v-col cols="12">
                <div class="text-subtitle-2 mb-2">3상 전압 (V)</div>
                <div class="d-flex justify-space-around">
                  <div class="text-center">
                    <div class="text-h6 text-primary">{{ panel.monitoring?.voltage?.L1 || 0 }}</div>
                    <div class="text-caption">L1</div>
                  </div>
                  <div class="text-center">
                    <div class="text-h6" :class="panel.monitoring?.voltage?.L2 === 0 ? 'text-error' : 'text-primary'">
                      {{ panel.monitoring?.voltage?.L2 || 0 }}
                    </div>
                    <div class="text-caption">L2</div>
                  </div>
                  <div class="text-center">
                    <div class="text-h6 text-primary">{{ panel.monitoring?.voltage?.L3 || 0 }}</div>
                    <div class="text-caption">L3</div>
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-row dense class="mb-4">
              <v-col cols="12">
                <div class="text-subtitle-2 mb-2">3상 전류 (A)</div>
                <div class="d-flex justify-space-around">
                  <div class="text-center">
                    <div class="text-h6 text-warning">{{ panel.monitoring?.current?.L1 || 0 }}</div>
                    <div class="text-caption">L1</div>
                  </div>
                  <div class="text-center">
                    <div class="text-h6" :class="panel.monitoring?.current?.L2 === 0 ? 'text-error' : 'text-warning'">
                      {{ panel.monitoring?.current?.L2 || 0 }}
                    </div>
                    <div class="text-caption">L2</div>
                  </div>
                  <div class="text-center">
                    <div class="text-h6 text-warning">{{ panel.monitoring?.current?.L3 || 0 }}</div>
                    <div class="text-caption">L3</div>
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-3"></v-divider>

            <v-row>
              <v-col cols="6">
                <div class="text-center pa-3 rounded" style="background: #e8f5e9;">
                  <div class="text-h5 font-weight-bold text-success">{{ panel.monitoring?.power || 0 }}kW</div>
                  <div class="text-caption">소비 전력</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-center pa-3 rounded" style="background: #e3f2fd;">
                  <div class="text-h5 font-weight-bold text-primary">{{ panel.monitoring?.powerFactor || 0 }}</div>
                  <div class="text-caption">역률</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-center pa-3 rounded" :style="getTempStyle(panel.monitoring?.temperature)">
                  <div class="text-h5 font-weight-bold" :class="getTempClass(panel.monitoring?.temperature)">
                    {{ panel.monitoring?.temperature || 0 }}°C
                  </div>
                  <div class="text-caption">온도</div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-center pa-3 rounded" style="background: #f3e5f5;">
                  <div class="text-h5 font-weight-bold text-purple">{{ panel.monitoring?.humidity || 0 }}%</div>
                  <div class="text-caption">습도</div>
                </div>
              </v-col>
            </v-row>

            <!-- 상태 표시등 -->
            <v-divider class="my-4"></v-divider>
            <div class="d-flex justify-space-around">
              <div class="text-center">
                <v-avatar :color="alerts.leakage ? 'error' : 'success'" size="40">
                  <v-icon color="white" size="small">mdi-water</v-icon>
                </v-avatar>
                <p class="text-caption mt-1">누전</p>
              </div>
              <div class="text-center">
                <v-avatar :color="alerts.overload ? 'error' : 'success'" size="40">
                  <v-icon color="white" size="small">mdi-flash-alert</v-icon>
                </v-avatar>
                <p class="text-caption mt-1">과부하</p>
              </div>
              <div class="text-center">
                <v-avatar :color="alerts.ground ? 'error' : 'success'" size="40">
                  <v-icon color="white" size="small">mdi-electric-switch</v-icon>
                </v-avatar>
                <p class="text-caption mt-1">접지</p>
              </div>
              <div class="text-center">
                <v-avatar :color="alerts.door ? 'warning' : 'success'" size="40">
                  <v-icon color="white" size="small">mdi-door-open</v-icon>
                </v-avatar>
                <p class="text-caption mt-1">도어</p>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- 금일 체크리스트 -->
        <v-card class="mt-4">
          <v-card-title class="d-flex align-center justify-space-between">
            <span>
              <v-icon class="mr-2">mdi-clipboard-check</v-icon>
              금일 체크리스트
            </span>
            <v-chip color="primary" size="small">{{ checklist.filter(c => c.checked).length }}/{{ checklist.length }}</v-chip>
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item v-for="item in checklist" :key="item.id">
                <template v-slot:prepend>
                  <v-checkbox-btn v-model="item.checked" color="success"></v-checkbox-btn>
                </template>
                <v-list-item-title :class="{ 'text-decoration-line-through text-grey': item.checked }">
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 하단 액션 버튼 -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="4">
                <v-btn block color="primary" size="large" :to="`/checklist/${panelId}`">
                  <v-icon class="mr-2">mdi-clipboard-list</v-icon>
                  점검 시작
                </v-btn>
              </v-col>
              <v-col cols="12" sm="4">
                <v-btn block color="error" size="large" variant="outlined" :to="`/fault-report/${panelId}`">
                  <v-icon class="mr-2">mdi-alert</v-icon>
                  고장 신고
                </v-btn>
              </v-col>
              <v-col cols="12" sm="4">
                <v-btn block color="secondary" size="large" variant="outlined" @click="showHistory = true">
                  <v-icon class="mr-2">mdi-history</v-icon>
                  점검 이력
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 점검 이력 다이얼로그 -->
    <v-dialog v-model="showHistory" max-width="600">
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-history</v-icon>
          점검 이력 - {{ panel.id }}
        </v-card-title>
        <v-card-text>
          <v-timeline v-if="panel.history && panel.history.length > 0" density="compact">
            <v-timeline-item
              v-for="(history, index) in panel.history"
              :key="index"
              :dot-color="getHistoryColor(history.result)"
              size="small"
            >
              <div>
                <div class="font-weight-medium">{{ history.date }}</div>
                <div class="text-caption">
                  <v-chip size="x-small" :color="getHistoryTypeColor(history.type)" class="mr-1">
                    {{ history.type }}
                  </v-chip>
                </div>
                <div class="text-caption">점검자: {{ history.inspector }}</div>
                <div class="text-caption">
                  결과:
                  <v-chip size="x-small" :color="getHistoryColor(history.result)">
                    {{ history.result }}
                  </v-chip>
                </div>
                <div v-if="history.note" class="text-caption text-grey mt-1">{{ history.note }}</div>
              </div>
            </v-timeline-item>
          </v-timeline>
          <div v-else class="text-center text-grey pa-4">
            점검 이력이 없습니다.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showHistory = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPanelById } from '@/data/panelData'

const route = useRoute()
const panelId = ref(route.params.id)

const showHistory = ref(false)
const panel = ref({})
let realtimeInterval = null

// 10초 주기 실시간 데이터 패턴 (각 초별 변화량)
const realtimePatterns = {
  voltage: [0, 0.5, 1.0, 0.8, 0.3, -0.2, -0.5, -0.8, -0.3, 0],
  current: [0, 1.2, 2.5, 1.8, 0.5, -0.3, -1.5, -2.0, -1.0, 0],
  power: [0, 0.3, 0.8, 0.5, 0.2, -0.1, -0.4, -0.6, -0.2, 0],
  temperature: [0, 0.1, 0.3, 0.5, 0.4, 0.2, 0, -0.1, -0.2, 0],
  humidity: [0, 0.5, 1.0, 0.5, 0, -0.5, -1.0, -0.5, 0, 0]
}

let currentSecond = 0
const baseMonitoring = ref(null)

// 실시간 데이터 업데이트
const updateRealtimeData = () => {
  if (!panel.value.monitoring || !baseMonitoring.value) return

  const patternIdx = currentSecond % 10

  // 전압 업데이트 (L1, L2, L3)
  if (baseMonitoring.value.voltage && panel.value.monitoring.voltage) {
    const vDelta = realtimePatterns.voltage[patternIdx]
    panel.value.monitoring.voltage.L1 = +(baseMonitoring.value.voltage.L1 + vDelta + (Math.random() - 0.5) * 0.5).toFixed(1)
    if (baseMonitoring.value.voltage.L2 > 0) {
      panel.value.monitoring.voltage.L2 = +(baseMonitoring.value.voltage.L2 + vDelta * 0.8 + (Math.random() - 0.5) * 0.5).toFixed(1)
    }
    panel.value.monitoring.voltage.L3 = +(baseMonitoring.value.voltage.L3 + vDelta * 1.1 + (Math.random() - 0.5) * 0.5).toFixed(1)
  }

  // 전류 업데이트 (L1, L2, L3)
  if (baseMonitoring.value.current && panel.value.monitoring.current) {
    const cDelta = realtimePatterns.current[patternIdx]
    panel.value.monitoring.current.L1 = +(baseMonitoring.value.current.L1 + cDelta + (Math.random() - 0.5) * 0.3).toFixed(1)
    if (baseMonitoring.value.current.L2 > 0) {
      panel.value.monitoring.current.L2 = +(baseMonitoring.value.current.L2 + cDelta * 0.9 + (Math.random() - 0.5) * 0.3).toFixed(1)
    }
    panel.value.monitoring.current.L3 = +(baseMonitoring.value.current.L3 + cDelta * 1.05 + (Math.random() - 0.5) * 0.3).toFixed(1)
  }

  // 전력 업데이트
  const pDelta = realtimePatterns.power[patternIdx]
  panel.value.monitoring.power = +(baseMonitoring.value.power + pDelta + (Math.random() - 0.5) * 0.2).toFixed(1)

  // 온도 업데이트
  const tDelta = realtimePatterns.temperature[patternIdx]
  panel.value.monitoring.temperature = +(baseMonitoring.value.temperature + tDelta + (Math.random() - 0.5) * 0.1).toFixed(1)

  // 습도 업데이트
  const hDelta = realtimePatterns.humidity[patternIdx]
  panel.value.monitoring.humidity = Math.round(baseMonitoring.value.humidity + hDelta + (Math.random() - 0.5) * 0.5)

  currentSecond++
}

// 실시간 데이터 시뮬레이션 시작
const startRealtimeSimulation = () => {
  if (realtimeInterval) {
    clearInterval(realtimeInterval)
  }

  // 기본값 저장 (변화량 계산의 기준)
  if (panel.value.monitoring) {
    baseMonitoring.value = JSON.parse(JSON.stringify(panel.value.monitoring))
  }

  // 1초마다 업데이트
  realtimeInterval = setInterval(updateRealtimeData, 1000)
}

// 분전반 데이터 로드
const loadPanelData = () => {
  panel.value = getPanelById(panelId.value)

  // 상태별 알림 설정
  if (panel.value.status === '고장') {
    alerts.value.overload = true
  }
  if (panel.value.monitoring?.temperature > 50) {
    alerts.value.overload = true
  }

  // 실시간 시뮬레이션 시작
  currentSecond = 0
  startRealtimeSimulation()
}

// route 파라미터 변경 감시
watch(() => route.params.id, (newId) => {
  if (newId) {
    panelId.value = newId
    loadPanelData()
  }
})

onMounted(() => {
  loadPanelData()
})

onUnmounted(() => {
  if (realtimeInterval) {
    clearInterval(realtimeInterval)
  }
})

const alerts = ref({
  leakage: false,
  overload: false,
  ground: false,
  door: true
})

const checklist = ref([
  { id: 1, text: '외관 상태 점검', checked: true },
  { id: 2, text: '차단기 동작 확인', checked: true },
  { id: 3, text: '접지 상태 확인', checked: false },
  { id: 4, text: '케이블 연결 상태', checked: false },
  { id: 5, text: '파일럿 램프 확인', checked: false },
])

const getStatusColor = (status) => {
  switch (status) {
    case '정상': return 'success'
    case '점검필요': return 'warning'
    case '고장': return 'error'
    case '미등록': return 'grey'
    default: return 'grey'
  }
}

const getHistoryColor = (result) => {
  switch (result) {
    case '정상': return 'success'
    case '완료': return 'success'
    case '수리대기': return 'warning'
    case '경미한 이상': return 'warning'
    default: return 'grey'
  }
}

const getHistoryTypeColor = (type) => {
  switch (type) {
    case '정기점검': return 'primary'
    case '고장수리': return 'error'
    case '고장발생': return 'error'
    default: return 'grey'
  }
}

const getTempStyle = (temp) => {
  if (temp > 50) return 'background: #ffebee;'
  if (temp > 40) return 'background: #fff3e0;'
  return 'background: #e8f5e9;'
}

const getTempClass = (temp) => {
  if (temp > 50) return 'text-error'
  if (temp > 40) return 'text-warning'
  return 'text-success'
}

const isOverdue = (dateStr) => {
  if (!dateStr || dateStr === '-') return false
  const date = new Date(dateStr)
  return date < new Date()
}
</script>
