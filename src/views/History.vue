<template>
  <v-container fluid class="pa-4">
    <!-- 필터 -->
    <v-card class="mb-4">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="검색"
              variant="outlined"
              density="compact"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="2">
            <v-select
              v-model="filterType"
              :items="['전체', '정기점검', '고장수리', '긴급점검']"
              label="작업유형"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="6" sm="2">
            <v-select
              v-model="filterResult"
              :items="['전체', '정상', '수리', '고장']"
              label="결과"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="6" sm="2">
            <v-text-field
              v-model="dateFrom"
              label="시작일"
              type="date"
              variant="outlined"
              density="compact"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="2">
            <v-text-field
              v-model="dateTo"
              label="종료일"
              type="date"
              variant="outlined"
              density="compact"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="1">
            <v-btn color="primary" icon="mdi-magnify"></v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 이력 테이블 -->
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>
          <v-icon class="mr-2">mdi-history</v-icon>
          작업 이력
        </span>
        <v-btn color="success" variant="outlined" size="small">
          <v-icon class="mr-1">mdi-download</v-icon>
          엑셀 다운로드
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="historyItems"
        :search="search"
        :items-per-page="15"
        class="elevation-0"
      >
        <template v-slot:item.type="{ item }">
          <v-chip :color="getTypeColor(item.type)" size="small" variant="outlined">
            {{ item.type }}
          </v-chip>
        </template>
        <template v-slot:item.result="{ item }">
          <v-chip :color="getResultColor(item.result)" size="small">
            {{ item.result }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-eye" size="small" variant="text" @click="showDetail(item)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- 상세 다이얼로그 -->
    <v-dialog v-model="detailDialog" max-width="600">
      <v-card v-if="selectedItem">
        <v-card-title>
          <v-icon class="mr-2">mdi-clipboard-text</v-icon>
          작업 상세 정보
        </v-card-title>
        <v-card-text>
          <v-table density="comfortable">
            <tbody>
              <tr>
                <td class="font-weight-bold" width="30%">작업일시</td>
                <td>{{ selectedItem.date }} {{ selectedItem.time }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">분전반</td>
                <td>{{ selectedItem.panel }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">작업유형</td>
                <td>{{ selectedItem.type }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">작업자</td>
                <td>{{ selectedItem.worker }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold">결과</td>
                <td>
                  <v-chip :color="getResultColor(selectedItem.result)" size="small">
                    {{ selectedItem.result }}
                  </v-chip>
                </td>
              </tr>
              <tr>
                <td class="font-weight-bold">내용</td>
                <td>{{ selectedItem.note }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="detailDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')
const filterType = ref('전체')
const filterResult = ref('전체')
const dateFrom = ref('')
const dateTo = ref('')
const detailDialog = ref(false)
const selectedItem = ref(null)

const headers = [
  { title: '작업일시', key: 'date', sortable: true },
  { title: '분전반', key: 'panel', sortable: true },
  { title: '작업유형', key: 'type', sortable: true },
  { title: '작업자', key: 'worker', sortable: true },
  { title: '결과', key: 'result', sortable: true },
  { title: '비고', key: 'note', sortable: false },
  { title: '', key: 'actions', sortable: false },
]

const historyItems = ref([
  { id: 1, date: '2024-11-28', time: '10:30', panel: '#A-001', type: '정기점검', worker: '김점검', result: '정상', note: '이상 없음' },
  { id: 2, date: '2024-11-28', time: '09:00', panel: '#A-015', type: '정기점검', worker: '김점검', result: '정상', note: '이상 없음' },
  { id: 3, date: '2024-11-27', time: '15:30', panel: '#B-015', type: '고장수리', worker: '이점검', result: '수리', note: '차단기 교체 완료' },
  { id: 4, date: '2024-11-27', time: '11:00', panel: '#B-003', type: '정기점검', worker: '박점검', result: '정상', note: '이상 없음' },
  { id: 5, date: '2024-11-26', time: '14:00', panel: '#C-001', type: '긴급점검', worker: '김점검', result: '고장', note: '누전 감지, 수리 필요' },
  { id: 6, date: '2024-11-26', time: '09:30', panel: '#A-002', type: '정기점검', worker: '이점검', result: '정상', note: '이상 없음' },
  { id: 7, date: '2024-11-25', time: '16:00', panel: '#B-022', type: '정기점검', worker: '박점검', result: '정상', note: '케이블 점검 완료' },
  { id: 8, date: '2024-11-25', time: '10:00', panel: '#C-008', type: '고장수리', worker: '김점검', result: '수리', note: '콘센트 교체' },
])

const getTypeColor = (type) => {
  switch (type) {
    case '정기점검': return 'primary'
    case '고장수리': return 'warning'
    case '긴급점검': return 'error'
    default: return 'grey'
  }
}

const getResultColor = (result) => {
  switch (result) {
    case '정상': return 'success'
    case '수리': return 'warning'
    case '고장': return 'error'
    default: return 'grey'
  }
}

const showDetail = (item) => {
  selectedItem.value = item
  detailDialog.value = true
}
</script>
