<template>
  <v-container fluid class="pa-4">
    <!-- 필터 및 검색 -->
    <v-card class="mb-4">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="분전반 검색"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="2">
            <v-select
              v-model="filterVoltage"
              :items="['전체', '220V', '440V']"
              label="전압"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="6" sm="2">
            <v-select
              v-model="filterStatus"
              :items="['전체', '정상', '점검필요', '고장']"
              label="상태"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="6" sm="2">
            <v-select
              v-model="filterLocation"
              :items="['전체', '1공장', '2공장', '3공장']"
              label="위치"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="6" sm="2">
            <v-btn color="primary" block>
              <v-icon class="mr-1">mdi-filter</v-icon>
              필터 적용
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 분전반 목록 테이블 -->
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>
          <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
          분전반 목록
        </span>
        <v-chip color="primary">총 {{ panels.length }}대</v-chip>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="filteredPanels"
        :search="search"
        :items-per-page="10"
        class="elevation-0"
      >
        <template v-slot:item.voltage="{ item }">
          <v-chip :color="item.voltage === '440V' ? 'blue' : 'amber'" size="small">
            {{ item.voltage }}
          </v-chip>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small">
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-eye" size="small" variant="text" color="primary" :to="`/panel/${item.code}`"></v-btn>
          <v-btn icon="mdi-clipboard-check" size="small" variant="text" color="success" :to="`/checklist/${item.code}`"></v-btn>
          <v-btn icon="mdi-alert" size="small" variant="text" color="error" :to="`/fault-report/${item.code}`"></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const filterVoltage = ref('전체')
const filterStatus = ref('전체')
const filterLocation = ref('전체')

const headers = [
  { title: '코드', key: 'code', sortable: true },
  { title: '명칭', key: 'name', sortable: true },
  { title: '전압', key: 'voltage', sortable: true },
  { title: '위치', key: 'location', sortable: true },
  { title: '마지막 점검', key: 'lastInspection', sortable: true },
  { title: '상태', key: 'status', sortable: true },
  { title: '작업', key: 'actions', sortable: false },
]

const panels = ref([
  { code: 'A-001', name: '가설분전반 #A-001', voltage: '440V', location: '1공장 A구역', lastInspection: '2024-11-28', status: '정상' },
  { code: 'A-002', name: '가설분전반 #A-002', voltage: '440V', location: '1공장 A구역', lastInspection: '2024-11-27', status: '정상' },
  { code: 'A-015', name: '가설분전반 #A-015', voltage: '220V', location: '1공장 B구역', lastInspection: '2024-11-26', status: '점검필요' },
  { code: 'B-003', name: '가설분전반 #B-003', voltage: '440V', location: '2공장 C구역', lastInspection: '2024-11-25', status: '정상' },
  { code: 'B-015', name: '가설분전반 #B-015', voltage: '440V', location: '2공장 D구역', lastInspection: '2024-11-20', status: '고장' },
  { code: 'B-022', name: '가설분전반 #B-022', voltage: '220V', location: '2공장 D구역', lastInspection: '2024-11-28', status: '정상' },
  { code: 'C-001', name: '가설분전반 #C-001', voltage: '440V', location: '3공장 E구역', lastInspection: '2024-11-24', status: '점검필요' },
  { code: 'C-008', name: '가설분전반 #C-008', voltage: '220V', location: '3공장 F구역', lastInspection: '2024-11-28', status: '정상' },
])

const filteredPanels = computed(() => {
  return panels.value.filter(panel => {
    if (filterVoltage.value !== '전체' && panel.voltage !== filterVoltage.value) return false
    if (filterStatus.value !== '전체' && panel.status !== filterStatus.value) return false
    if (filterLocation.value !== '전체' && !panel.location.includes(filterLocation.value)) return false
    return true
  })
})

const getStatusColor = (status) => {
  switch (status) {
    case '정상': return 'success'
    case '점검필요': return 'warning'
    case '고장': return 'error'
    default: return 'grey'
  }
}
</script>
