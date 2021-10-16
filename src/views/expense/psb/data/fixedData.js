const more =  [{
  itemType: 'deleteVoucher',
  itemName: '删除凭证'
}]
const btnType = [{
  key: 'importPsbData',
  name: '引入报销数据'
}]
const typeDesc = {
  'setting': ['940px', '凭证习惯设置'],
  'detail': ['1040px', '发票列表']
}

const columns = [{
  prop: 'reim_code',
  label: '报销单号',
  align: 'left',
  width: '132px',
  tip: 'reim_code'
}, {
  prop: 'formatted_approved_date',
  label: '审批日期',
  align: 'left',
  width: '102px'
}, {
  prop: 'reimburse_user',
  label: '报销人',
  align: 'left',
  minWidth: '88px',
  tip: 'reimburse_user'
}, {
  prop: 'charge_type_code',
  label: '报销类型',
  align: 'left',
  minWidth: '102px',
  tip: 'charge_type_code',
  className: 'edit-select-box-normal'
}, {
  prop: 'amountStr',
  label: '报销金额',
  align: 'right',
  width: '',
  tip: 'amountStr',
  className: ''
}, {
  prop: 'sm_name',
  label: '结算方式',
  align: 'left',
  minWidth: '88px'
}, {
  prop: 'acct10',
  label: '借方科目',
  align: 'left',
  minWidth: '140px',
  options: 'acctList',
  className: 'edit-row-box',
  edit: true
}, {
  prop: 'acct20',
  label: '贷方科目',
  align: 'left',
  minWidth: '140px',
  options: 'acctList',
  className: 'edit-row-box',
  edit: true
}, {
  prop: 'vm_state',
  label: '凭证',
  align: 'center',
  width: '98px',
  desc: 'vm_state_desc',
  value: 'vt_num_list'
}, {
  prop: 'operation',
  label: '操作',
  align: 'center',
  width: '100px'
}]
const detailColumns = [{
  prop: 'invoiceTypeName',
  label: '发票类型',
  align: 'left',
  width: '130px',
  tip: 'invoiceTypeName'
}, {
  prop: 'formatted_invoiceDate',
  label: '开票日期',
  align: 'left',
  width: '100px'
}, {
  prop: 'invoiceCode',
  label: '发票代码',
  align: 'left',
  width: '130px',
  tip: 'invoiceCode'
}, {
  prop: 'invoiceNumber',
  label: '发票号码',
  align: 'left',
  width: '100px',
  tip: 'invoiceNumber'
}, {
  prop: 'goods_name',
  label: '商品或服务名称',
  align: 'left',
  width: '140px',
  tip: 'goods_name'
}, {
  prop: 'totalPrice',
  label: '金额',
  align: 'right',
  width: ''
}, {
  prop: 'totalTaxPrice',
  label: '税额',
  align: 'right',
  width: ''
}, {
  prop: 'amount',
  label: '价税合计',
  align: 'right',
  width: ''
},  {
  prop: 'operation',
  label: '操作',
  align: 'center',
  width: '80px'
}]
export const fixedData = {
  more,
  btnType,
  columns,
  typeDesc,
  detailColumns
}
