<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <!-- 분전반 정보 헤더 -->
        <v-card class="mb-4">
          <v-card-text class="d-flex align-center">
            <v-avatar color="primary" size="56" class="mr-4">
              <v-icon color="white" size="32">mdi-lightning-bolt</v-icon>
            </v-avatar>
            <div>
              <div class="text-h6">분전반 #{{ panelId }}</div>
              <div class="text-caption text-grey">1공장 A구역 | 440V</div>
            </div>
            <v-spacer></v-spacer>
            <v-chip color="primary">
              진행률: {{ completedCount }}/{{ checkItems.length }}
            </v-chip>
          </v-card-text>
          <v-progress-linear
            :model-value="(completedCount / checkItems.length) * 100"
            color="primary"
            height="6"
          ></v-progress-linear>
        </v-card>

        <!-- 점검 항목 리스트 -->
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-clipboard-check</v-icon>
            점검 체크리스트
          </v-card-title>
          <v-card-text>
            <v-expansion-panels v-model="expandedPanel">
              <v-expansion-panel
                v-for="(category, index) in checkCategories"
                :key="index"
              >
                <v-expansion-panel-title>
                  <div class="d-flex align-center w-100">
                    <v-icon :color="getCategoryColor(category)" class="mr-3">{{ category.icon }}</v-icon>
                    <span class="font-weight-medium">{{ category.name }}</span>
                    <v-spacer></v-spacer>
                    <v-chip
                      :color="getCategoryProgress(category) === 100 ? 'success' : 'grey'"
                      size="small"
                      class="mr-2"
                    >
                      {{ getCategoryCheckedCount(category) }}/{{ category.items.length }}
                    </v-chip>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list density="compact">
                    <v-list-item
                      v-for="item in category.items"
                      :key="item.id"
                      class="px-0"
                    >
                      <template v-slot:prepend>
                        <v-checkbox
                          v-model="item.checked"
                          color="success"
                          hide-details
                        ></v-checkbox>
                      </template>
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                      <template v-slot:append>
                        <v-btn
                          v-if="item.checked"
                          icon="mdi-camera"
                          size="small"
                          variant="text"
                          color="primary"
                          @click="openCamera(item)"
                        ></v-btn>
                        <v-btn
                          icon="mdi-note-edit"
                          size="small"
                          variant="text"
                          color="grey"
                          @click="openNote(item)"
                        ></v-btn>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>

        <!-- 비고/메모 -->
        <v-card class="mt-4">
          <v-card-title>
            <v-icon class="mr-2">mdi-note-text</v-icon>
            점검 메모
          </v-card-title>
          <v-card-text>
            <v-textarea
              v-model="memo"
              label="점검 중 특이사항을 기록하세요"
              rows="3"
              variant="outlined"
            ></v-textarea>
          </v-card-text>
        </v-card>

        <!-- 하단 버튼 -->
        <v-card class="mt-4">
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-btn block size="large" variant="outlined" @click="saveDraft">
                  <v-icon class="mr-2">mdi-content-save</v-icon>
                  임시 저장
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  size="large"
                  color="primary"
                  :disabled="completedCount < checkItems.length"
                  :to="`/inspection/${panelId}`"
                >
                  <v-icon class="mr-2">mdi-check-circle</v-icon>
                  점검 완료
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col cols="12">
                <v-btn
                  block
                  size="large"
                  color="error"
                  variant="text"
                  :to="`/fault-report/${panelId}`"
                >
                  <v-icon class="mr-2">mdi-alert-circle</v-icon>
                  이상 발견 - 고장 신고
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 메모 다이얼로그 -->
    <v-dialog v-model="noteDialog" max-width="400">
      <v-card>
        <v-card-title>항목 메모</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="currentNote"
            label="메모 입력"
            rows="3"
            variant="outlined"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="noteDialog = false">취소</v-btn>
          <v-btn color="primary" @click="saveNote">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 스낵바 -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="2000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const panelId = route.params.id

const expandedPanel = ref([0])
const memo = ref('')
const noteDialog = ref(false)
const currentNote = ref('')
const currentItem = ref(null)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const checkCategories = ref([
  {
    name: '외관 점검',
    icon: 'mdi-eye',
    items: [
      { id: 1, text: '외함 손상 여부 확인', checked: false, note: '' },
      { id: 2, text: '도어 개폐 상태 확인', checked: false, note: '' },
      { id: 3, text: '보호커버 이탈 여부', checked: false, note: '' },
      { id: 4, text: '케이블 훼손 여부', checked: false, note: '' },
    ]
  },
  {
    name: '차단기 점검',
    icon: 'mdi-toggle-switch',
    items: [
      { id: 5, text: '메인 브레이커 동작 확인', checked: false, note: '' },
      { id: 6, text: '서브 브레이커 동작 확인', checked: false, note: '' },
      { id: 7, text: '차단기 외관 상태', checked: false, note: '' },
    ]
  },
  {
    name: '전기 안전',
    icon: 'mdi-flash',
    items: [
      { id: 8, text: '접지 연결 상태 확인', checked: false, note: '' },
      { id: 9, text: '누전 차단기 테스트', checked: false, note: '' },
      { id: 10, text: '절연 상태 확인', checked: false, note: '' },
    ]
  },
  {
    name: '표시등/계측',
    icon: 'mdi-led-on',
    items: [
      { id: 11, text: '파일럿 램프 점등 확인', checked: false, note: '' },
      { id: 12, text: '전압 계측값 확인', checked: false, note: '' },
      { id: 13, text: '전류 계측값 확인', checked: false, note: '' },
    ]
  },
  {
    name: '콘센트/커넥터',
    icon: 'mdi-power-plug',
    items: [
      { id: 14, text: '콘센트 상태 확인', checked: false, note: '' },
      { id: 15, text: '커넥터 연결 상태', checked: false, note: '' },
      { id: 16, text: '단자대 조임 상태', checked: false, note: '' },
    ]
  }
])

const checkItems = computed(() => {
  return checkCategories.value.flatMap(cat => cat.items)
})

const completedCount = computed(() => {
  return checkItems.value.filter(item => item.checked).length
})

const getCategoryCheckedCount = (category) => {
  return category.items.filter(item => item.checked).length
}

const getCategoryProgress = (category) => {
  return (getCategoryCheckedCount(category) / category.items.length) * 100
}

const getCategoryColor = (category) => {
  const progress = getCategoryProgress(category)
  if (progress === 100) return 'success'
  if (progress > 0) return 'warning'
  return 'grey'
}

const openCamera = (item) => {
  // 카메라 기능 구현
  showSnackbar('카메라 기능 준비중입니다', 'info')
}

const openNote = (item) => {
  currentItem.value = item
  currentNote.value = item.note
  noteDialog.value = true
}

const saveNote = () => {
  if (currentItem.value) {
    currentItem.value.note = currentNote.value
  }
  noteDialog.value = false
  showSnackbar('메모가 저장되었습니다')
}

const saveDraft = () => {
  showSnackbar('임시 저장되었습니다')
}

const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}
</script>
