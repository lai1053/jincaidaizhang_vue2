import {deepCopy} from '@/utils/assist'
export const filterForm = {
  cust_nameOrInv_no:'',
  cust_name: '',
  inv_no: '',
  bill_date_start: '',
  bill_date_end: '',
  min_amount: '',
  max_amount: '',
  vm_state: '0'
}

export const subModal = {
  radio: 'noMatch',  // all 全部，no 未匹配
  noMatchNum: '0',
  noNum: '0',
  allNum: '0',
  allList: [],
  noList: [],
  noMatchList: [],
  list: [],
  editList: []
}

export const setupData = {
  step: 'one',
  service: {
    amount: 0,
    negativeAmount: 0,
    list: [],
    editList: [],
    settleMethod: {},
    allList: [],
    inputVal: '',
    listNum: 0
  },
  subModal: {
    tabStep: 'one',
    contactCode: [],
    isFresh: 0,
    incomeCode: [],
    one: deepCopy(subModal),
    two: deepCopy(subModal)
  }
}
export const setupModal = {
  modal: false
}
export const floatTitle = {
  xxBillNum: {
    labels: '本次理票：',
    detail: '销项发票共：',
    value: ''
  },
  ppBillNum: {
    labels: '其&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;中：',
    detail: '普通发票：',
    value: ''
  },
  zpBillNum: {
    labels: '',
    detail: '专用发票：',
    value: ''
  },
  dkBillNum: {
    labels: '',
    detail: '代开专用发票个数：',
    value: ''
  },
  jdcBillNum: {
    labels: '',
    detail: '机动车发票：',
    value: ''
  }
}
