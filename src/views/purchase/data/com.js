import {deepCopy} from '@/utils/assist'
// {
//   key: 'unCertifiedTransform',
//     name: '待认证转进项'
// }
const btnType = [{
  key: 'batchSetup',
  name: '理票'
}]
const filterForm = { // 过滤条件
  cust_nameOrInv_no:'',//发票号码或往来单位
  billTypeId: '全部', // 发票类型
  customer: '', // 往来单位
  invoiceNum: '', // 发票号码
  startAmount: '',
  endAmount: '',
  startDate: '',
  endDate: '',
  vm_state: '0'
}

export const mainTitle = {
  billDate: {
    name: '开票日期',
    value: '',
    width: 5
  },
  inv_no: {
    name: '发票号码',
    value: '',
    width: 5
  },
  dkyf: {
    name: '抵扣月份',
    value: '',
    width: 5
  },
  cust_name: {
    name: '往来单位',
    value: '',
    width: 5
  },
  sm_name: {
    name: '结算方式',
    value: '',
    id: '',
    width: 5,
    type: 'select',
    options: 'settleMethod'
  },
  acct: {
    name: '贷方科目',
    value: '',
    width: 5,
    type: 'autoComplete',
    options: 'creditSub',
    hasAssist: true
  }
  /*,
  other: {
    empty: true,
    width: 8
  }*/
}
const floatTitle = {
  jxBillNum: {
    labels: '本次理票：',
    detail: '进项发票共：',
    value: ''
  },
  ppBillNum: {
    labels: '其&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;中：',
    detail: '普通发票：',
    value: ''
  },
  zpYrzBillNum: {
    labels: '',
    detail: '专用发票（已认证）：',
    value: ''
  },
  zpWrzBillNum: {
    labels: '',
    detail: '专用发票（未认证）：',
    value: ''
  },
  dkYrzBillNum: {
    labels: '',
    detail: '代开专票（已认证）：',
    value: ''
  },
  dkWrzBillNum: {
    labels: '',
    detail: '代开专票（未认证）：',
    value: ''
  },
  jdcYrzBillNum: {
    labels: '',
    detail: '机动车（已认证）：',
    value: ''
  },
  jdcWrzBillNum: {
    labels: '',
    detail: '机动车（未认证） ',
    value: ''
  },
  hgYrzBillNum: {
    labels: '',
    detail: '海关（已认证）：',
    value: ''
  },
  tysgYrzBillNum: {
    labels: '',
    detail: '统一收购（已认证）：',
    value: ''
  },
  ncpYrzBillNum: {
    labels: '',
    detail: '农产品（已认证）：',
    value: ''
  },
  txfYrzBillNum: {
    labels: '',
    detail: '通行费（已认证）：',
    value: ''
  },
  txfWrzBillNum: {
    labels: '',
    detail: '通行费（未认证）：',
    value: ''
  },
  ppPendingNum: {
    labels: '回&nbsp;&nbsp;收&nbsp;&nbsp;站：',
    detail: '普票：',
    value: ''
  },
  zpPendingNum: {
    labels: '',
    detail: '专票：',
    value: ''
  },
  dkPendingNum: {
    labels: '',
    detail: '代开专票：',
    value: ''
  },
  jdcPendingNum: {
    labels: '',
    detail: '机动车：',
    value: ''
  },
  hgPendingNum: {
    labels: '',
    detail: '海关：',
    value: ''
  },
  tysgPendingNum: {
    labels: '',
    detail: '统一收购：',
    value: ''
  },
  ncpPendingNum: {
    labels: '',
    detail: '农产品：',
    value: ''
  },
  txfPendingNum: {
    labels: '',
    detail: '通行费：',
    value: ''
  },
  xgmZpBillNum: {
    labels: '',
    detail: '小规模专票：',
    value: ''
  },
  xgmDkBillNum: {
    labels: '',
    detail: '小规模代开专票：',
    value: ''
  },
  xgmJdcBillNum: {
    labels: '',
    detail: '小规模机动车：',
    value: ''
  },
  xgmTxfBillNum: {
    labels: '',
    detail: '小规模通行费：',
    value: ''
  }
}
const  xiaoFloatTitle ={
  jxBillNum: {
    labels: '本次理票：',
    detail: '进项发票共：',
    value: ''
  },
  ppBillNum: {
    labels: '其&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;中：',
    detail: '普通发票：',
    value: ''
  },
  zpYrzBillNum: {
    labels: '',
    detail: '专用发票：',
    value: ''
  },
  zpWrzBillNum: {
    labels: '',
    detail: '专用发票：',
    value: ''
  },
  dkYrzBillNum: {
    labels: '',
    detail: '代开专票：',
    value: ''
  },
  dkWrzBillNum: {
    labels: '',
    detail: '代开专票：',
    value: ''
  },
  jdcYrzBillNum: {
    labels: '',
    detail: '机动车：',
    value: ''
  },
  jdcWrzBillNum: {
    labels: '',
    detail: '机动车：',
    value: ''
  },
  hgYrzBillNum: {
    labels: '',
    detail: '海关 ：',
    value: ''
  },
  tysgYrzBillNum: {
    labels: '',
    detail: '统一收购 ：',
    value: ''
  },
  ncpYrzBillNum: {
    labels: '',
    detail: '农产品 ：',
    value: ''
  },
  txfYrzBillNum: {
    labels: '',
    detail: '通行费 ',
    value: ''
  },
  txfWrzBillNum: {
    labels: '',
    detail: '通行费 ',
    value: ''
  },
  xgmZpBillNum: {
    labels: '',
    detail: '专票：',
    value: ''
  },
  xgmDkBillNum: {
    labels: '',
    detail: '代开专票：',
    value: ''
  },
  xgmJdcBillNum: {
    labels: '',
    detail: '机动车：',
    value: ''
  },
  xgmTxfBillNum: {
    labels: '',
    detail: '通行费：',
    value: ''
  },
  ppPendingNum: {
    labels: '回&nbsp;&nbsp;收&nbsp;&nbsp;站：',
    detail: '普票：',
    value: ''
  },
  zpPendingNum: {
    labels: '',
    detail: '专票：',
    value: ''
  },
  dkPendingNum: {
    labels: '',
    detail: '代开专票：',
    value: ''
  },
  jdcPendingNum: {
    labels: '',
    detail: '机动车：',
    value: ''
  },
  hgPendingNum: {
    labels: '',
    detail: '海关：',
    value: ''
  },
  tysgPendingNum: {
    labels: '',
    detail: '统一收购：',
    value: ''
  },
  ncpPendingNum: {
    labels: '',
    detail: '农产品：',
    value: ''
  },
  txfPendingNum: {
    labels: '',
    detail: '通行费：',
    value: ''
  }
}

