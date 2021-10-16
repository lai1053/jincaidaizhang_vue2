import {transColumns} from '@/views/fund/data/transData'
const columns = [{
  prop: 'billDate',
  label: '交易日期',
  align: 'left',
  width: '102px',
  sortable: 'custom'
}, {
  prop: 'counterparty',
  label: '对方户名',
  align: 'left',
  width: '',
  tip: 'counterparty',
  sortable: 'custom'
}, {
  prop: 'summary',
  label: '交易摘要',
  align: 'left',
  width: '',
  tip: 'summary',
  sortable: 'custom'
}, {
  prop: 'pay_amount',
  label: '支出金额',
  align: 'right',
  width: '',
  tip: 'pay_amount',
  className: 'td-right',
  sortable: 'custom'
}, {
  prop: 'collect_amount',
  label: '收入金额',
  align: 'right',
  width: '',
  tip: 'collect_amount',
  className: 'td-right',
  sortable: 'custom'
}, {
  prop: 'acct',
  label: '会计科目',
  align: 'left',
  minWidth: '180px',
  options: 'acctList',
  className: 'edit-row-box',
  edit: true,
  sortable: 'custom'
}, {
  prop: 'vm_state',
  label: '凭证',
  align: 'center',
  width: '98px',
  desc: 'vm_state_desc',
  value: 'vt_num_list',
  sortable: 'custom'
}, {
  prop: 'operation',
  label: '操作',
  align: 'center',
  width: '100px'
},{
  width: '20px',
  align: 'right',
  className: 'td-right',
  remarks: true
}]

const filterForm = { // 过滤条件
  billTypeId: '0', // 单据类型 51000015收款 51000016付款 0：全部（收款和付款）
  acctSetState: '0', // 会计科目设置状态：0：全部；1：未设置；2：已设置
  vm_state: '0', // 凭证状态
}

const tranModal = {  // 导入预览列表
  modal: false,  // 弹出框控制
  columns: transColumns,
  list: [],
  amount: {
    billNum: '0',        // 流水数目，即清单条数
    collectTotalAmount: '0',   // 收款合计
    payTotalAmount: '0',  // 付款合计
    closing_balance: '0'
  }
}
const subModal = {
  radio: 'no',  // all 全部，no 未匹配
  noNum: '0',
  allNum: '0',
  allList: [],
  noList: [],
  list: [],
  editList: [],
  contactCode: []
}
const batchAddAcctModal = {
  list: [],
  selectedList: [],
  subTitle: '批量新增科目',
  subModal: false,
  echoList: [],   // 新增科目需要回显数数据
  contactCode: []
}
export const fundData = {
  columns,
  filterForm, // 过滤条件
  tranModal, // 导入预览列表
  subModal, // 科目确认 & 批量设置
  batchAddAcctModal
}
