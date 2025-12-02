<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-center py-4 bg-success">
            <v-icon size="32" class="mr-2" color="white">mdi-wrench-check</v-icon>
            <span class="text-white">고장 수리 완료</span>
          </v-card-title>

          <v-card-text class="pt-6">
            <!-- 고장 접수 정보 -->
            <v-alert type="info" variant="tonal" class="mb-6">
              <div class="font-weight-bold mb-2">접수 정보</div>
              <v-row dense>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-grey">접수번호</div>
                  <div>{{ faultInfo.ticketNumber }}</div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-grey">분전반</div>
                  <div>#{{ panelId }}</div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-grey">고장유형</div>
                  <div>{{ faultInfo.faultType }}</div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-grey">접수일시</div>
                  <div>{{ faultInfo.reportedAt }}</div>
                </v-col>
              </v-row>
            </v-alert>

            <!-- 수리 내용 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon class="mr-1" size="small">mdi-wrench</v-icon>
                수리 내용 *
              </div>
              <v-select
                v-model="repairType"
                :items="repairTypes"
                label="수리 유형 선택"
                variant="outlined"
                class="mb-3"
              ></v-select>
              <v-textarea
                v-model="repairDescription"
                label="수리 내용 상세 설명"
                placeholder="수행한 수리 작업을 상세히 기록해주세요"
                rows="4"
                variant="outlined"
              ></v-textarea>
            </div>

            <!-- 교체 부품 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon class="mr-1" size="small">mdi-cog</v-icon>
                교체 부품
              </div>
              <v-row v-for="(part, index) in replacedParts" :key="index" class="mb-2">
                <v-col cols="5">
                  <v-text-field
                    v-model="part.name"
                    label="부품명"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="part.quantity"
                    label="수량"
                    type="number"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="part.serialNo"
                    label="시리얼번호"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="1" class="d-flex align-center">
                  <v-btn icon="mdi-close" size="small" color="error" variant="text" @click="removePart(index)"></v-btn>
                </v-col>
              </v-row>
              <v-btn variant="outlined" size="small" @click="addPart">
                <v-icon class="mr-1">mdi-plus</v-icon>
                부품 추가
              </v-btn>
            </div>

            <!-- 수리 결과 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon class="mr-1" size="small">mdi-clipboard-check</v-icon>
                수리 결과 *
              </div>
              <v-radio-group v-model="repairResult" inline>
                <v-radio label="완전 수리" value="complete" color="success"></v-radio>
                <v-radio label="임시 조치" value="temporary" color="warning"></v-radio>
                <v-radio label="추가 수리 필요" value="incomplete" color="error"></v-radio>
              </v-radio-group>
            </div>

            <!-- 수리 후 테스트 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon class="mr-1" size="small">mdi-test-tube</v-icon>
                수리 후 테스트 결과
              </div>
              <v-list density="compact">
                <v-list-item v-for="test in testItems" :key="test.id">
                  <template v-slot:prepend>
                    <v-checkbox v-model="test.passed" color="success" hide-details></v-checkbox>
                  </template>
                  <v-list-item-title>{{ test.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </div>

            <!-- 수리 사진 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon class="mr-1" size="small">mdi-camera</v-icon>
                수리 완료 사진
              </div>
              <v-row>
                <v-col cols="4" sm="3">
                  <div
                    class="photo-upload d-flex align-center justify-center"
                    style="aspect-ratio: 1; background: #e8f5e9; border: 2px dashed #4caf50; border-radius: 8px; cursor: pointer;"
                  >
                    <div class="text-center">
                      <v-icon size="32" color="success">mdi-camera-plus</v-icon>
                      <div class="text-caption text-success">Before</div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="4" sm="3">
                  <div
                    class="photo-upload d-flex align-center justify-center"
                    style="aspect-ratio: 1; background: #e8f5e9; border: 2px dashed #4caf50; border-radius: 8px; cursor: pointer;"
                  >
                    <div class="text-center">
                      <v-icon size="32" color="success">mdi-camera-plus</v-icon>
                      <div class="text-caption text-success">After</div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>

            <!-- 수리자 정보 -->
            <div class="mb-6">
              <div class="text-subtitle-1 font-weight-bold mb-3">
                <v-icon class="mr-1" size="small">mdi-account-hard-hat</v-icon>
                수리자 정보
              </div>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="technician.name"
                    label="수리자 이름 *"
                    variant="outlined"
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="technician.phone"
                    label="연락처"
                    variant="outlined"
                    prepend-inner-icon="mdi-phone"
                  ></v-text-field>
                </v-col>
              </v-row>
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
              color="success"
              size="large"
              :loading="submitting"
              @click="submitRepair"
            >
              <v-icon class="mr-2">mdi-check</v-icon>
              수리 완료 처리
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 완료 다이얼로그 -->
    <v-dialog v-model="completeDialog" max-width="400" persistent>
      <v-card class="text-center pa-4">
        <v-icon size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
        <v-card-title class="text-h5">수리 완료 처리됨</v-card-title>
        <v-card-text>
          <p>수리 내역이 성공적으로 등록되었습니다.</p>
          <p class="text-caption text-grey mt-2">신고자에게 완료 알림이 전송됩니다.</p>
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

const repairType = ref('')
const repairDescription = ref('')
const repairResult = ref('complete')
const submitting = ref(false)
const completeDialog = ref(false)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const faultInfo = ref({
  ticketNumber: 'FLT-20241128',
  faultType: '차단기 불량',
  reportedAt: '2024-11-28 10:30'
})

const technician = ref({
  name: '',
  phone: ''
})

const repairTypes = [
  '부품 교체',
  '케이블 재결선',
  '접지 보강',
  '차단기 교체',
  '단자 조임',
  '청소 및 정비',
  '기타'
]

const replacedParts = ref([
  { name: '', quantity: 1, serialNo: '' }
])

const testItems = ref([
  { id: 1, name: '전압 정상 확인', passed: false },
  { id: 2, name: '누전 차단기 동작 테스트', passed: false },
  { id: 3, name: '접지 저항 측정', passed: false },
  { id: 4, name: '차단기 동작 테스트', passed: false },
])

const addPart = () => {
  replacedParts.value.push({ name: '', quantity: 1, serialNo: '' })
}

const removePart = (index) => {
  replacedParts.value.splice(index, 1)
}

const goBack = () => {
  router.back()
}

const submitRepair = () => {
  if (!repairDescription.value) {
    showSnackbar('수리 내용을 입력해주세요', 'error')
    return
  }
  if (!technician.value.name) {
    showSnackbar('수리자 이름을 입력해주세요', 'error')
    return
  }

  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    completeDialog.value = true
  }, 1500)
}

const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}
</script>
