const btnType = [{
  key: 'importForm',
  name: '导入'
}]

const more = [{
  itemType: 'batchSetup',
  itemName: '批量设置'
}, {
  itemType: 'deleteVoucher',
  itemName: '删除凭证'
}, {
  itemType: 'setBankBill',
  itemName: '银行账号'
}, {
  itemType: 'deleteBill',
  itemName: '删除对账单'
}, {
  itemType: 'remarks',
  itemName: '添加备注'
}, {
  itemType: 'deleteRemarks',
  itemName: '删除备注'
}]

const typeDesc = {
  'import': ['530px', '银行对账单导入'],
  'trans': ['860px', '交易流水确认'],
  'sub': ['1000px', '会计科目确认'],
  'setup': ['860px', '批量设置'],
  'bank': ['860px', '银行账号设置'],
  'img': ['1100px', '查看图片'],
  'setting': ['960px', '凭证习惯设置']
}
const billTypes = {
  '0': '全部',
  '51000015': '收款',
  '51000016': '付款'
}
const acctSetStates = {
  '0': '全部',
  '1': '未设置',
  '2': '已设置'
}

export const fixedData = {
  btnType,
  more,
  typeDesc,
  billTypes,
  acctSetStates
}

export const bankColumns = [{
  prop: 'bank_name',
  label: '银行名称',
  align: 'left',
  width: '',
  tip: true,
  sortable: 'custom'
}, {
  prop: 'bank_num',
  label: '账号',
  align: 'left',
  width: '',
  tip: true,
  sortable: 'custom'
}, {
  prop: 'ccy_name',
  label: '币种',
  align: 'left',
  width: '100',
  tip: true
}, {
  prop: 'bank_acct_code',
  label: '核算科目',
  align: 'left',
  width: '240',
  type: 'select',
  className: 'bank_acct_code_box',
  options: 'acctList'
}, {
  prop: 'bank_state',
  label: '状态',
  align: 'left',
  width: '120',
  type: 'select',
  options: 'stateList'
}, {
  prop: 'operation',
  label: '操作',
  align: 'left',
  width: '80px',
  type: 'operation',
  className: 'operation-add-icon'
}]
