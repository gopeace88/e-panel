// 분전반 더미 데이터
// 기준일: 2025-12-02

export const panels = {
  'A-001': {
    id: 'A-001',
    name: '분전반 #A-001',
    type: '220V',
    voltage: 220,
    location: '1도크 A구역',
    floor: '1층',
    building: '선박건조동',
    installDate: '2023-03-15',
    lastInspection: '2025-11-15',
    nextInspection: '2026-02-15',
    status: '정상',
    circuitCount: 24,
    activeCircuits: 22,
    gps: { lat: 34.6852, lng: 126.4901 },
    manufacturer: '(주)전력시스템',
    model: 'EPS-2024A',
    serialNumber: 'EPS2024A001234',
    rating: '400A',
    monitoring: {
      voltage: { L1: 221.5, L2: 219.8, L3: 220.3 },
      current: { L1: 45.2, L2: 42.8, L3: 44.1 },
      power: 28.5,
      powerFactor: 0.95,
      temperature: 35.2,
      humidity: 45
    },
    history: [
      { date: '2025-11-15', type: '정기점검', result: '정상', inspector: '김철수' },
      { date: '2025-08-20', type: '정기점검', result: '정상', inspector: '이영희' },
      { date: '2025-05-10', type: '고장수리', result: '완료', inspector: '박민수', note: '차단기 교체' }
    ]
  },
  'A-015': {
    id: 'A-015',
    name: '분전반 #A-015',
    type: '220V',
    voltage: 220,
    location: '1도크 B구역',
    floor: '2층',
    building: '선박건조동',
    installDate: '2023-05-20',
    lastInspection: '2025-10-28',
    nextInspection: '2026-01-28',
    status: '정상',
    circuitCount: 32,
    activeCircuits: 30,
    gps: { lat: 34.6858, lng: 126.4912 },
    manufacturer: '(주)전력시스템',
    model: 'EPS-3032A',
    serialNumber: 'EPS3032A005678',
    rating: '600A',
    monitoring: {
      voltage: { L1: 220.1, L2: 221.2, L3: 219.5 },
      current: { L1: 78.5, L2: 75.2, L3: 77.8 },
      power: 48.2,
      powerFactor: 0.93,
      temperature: 38.5,
      humidity: 48
    },
    history: [
      { date: '2025-10-28', type: '정기점검', result: '정상', inspector: '김철수' },
      { date: '2025-07-15', type: '정기점검', result: '정상', inspector: '이영희' }
    ]
  },
  'B-003': {
    id: 'B-003',
    name: '분전반 #B-003',
    type: '440V',
    voltage: 440,
    location: '2도크 C구역',
    floor: '1층',
    building: '블록조립동',
    installDate: '2022-08-10',
    lastInspection: '2025-11-01',
    nextInspection: '2026-02-01',
    status: '정상',
    circuitCount: 48,
    activeCircuits: 45,
    gps: { lat: 34.6840, lng: 126.4925 },
    manufacturer: '(주)고압전기',
    model: 'HVP-4048B',
    serialNumber: 'HVP4048B009876',
    rating: '1000A',
    monitoring: {
      voltage: { L1: 438.5, L2: 441.2, L3: 439.8 },
      current: { L1: 125.5, L2: 122.8, L3: 124.1 },
      power: 145.8,
      powerFactor: 0.92,
      temperature: 42.1,
      humidity: 42
    },
    history: [
      { date: '2025-11-01', type: '정기점검', result: '정상', inspector: '박민수' },
      { date: '2025-08-05', type: '정기점검', result: '정상', inspector: '김철수' },
      { date: '2025-04-20', type: '정기점검', result: '경미한 이상', inspector: '이영희', note: '단자 조임 필요' }
    ]
  },
  'B-015': {
    id: 'B-015',
    name: '분전반 #B-015',
    type: '440V',
    voltage: 440,
    location: '2도크 D구역',
    floor: '2층',
    building: '블록조립동',
    installDate: '2021-12-05',
    lastInspection: '2025-09-20',
    nextInspection: '2025-12-20',
    status: '고장',
    circuitCount: 36,
    activeCircuits: 32,
    gps: { lat: 34.6835, lng: 126.4938 },
    manufacturer: '(주)고압전기',
    model: 'HVP-4036B',
    serialNumber: 'HVP4036B007654',
    rating: '800A',
    monitoring: {
      voltage: { L1: 435.2, L2: 0, L3: 438.1 },
      current: { L1: 98.5, L2: 0, L3: 95.2 },
      power: 85.5,
      powerFactor: 0.88,
      temperature: 55.8,
      humidity: 52
    },
    fault: {
      type: 'L2상 결상',
      detected: '2025-12-01 14:35',
      severity: '긴급',
      description: 'L2상 전압 감지 불가, 즉시 점검 필요'
    },
    history: [
      { date: '2025-12-01', type: '고장발생', result: '수리대기', inspector: '시스템', note: 'L2상 결상 감지' },
      { date: '2025-09-20', type: '정기점검', result: '정상', inspector: '박민수' },
      { date: '2025-06-15', type: '정기점검', result: '정상', inspector: '김철수' }
    ]
  },
  'C-001': {
    id: 'C-001',
    name: '분전반 #C-001',
    type: '220V',
    voltage: 220,
    location: '3도크 E구역',
    floor: '1층',
    building: '도장동',
    installDate: '2024-02-28',
    lastInspection: '2025-09-10',
    nextInspection: '2025-11-10',
    status: '점검필요',
    circuitCount: 24,
    activeCircuits: 24,
    gps: { lat: 34.6868, lng: 126.4885 },
    manufacturer: '(주)전력시스템',
    model: 'EPS-2024A',
    serialNumber: 'EPS2024A012345',
    rating: '400A',
    monitoring: {
      voltage: { L1: 218.5, L2: 222.8, L3: 217.2 },
      current: { L1: 52.5, L2: 48.8, L3: 55.1 },
      power: 32.8,
      powerFactor: 0.91,
      temperature: 48.5,
      humidity: 58
    },
    warning: {
      type: '정기점검 기한 초과',
      dueDate: '2025-11-10',
      description: '정기점검 예정일이 지났습니다. 빠른 점검이 필요합니다.'
    },
    history: [
      { date: '2025-09-10', type: '정기점검', result: '정상', inspector: '이영희' },
      { date: '2025-06-05', type: '정기점검', result: '정상', inspector: '박민수' }
    ]
  },
  'C-008': {
    id: 'C-008',
    name: '분전반 #C-008',
    type: '220V',
    voltage: 220,
    location: '3도크 F구역',
    floor: '3층',
    building: '도장동',
    installDate: '2024-06-15',
    lastInspection: '2025-11-20',
    nextInspection: '2026-02-20',
    status: '정상',
    circuitCount: 16,
    activeCircuits: 14,
    gps: { lat: 34.6875, lng: 126.4872 },
    manufacturer: '(주)전력시스템',
    model: 'EPS-1016A',
    serialNumber: 'EPS1016A023456',
    rating: '200A',
    monitoring: {
      voltage: { L1: 220.8, L2: 219.5, L3: 221.2 },
      current: { L1: 28.5, L2: 25.8, L3: 27.1 },
      power: 17.2,
      powerFactor: 0.96,
      temperature: 32.1,
      humidity: 40
    },
    history: [
      { date: '2025-11-20', type: '정기점검', result: '정상', inspector: '김철수' },
      { date: '2025-08-25', type: '정기점검', result: '정상', inspector: '이영희' }
    ]
  }
}

