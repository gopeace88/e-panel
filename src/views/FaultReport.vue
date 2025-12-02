<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-center py-4 bg-error">
            <v-icon size="32" class="mr-2" color="white">mdi-alert-circle</v-icon>
            <span class="text-white">고장 신고 및 접수</span>
          </v-card-title>

          <v-card-text class="pt-6">
            <!-- 분전반 정보 -->
            <v-alert type="error" variant="tonal" class="mb-6">
              <div class="d-flex align-center">
                <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
                <strong>분전반 #{{ panelId }}</strong>
                <span class="mx-2">|</span>
                <span>1공장 A구역</span>
                <span class="mx-2">|</span>
                <span>440V</span>
              </div>
            </v-alert>

            <!-- 고장 유형 선택 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon class="mr-1" size="small">mdi-alert</v-icon>
                고장 유형 선택 *
              </div>
              <v-chip-group v-model="faultType" mandatory column>
                <v-chip
                  v-for="type in faultTypes"
                  :key="type.value"
                  :value="type.value"
                  :color="faultType === type.value ? 'error' : undefined"
                  filter
                  variant="outlined"
                  size="large"
                >
                  <v-icon start>{{ type.icon }}</v-icon>
                  {{ type.label }}
                </v-chip>
              </v-chip-group>
            </div>

            <!-- 긴급도 선택 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon class="mr-1" size="small">mdi-speedometer</v-icon>
                긴급도 *
              </div>
              <v-radio-group v-model="urgency" inline>
                <v-radio label="긴급" value="urgent" color="error"></v-radio>
                <v-radio label="높음" value="high" color="warning"></v-radio>
                <v-radio label="보통" value="normal" color="info"></v-radio>
                <v-radio label="낮음" value="low" color="success"></v-radio>
              </v-radio-group>
            </div>

            <!-- 고장 증상 설명 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon class="mr-1" size="small">mdi-text-box</v-icon>
                고장 증상 설명 *
              </div>
              <v-textarea
                v-model="description"
                label="고장 증상을 상세히 설명해주세요"
                placeholder="예: 차단기가 자동으로 트립되며, 복구 후에도 반복적으로 발생함"
                rows="4"
                variant="outlined"
                :rules="[v => !!v || '고장 증상을 입력해주세요']"
              ></v-textarea>
            </div>

            <!-- 사진/영상 첨부 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon class="mr-1" size="small">mdi-camera</v-icon>
                사진 첨부 (권장)
              </div>
              <v-row>
                <v-col v-for="n in 4" :key="n" cols="3">
                  <div
                    class="photo-upload d-flex align-center justify-center"
                    style="aspect-ratio: 1; background: #ffebee; border: 2px dashed #ef5350; border-radius: 8px; cursor: pointer;"
                  >
                    <div class="text-center">
                      <v-icon size="32" color="error">mdi-camera-plus</v-icon>
                      <div class="text-caption text-error">사진 {{ n }}</div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>

            <!-- 신고자 정보 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon class="mr-1" size="small">mdi-account</v-icon>
                신고자 정보
              </div>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="reporter.name"
                    label="이름 *"
                    variant="outlined"
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="reporter.phone"
                    label="연락처 *"
                    variant="outlined"
                    prepend-inner-icon="mdi-phone"
                    placeholder="010-0000-0000"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="reporter.department"
                    label="소속 부서"
                    variant="outlined"
                    prepend-inner-icon="mdi-domain"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="reporter.location"
                    label="현재 위치"
                    variant="outlined"
                    prepend-inner-icon="mdi-map-marker"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>

            <!-- 추가 요청사항 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon class="mr-1" size="small">mdi-message-text</v-icon>
                추가 요청사항
              </div>
              <v-textarea
                v-model="additionalRequest"
                label="수리팀에 전달할 추가 요청사항"
                rows="2"
                variant="outlined"
              ></v-textarea>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <v-btn variant="outlined" size="large" @click="goBack">
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              취소
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              size="large"
              :loading="submitting"
              @click="submitReport"
            >
              <v-icon class="mr-2">mdi-send</v-icon>
              고장 신고 접수
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 접수 완료 다이얼로그 -->
    <v-dialog v-model="completeDialog" max-width="400" persistent>
      <v-card class="text-center pa-4">
        <v-icon size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
        <v-card-title class="text-h5">접수 완료</v-card-title>
        <v-card-text>
          <p>고장 신고가 접수되었습니다.</p>
          <p class="text-h6 font-weight-bold mt-2">접수번호: {{ ticketNumber }}</p>
          <p class="text-caption text-grey mt-2">담당자가 배정되면 알림을 드립니다.</p>
        </v-card-text>
        <v-card-actions class="flex-column">
          <v-btn color="primary" size="large" block class="mb-2" to="/">
            대시보드로 이동
          </v-btn>
          <v-btn variant="outlined" size="large" block :to="`/panel/${panelId}`">
            분전반 정보로 돌아가기
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

const faultType = ref('')
const urgency = ref('normal')
const description = ref('')
const additionalRequest = ref('')
const submitting = ref(false)
const completeDialog = ref(false)
const ticketNumber = ref('')

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const reporter = ref({
  name: '',
  phone: '',
  department: '',
  location: ''
})

const faultTypes = [
  { value: 'leakage', label: '누전', icon: 'mdi-water' },
  { value: 'breaker', label: '차단기 불량', icon: 'mdi-toggle-switch-off' },
  { value: 'overload', label: '과부하', icon: 'mdi-flash-alert' },
  { value: 'ground', label: '접지 이상', icon: 'mdi-electric-switch' },
  { value: 'cable', label: '케이블 손상', icon: 'mdi-cable-data' },
  { value: 'outlet', label: '콘센트 불량', icon: 'mdi-power-plug-off' },
  { value: 'lamp', label: '표시등 불량', icon: 'mdi-led-off' },
  { value: 'door', label: '도어/외함 손상', icon: 'mdi-door-open' },
  { value: 'other', label: '기타', icon: 'mdi-help-circle' },
]

const goBack = () => {
  router.back()
}

const submitReport = () => {
  if (!faultType.value) {
    showSnackbar('고장 유형을 선택해주세요', 'error')
    return
  }
  if (!description.value) {
    showSnackbar('고장 증상을 입력해주세요', 'error')
    return
  }
  if (!reporter.value.name || !reporter.value.phone) {
    showSnackbar('신고자 정보를 입력해주세요', 'error')
    return
  }

  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    ticketNumber.value = 'FLT-' + Date.now().toString().slice(-8)
    completeDialog.value = true
  }, 1500)
}

const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}
</script>
