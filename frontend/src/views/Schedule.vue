<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12" md="8">
        <!-- 캘린더 -->
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <span>
              <v-icon class="mr-2">mdi-calendar</v-icon>
              점검 스케줄
            </span>
            <div>
              <v-btn icon="mdi-chevron-left" variant="text" @click="prevMonth"></v-btn>
              <span class="mx-2 font-weight-bold">{{ currentMonth }}</span>
              <v-btn icon="mdi-chevron-right" variant="text" @click="nextMonth"></v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <!-- 간단한 캘린더 그리드 -->
            <div class="calendar-grid">
              <div class="calendar-header d-flex">
                <div v-for="day in weekDays" :key="day" class="calendar-cell text-center font-weight-bold text-grey">
                  {{ day }}
                </div>
              </div>
              <div class="calendar-body">
                <div v-for="week in calendarWeeks" :key="week[0].date" class="d-flex">
                  <div
                    v-for="day in week"
                    :key="day.date"
                    class="calendar-cell pa-2"
                    :class="{ 'bg-grey-lighten-4': !day.isCurrentMonth, 'bg-primary-lighten-5': day.isToday }"
                  >
                    <div class="text-caption" :class="{ 'text-grey': !day.isCurrentMonth, 'font-weight-bold text-primary': day.isToday }">
                      {{ day.dayNum }}
                    </div>
                    <div v-for="event in day.events" :key="event.id" class="mt-1">
                      <v-chip
                        :color="event.status === 'completed' ? 'success' : 'primary'"
                        size="x-small"
                        class="w-100"
                        @click="showEventDetail(event)"
                      >
                        {{ event.title }}
                      </v-chip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <!-- 오늘의 일정 -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon class="mr-2">mdi-calendar-today</v-icon>
            오늘의 점검 일정
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                v-for="schedule in todaySchedules"
                :key="schedule.id"
                :to="`/panel/${schedule.panelCode}`"
              >
                <template v-slot:prepend>
                  <v-avatar :color="schedule.status === 'completed' ? 'success' : 'warning'" size="32">
                    <v-icon size="small" color="white">
                      {{ schedule.status === 'completed' ? 'mdi-check' : 'mdi-clock' }}
                    </v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ schedule.panelName }}</v-list-item-title>
                <v-list-item-subtitle>{{ schedule.time }} | {{ schedule.inspector }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- 이번주 예정 -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon class="mr-2">mdi-calendar-week</v-icon>
            이번 주 예정
          </v-card-title>
          <v-card-text>
            <div v-for="day in weekSchedules" :key="day.date" class="mb-3">
              <div class="text-caption font-weight-bold text-grey mb-1">{{ day.date }}</div>
              <v-chip
                v-for="item in day.items"
                :key="item.id"
                size="small"
                class="mr-1 mb-1"
                :color="item.status === 'completed' ? 'success' : 'primary'"
                variant="outlined"
              >
                {{ item.panel }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <!-- 새 일정 추가 -->
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-plus-circle</v-icon>
            점검 일정 추가
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="newSchedule.panel"
              :items="panelOptions"
              label="분전반 선택"
              variant="outlined"
              density="compact"
              class="mb-2"
            ></v-select>
            <v-text-field
              v-model="newSchedule.date"
              label="점검일"
              type="date"
              variant="outlined"
              density="compact"
              class="mb-2"
            ></v-text-field>
            <v-text-field
              v-model="newSchedule.time"
              label="점검 시간"
              type="time"
              variant="outlined"
              density="compact"
              class="mb-2"
            ></v-text-field>
            <v-select
              v-model="newSchedule.inspector"
              :items="inspectorOptions"
              label="담당자"
              variant="outlined"
              density="compact"
              class="mb-2"
            ></v-select>
            <v-btn color="primary" block @click="addSchedule">
              <v-icon class="mr-1">mdi-plus</v-icon>
              일정 추가
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" color="success">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const weekDays = ['일', '월', '화', '수', '목', '금', '토']
const currentDate = ref(new Date())
const snackbar = ref(false)
const snackbarText = ref('')

const currentMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  return `${year}년 ${month}월`
})

const calendarWeeks = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const weeks = []
  let currentWeek = []

  // 이전 달 날짜 채우기
  for (let i = 0; i < firstDay.getDay(); i++) {
    const prevDate = new Date(year, month, -firstDay.getDay() + i + 1)
    currentWeek.push({
      date: prevDate.toISOString(),
      dayNum: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: false,
      events: []
    })
  }

  // 현재 달 날짜
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    currentWeek.push({
      date: date.toISOString(),
      dayNum: day,
      isCurrentMonth: true,
      isToday,
      events: getEventsForDate(date)
    })

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  // 다음 달 날짜 채우기
  if (currentWeek.length > 0) {
    let nextDay = 1
    while (currentWeek.length < 7) {
      currentWeek.push({
        date: new Date(year, month + 1, nextDay).toISOString(),
        dayNum: nextDay++,
        isCurrentMonth: false,
        isToday: false,
        events: []
      })
    }
    weeks.push(currentWeek)
  }

  return weeks
})

const getEventsForDate = (date) => {
  const dateStr = date.toISOString().split('T')[0]
  // 샘플 이벤트
  const events = {
    '2024-12-01': [{ id: 1, title: 'A-001', status: 'pending' }],
    '2024-12-02': [{ id: 2, title: 'B-003', status: 'pending' }, { id: 3, title: 'C-008', status: 'pending' }],
    '2024-12-05': [{ id: 4, title: 'A-015', status: 'pending' }],
  }
  return events[dateStr] || []
}

const todaySchedules = ref([
  { id: 1, panelCode: 'A-001', panelName: '분전반 #A-001', time: '09:00', inspector: '김점검', status: 'completed' },
  { id: 2, panelCode: 'A-015', panelName: '분전반 #A-015', time: '10:30', inspector: '김점검', status: 'completed' },
  { id: 3, panelCode: 'B-003', panelName: '분전반 #B-003', time: '14:00', inspector: '이점검', status: 'pending' },
  { id: 4, panelCode: 'B-022', panelName: '분전반 #B-022', time: '15:30', inspector: '이점검', status: 'pending' },
])

const weekSchedules = ref([
  { date: '12월 2일 (월)', items: [{ id: 1, panel: 'B-003', status: 'pending' }, { id: 2, panel: 'C-008', status: 'pending' }] },
  { date: '12월 3일 (화)', items: [{ id: 3, panel: 'A-002', status: 'pending' }] },
  { date: '12월 5일 (목)', items: [{ id: 4, panel: 'A-015', status: 'pending' }, { id: 5, panel: 'B-022', status: 'pending' }] },
])

const newSchedule = ref({
  panel: '',
  date: '',
  time: '',
  inspector: ''
})

const panelOptions = ['A-001', 'A-002', 'A-015', 'B-003', 'B-015', 'B-022', 'C-001', 'C-008']
const inspectorOptions = ['김점검', '이점검', '박점검', '최점검']

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const showEventDetail = (event) => {
  console.log('Event clicked:', event)
}

const addSchedule = () => {
  if (newSchedule.value.panel && newSchedule.value.date) {
    snackbarText.value = '점검 일정이 추가되었습니다'
    snackbar.value = true
    newSchedule.value = { panel: '', date: '', time: '', inspector: '' }
  }
}
</script>

<style scoped>
.calendar-grid {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}
.calendar-cell {
  flex: 1;
  min-height: 80px;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}
.calendar-cell:last-child {
  border-right: none;
}
.calendar-header .calendar-cell {
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
.calendar-body > div:last-child .calendar-cell {
  border-bottom: none;
}
</style>