// 분전반 ID로 데이터 조회
export const getPanelById = (id) => {
  const normalizedId = id.toUpperCase()

  if (panels[normalizedId]) {
    return { ...panels[normalizedId] }
  }

  // 등록되지 않은 분전반의 경우 기본 템플릿 생성
  const prefix = normalizedId[0] || 'X'
  const num = normalizedId.split('-')[1] || '000'

  return {
    id: normalizedId,
    name: `분전반 #${normalizedId}`,
    type: prefix === 'B' ? '440V' : '220V',
    voltage: prefix === 'B' ? 440 : 220,
    location: `${prefix}구역`,
    floor: '1층',
    building: '미등록',
    installDate: '-',
    lastInspection: '-',
    nextInspection: '-',
    status: '미등록',
    circuitCount: 0,
    activeCircuits: 0,
    gps: { lat: 34.6850, lng: 126.4900 },
    manufacturer: '-',
    model: '-',
    serialNumber: '-',
    rating: '-',
    monitoring: {
      voltage: { L1: 0, L2: 0, L3: 0 },
      current: { L1: 0, L2: 0, L3: 0 },
      power: 0,
      powerFactor: 0,
      temperature: 0,
      humidity: 0
    },
    history: [],
    unregistered: true
  }
}

// 전체 분전반 목록 조회
export const getAllPanels = () => {
  return Object.values(panels)
}

// 상태별 분전반 조회
export const getPanelsByStatus = (status) => {
  return Object.values(panels).filter(p => p.status === status)
}

// 건물별 분전반 조회
export const getPanelsByBuilding = (building) => {
  return Object.values(panels).filter(p => p.building === building)
}

// 통계 데이터
export const getStatistics = () => {
  const allPanels = Object.values(panels)
  return {
    total: allPanels.length,
    normal: allPanels.filter(p => p.status === '정상').length,
    warning: allPanels.filter(p => p.status === '점검필요').length,
    fault: allPanels.filter(p => p.status === '고장').length,
    byType: {
      '220V': allPanels.filter(p => p.type === '220V').length,
      '440V': allPanels.filter(p => p.type === '440V').length
    },
    byBuilding: {
      '선박건조동': allPanels.filter(p => p.building === '선박건조동').length,
      '블록조립동': allPanels.filter(p => p.building === '블록조립동').length,
      '도장동': allPanels.filter(p => p.building === '도장동').length
    }
  }
}
