<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-center py-4">
            <v-icon size="32" class="mr-2" color="success">mdi-clipboard-check</v-icon>
            점검 결과 입력
          </v-card-title>

          <v-card-text>
            <!-- 분전반 정보 -->
            <v-alert type="info" variant="tonal" class="mb-4">
              <div class="d-flex align-center">
                <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
                <strong>분전반 #{{ panelId }}</strong>
                <span class="mx-2">|</span>
                <span>1공장 A구역</span>
                <span class="mx-2">|</span>
                <span>440V</span>
              </div>
            </v-alert>

            <!-- 점검 결과 선택 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">점검 결과</div>
              <v-btn-toggle v-model="inspectionResult" mandatory color="primary" class="w-100">
                <v-btn value="normal" class="flex-grow-1" size="large">
                  <v-icon class="mr-2" color="success">mdi-check-circle</v-icon>
                  정상
                </v-btn>
                <v-btn value="minor" class="flex-grow-1" size="large">
                  <v-icon class="mr-2" color="warning">mdi-alert</v-icon>
                  경미한 이상
                </v-btn>
                <v-btn value="fault" class="flex-grow-1" size="large">
                  <v-icon class="mr-2" color="error">mdi-close-circle</v-icon>
                  고장
                </v-btn>
              </v-btn-toggle>
            </div>

            <!-- 계측값 입력 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">계측값 입력</div>
              <v-row>
                <v-col cols="6" sm="3">
                  <v-text-field
                    v-model="measurements.voltageR"
                    label="R상 전압 (V)"
                    type="number"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-text-field
                    v-model="measurements.voltageS"
                    label="S상 전압 (V)"
                    type="number"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-text-field
                    v-model="measurements.voltageT"
                    label="T상 전압 (V)"
                    type="number"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-text-field
                    v-model="measurements.current"
                    label="전류 (A)"
                    type="number"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>

            <!-- 이상 항목 (경미/고장 시) -->
            <div v-if="inspectionResult !== 'normal'" class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">이상 항목 선택</div>
              <v-chip-group v-model="selectedIssues" multiple column>
                <v-chip
                  v-for="issue in issueOptions"
                  :key="issue.value"
                  :value="issue.value"
                  filter
                  variant="outlined"
                >
                  {{ issue.label }}
                </v-chip>
              </v-chip-group>
            </div>

            <!-- 사진 첨부 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">사진 첨부</div>
              <v-row>
                <v-col v-for="(photo, index) in photos" :key="index" cols="4" sm="3">
                  <div class="photo-item position-relative" style="aspect-ratio: 1; background: #f5f5f5; border-radius: 8px;">
                    <img v-if="photo.url" :src="photo.url" class="w-100 h-100 rounded" style="object-fit: cover;">
                    <div v-else class="d-flex align-center justify-center h-100">
                      <v-icon size="32" color="grey">mdi-image</v-icon>
                    </div>
                    <v-btn
                      v-if="photo.url"
                      icon="mdi-close"
                      size="x-small"
                      color="error"
                      class="position-absolute"
                      style="top: 4px; right: 4px;"
                      @click="removePhoto(index)"
                    ></v-btn>
                  </div>
                </v-col>
                <v-col cols="4" sm="3">
                  <div
                    class="add-photo d-flex align-center justify-center cursor-pointer"
                    style="aspect-ratio: 1; background: #e3f2fd; border: 2px dashed #1976D2; border-radius: 8px;"
                    @click="addPhoto"
                  >
                    <v-icon size="32" color="primary">mdi-camera-plus</v-icon>
                  </div>
                </v-col>
              </v-row>
            </div>

            <!-- 점검 소견 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">점검 소견</div>
              <v-textarea
                v-model="comment"
                label="점검 내용 및 특이사항을 기록하세요"
                rows="4"
                variant="outlined"
              ></v-textarea>
            </div>

            <!-- 점검자 서명 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">점검자 정보</div>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="inspector.name"
                    label="점검자 이름"
                    variant="outlined"
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="inspector.department"
                    label="소속 부서"
                    variant="outlined"
                    prepend-inner-icon="mdi-domain"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <v-btn variant="outlined" size="large" @click="goBack">
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              이전
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              size="large"
              :loading="submitting"
              @click="submitInspection"
            >
              <v-icon class="mr-2">mdi-send</v-icon>
              점검 완료 제출
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 완료 다이얼로그 -->
    <v-dialog v-model="completeDialog" max-width="400" persistent>
      <v-card class="text-center pa-4">
        <v-icon size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
        <v-card-title class="text-h5">점검 완료</v-card-title>
        <v-card-text>
          점검 결과가 성공적으로 제출되었습니다.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" size="large" block to="/">
            대시보드로 이동
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const panelId = route.params.id

const inspectionResult = ref('normal')
const selectedIssues = ref([])
const comment = ref('')
const submitting = ref(false)
const completeDialog = ref(false)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const measurements = ref({
  voltageR: 440,
  voltageS: 438,
  voltageT: 441,
  current: 125
})

const photos = ref([
  { url: '' },
  { url: '' },
])

const inspector = ref({
  name: '김점검',
  department: '전기설비팀'
})

const issueOptions = [
  { value: 'leakage', label: '누전 감지' },
  { value: 'overload', label: '과부하' },
  { value: 'ground', label: '접지 이상' },
  { value: 'breaker', label: '차단기 불량' },
  { value: 'cable', label: '케이블 손상' },
  { value: 'cover', label: '보호커버 이탈' },
  { value: 'lamp', label: '파일럿 램프 불량' },
  { value: 'outlet', label: '콘센트 불량' },
  { value: 'door', label: '도어 손상' },
  { value: 'other', label: '기타' },
]

const addPhoto = () => {
  // 실제로는 카메라/갤러리 접근
  photos.value.push({ url: '' })
}

const removePhoto = (index) => {
  photos.value.splice(index, 1)
}

const goBack = () => {
  router.back()
}

const submitInspection = () => {
  if (!inspector.value.name) {
    snackbarText.value = '점검자 이름을 입력해주세요'
    snackbarColor.value = 'error'
    snackbar.value = true
    return
  }

  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    completeDialog.value = true
  }, 1500)
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.add-photo:hover {
  background: #bbdefb !important;
}
</style>
