<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-title class="text-center py-4">
            <v-icon size="32" class="mr-2">mdi-nfc-variant</v-icon>
            NFC / QR코드 스캔
          </v-card-title>

          <v-card-text>
            <!-- NFC 스캔 영역 -->
            <div
              class="scan-area d-flex flex-column align-center justify-center pa-8"
              :style="getScanAreaStyle()"
              @click="startNfcScan"
            >
              <v-icon size="100" :color="nfcStatus === 'scanning' ? 'primary' : nfcStatus === 'success' ? 'success' : 'grey'" class="mb-4">
                {{ nfcStatus === 'scanning' ? 'mdi-nfc-search-variant' : nfcStatus === 'success' ? 'mdi-nfc-tap' : 'mdi-nfc-variant' }}
              </v-icon>

              <template v-if="!nfcSupported">
                <p class="text-h6 text-error">NFC를 지원하지 않는 환경입니다</p>
                <p class="text-caption text-grey">Chrome Android에서 접속해주세요</p>
              </template>
              <template v-else-if="nfcStatus === 'idle'">
                <p class="text-h6 text-grey-darken-1">터치하여 NFC 스캔 시작</p>
                <p class="text-caption text-grey">분전반의 NFC 태그에 폰을 가까이 대주세요</p>
              </template>
              <template v-else-if="nfcStatus === 'scanning'">
                <v-progress-circular indeterminate color="primary" class="mb-2"></v-progress-circular>
                <p class="text-h6 text-primary">NFC 태그를 찾는 중...</p>
                <p class="text-caption text-grey">분전반의 NFC 태그에 폰을 가까이 대주세요</p>
                <v-btn variant="text" color="error" class="mt-2" @click.stop="stopNfcScan">
                  스캔 취소
                </v-btn>
              </template>
              <template v-else-if="nfcStatus === 'success'">
                <p class="text-h6 text-success">태그 인식 완료!</p>
                <p class="text-body-1">분전반 ID: <strong>{{ scannedId }}</strong></p>
              </template>
            </div>

            <!-- NFC 권한 요청 안내 -->
            <v-alert v-if="nfcError" type="warning" variant="tonal" class="mt-4" closable @click:close="nfcError = ''">
              {{ nfcError }}
            </v-alert>

            <!-- 수동 입력 -->
            <v-divider class="my-6">
              <span class="text-caption text-grey px-2">또는 직접 입력</span>
            </v-divider>

            <v-text-field
              v-model="manualCode"
              label="분전반 코드 직접 입력"
              placeholder="예: A-001"
              prepend-inner-icon="mdi-keyboard"
              variant="outlined"
              clearable
              @keyup.enter="searchPanel"
            ></v-text-field>

            <v-btn
              block
              color="primary"
              size="large"
              class="mt-2"
              @click="searchPanel"
              :loading="loading"
            >
              <v-icon class="mr-2">mdi-magnify</v-icon>
              분전반 검색
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- 최근 스캔 이력 -->
        <v-card class="mt-4">
          <v-card-title>
            <v-icon class="mr-2">mdi-history</v-icon>
            최근 스캔 이력
          </v-card-title>
          <v-card-text>
            <v-list v-if="recentScans.length > 0">
              <v-list-item
                v-for="item in recentScans"
                :key="item.id"
                :to="`/panel/${item.code}`"
              >
                <template v-slot:prepend>
                  <v-avatar color="primary" size="40">
                    <v-icon color="white">mdi-lightning-bolt</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.location }} | {{ item.time }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-chip
                    :color="item.status === '정상' ? 'success' : item.status === '점검필요' ? 'warning' : 'error'"
                    size="small"
                  >
                    {{ item.status }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
            <div v-else class="text-center text-grey pa-4">
              스캔 이력이 없습니다
            </div>
          </v-card-text>
        </v-card>

        <!-- NFC 지원 안내 -->
        <v-card class="mt-4" variant="tonal" color="info">
          <v-card-text class="text-center">
            <v-icon class="mr-1">mdi-information</v-icon>
            <span class="text-caption">
              NFC 스캔은 Android Chrome에서만 지원됩니다.
              iOS는 수동 입력을 이용해주세요.
            </span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 스캔 결과 다이얼로그 -->
    <v-dialog v-model="showResultDialog" max-width="400">
      <v-card>
        <v-card-title class="text-center pt-6">
          <v-icon size="64" color="success" class="mb-2">mdi-check-circle</v-icon>
          <div>NFC 태그 인식 완료</div>
        </v-card-title>
        <v-card-text class="text-center">
          <p class="text-h6 mb-2">분전반 ID</p>
          <v-chip color="primary" size="large" class="text-h5 pa-4">
            {{ scannedId }}
          </v-chip>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-btn variant="outlined" @click="showResultDialog = false">닫기</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="goToPanel">
            <v-icon class="mr-1">mdi-arrow-right</v-icon>
            분전반 정보 보기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const manualCode = ref('')
const loading = ref(false)

// NFC 관련 상태
const nfcSupported = ref(false)
const nfcStatus = ref('idle') // idle, scanning, success
const nfcError = ref('')
const scannedId = ref('')
const showResultDialog = ref(false)
let nfcReader = null
let abortController = null

// 스낵바
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// 최근 스캔 이력 (localStorage에서 로드)
const recentScans = ref([])

// NFC 지원 확인
onMounted(() => {
  nfcSupported.value = 'NDEFReader' in window
  loadRecentScans()
})

onUnmounted(() => {
  stopNfcScan()
})

// 스캔 영역 스타일
const getScanAreaStyle = () => {
  const baseStyle = 'border-radius: 16px; min-height: 280px; cursor: pointer; transition: all 0.3s ease;'
  if (nfcStatus.value === 'scanning') {
    return baseStyle + 'border: 3px solid #1976D2; background: #e3f2fd;'
  } else if (nfcStatus.value === 'success') {
    return baseStyle + 'border: 3px solid #4CAF50; background: #e8f5e9;'
  }
  return baseStyle + 'border: 3px dashed #1976D2; background: #f5f5f5;'
}

// NFC 스캔 시작
const startNfcScan = async () => {
  if (!nfcSupported.value) {
    showSnackbar('이 기기에서는 NFC를 지원하지 않습니다', 'error')
    return
  }

  if (nfcStatus.value === 'scanning') return

  try {
    nfcStatus.value = 'scanning'
    nfcError.value = ''

    abortController = new AbortController()
    nfcReader = new NDEFReader()

    await nfcReader.scan({ signal: abortController.signal })

    nfcReader.addEventListener('reading', handleNfcReading)
    nfcReader.addEventListener('readingerror', handleNfcError)

  } catch (error) {
    console.error('NFC 스캔 시작 실패:', error)
    nfcStatus.value = 'idle'

    if (error.name === 'NotAllowedError') {
      nfcError.value = 'NFC 권한이 거부되었습니다. 설정에서 권한을 허용해주세요.'
    } else if (error.name === 'NotSupportedError') {
      nfcError.value = 'NFC가 지원되지 않거나 비활성화되어 있습니다.'
    } else {
      nfcError.value = `NFC 스캔 실패: ${error.message}`
    }
  }
}

// NFC 스캔 중지
const stopNfcScan = () => {
  if (abortController) {
    abortController.abort()
    abortController = null
  }
  nfcStatus.value = 'idle'
}

// NFC 읽기 처리
const handleNfcReading = ({ message, serialNumber }) => {
  console.log('NFC 태그 읽음:', { message, serialNumber })

  let panelId = ''

  // NDEF 메시지에서 분전반 ID 추출
  for (const record of message.records) {
    if (record.recordType === 'text') {
      const textDecoder = new TextDecoder(record.encoding)
      panelId = textDecoder.decode(record.data)
      break
    } else if (record.recordType === 'url') {
      const textDecoder = new TextDecoder()
      const url = textDecoder.decode(record.data)
      // URL에서 ID 추출 (예: https://example.com/panel/A-001)
      const match = url.match(/\/panel\/([A-Za-z0-9-]+)/)
      if (match) {
        panelId = match[1]
      }
      break
    }
  }

  // NDEF 레코드에서 못 찾으면 시리얼 번호 사용
  if (!panelId && serialNumber) {
    // 시리얼 번호를 분전반 ID 형식으로 변환
    panelId = convertSerialToId(serialNumber)
  }

  if (panelId) {
    nfcStatus.value = 'success'
    scannedId.value = panelId
    showResultDialog.value = true
    addToRecentScans(panelId)
    showSnackbar(`분전반 ${panelId} 인식 완료!`, 'success')

    // 3초 후 자동으로 상태 초기화
    setTimeout(() => {
      if (nfcStatus.value === 'success') {
        nfcStatus.value = 'idle'
      }
    }, 3000)
  }
}

// 시리얼 번호를 분전반 ID로 변환 (데모용)
const convertSerialToId = (serial) => {
  // 시리얼 번호의 마지막 4자리를 사용하여 ID 생성
  const lastFour = serial.replace(/:/g, '').slice(-4).toUpperCase()
  const prefix = ['A', 'B', 'C'][parseInt(lastFour[0], 16) % 3]
  const num = parseInt(lastFour.slice(-3), 16) % 100
  return `${prefix}-${String(num).padStart(3, '0')}`
}

// NFC 읽기 에러 처리
const handleNfcError = (event) => {
  console.error('NFC 읽기 에러:', event)
  showSnackbar('NFC 태그를 읽을 수 없습니다. 다시 시도해주세요.', 'error')
}

// 수동 검색
const searchPanel = () => {
  if (!manualCode.value) {
    showSnackbar('분전반 코드를 입력해주세요', 'warning')
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    addToRecentScans(manualCode.value)
    router.push(`/panel/${manualCode.value}`)
  }, 500)
}

// 분전반 정보 페이지로 이동
const goToPanel = () => {
  showResultDialog.value = false
  router.push(`/panel/${scannedId.value}`)
}

// 최근 스캔 이력에 추가
const addToRecentScans = (code) => {
  const now = new Date()
  const newScan = {
    id: Date.now(),
    code: code,
    name: `분전반 #${code}`,
    location: getLocationForCode(code),
    time: '방금 전',
    status: getStatusForCode(code),
    timestamp: now.toISOString()
  }

  // 중복 제거
  recentScans.value = recentScans.value.filter(s => s.code !== code)
  // 앞에 추가
  recentScans.value.unshift(newScan)
  // 최대 10개 유지
  recentScans.value = recentScans.value.slice(0, 10)

  // localStorage에 저장
  saveRecentScans()
}

// 코드별 위치 (더미 데이터)
const getLocationForCode = (code) => {
  const locations = {
    'A-001': '1공장 A구역',
    'A-015': '1공장 B구역',
    'B-003': '2공장 C구역',
    'B-015': '2공장 D구역',
    'C-001': '3공장 E구역',
    'C-008': '3공장 F구역',
  }
  return locations[code] || `${code[0]}공장`
}

// 코드별 상태 (더미 데이터)
const getStatusForCode = (code) => {
  const statuses = {
    'B-015': '고장',
    'C-001': '점검필요',
  }
  return statuses[code] || '정상'
}

// localStorage에서 이력 로드
const loadRecentScans = () => {
  try {
    const saved = localStorage.getItem('recentScans')
    if (saved) {
      recentScans.value = JSON.parse(saved)
      // 시간 업데이트
      updateTimes()
    }
  } catch (e) {
    console.error('이력 로드 실패:', e)
  }
}

// localStorage에 이력 저장
const saveRecentScans = () => {
  try {
    localStorage.setItem('recentScans', JSON.stringify(recentScans.value))
  } catch (e) {
    console.error('이력 저장 실패:', e)
  }
}

// 시간 텍스트 업데이트
const updateTimes = () => {
  const now = new Date()
  recentScans.value.forEach(scan => {
    if (scan.timestamp) {
      const diff = now - new Date(scan.timestamp)
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (minutes < 1) scan.time = '방금 전'
      else if (minutes < 60) scan.time = `${minutes}분 전`
      else if (hours < 24) scan.time = `${hours}시간 전`
      else scan.time = `${days}일 전`
    }
  })
}

// 스낵바 표시
const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}
</script>

<style scoped>
.scan-area:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}
</style>