export const purData = {
  btnType,
  filterForm, // 过滤条件
  mainTitle,
  floatTitle,
  xiaoFloatTitle
}
const subModal = {
  radio: 'noMatch',  // all 全部，no 未匹配
  noNum: '0',
  allNum: '0',
  noMatchNum: '0',
  allList: [],
  noList: [],
  noMatchList: [],
  list: []
}
export const setupData = {
  step: 'zero',
  service: {
    inputVal: '', // 输入框的值 从科目设置返回时不需要刷新
    amount: 0, // 价税合计 +
    negativeAmount: 0, // 价税合计 -
    listNum: 0, // 发票数量
    list: [],  // 当前列表数据
    allList: [], // 全部数据
    deleteList: [], // 删除的数据 保存一份 保存时传给后台
    accountList:[], // 入账的发票信息
    accountNotList:[], // 不入账的发票信息
    accountNotListTwo:[],//不入帐信息的原始数据
    settleMethod: {} ,// 结算方式
    invoiceInfoList:[], //发票信息列表
    delAccountList:[], //不入账改入账
    addAccountList:[], // 入账改不入账
  },
  business: {
    inputVal: '',
    step: 'account',
    purchaseNumber: 0, // 采购统计 +
    accountNumber: 0, // 入账统计 -
    hjje: 0, // 合计金额
    negativeSum: 0, // 合计金额-
    hjse: 0, // 合计税额 +
    hgseB: 0, // 合计税额 -
    listNum: 0, // 发票数量
    list: [],  // 当前列表数据
    accountList: [], // 入账的发票信息
    accountNotList: [], // 不入账的发票信息
    oldAccountList: [],
    oldNotAccountList: []
  },
  subModal: {
    tabStep: 'one',
    contactCode: [],
    incomeCode: [],
    isFresh: 0,
    one: deepCopy(subModal),
    two: deepCopy(subModal)
  },
  batchSetupModal: {
    tabStep: 'one',
    editCustName: [],
    editGoodsName: [],
    one: deepCopy(subModal),
    two: deepCopy(subModal)
  }
}
export const setupModal = {
  modal: false
}
