const btnType = []
const columns = [{
  prop: 'formatDate',
  label: '费用日期',
  width: '170px',
  align: 'left',
  isEdit: false,
  sortable: 'letter',
  isMust: false,
  type: 'datePicker',
  editIcon: true
}, {
  prop: 'code_name',
  label: '费用科目',
  width: '',
  align: 'left',
  sortable: 'letter',
  isMust: false,
  type: 'selectInput',
  className: 'edit-row-box',
  tip: true
}, {
  prop: 'summary',
  label: '摘要',
  width: '',
  align: 'left',
  sortable: 'letter',
  isMust: false,
  type: 'input',
  transform: 'summary',
  tip: true
}, {
  prop: 'resetAmount',
  label: '价税合计金额',
  transform: 'amount',
  width: '140px',
  align: 'left',
  sortable: 'number',
  className: 'td-right',
  isMust: false,
  type: 'input',
  min_width: '120px'
}, {
  prop: 'resetTaxAmount',
  label: '可抵扣进项税额',
  transform: 'tax_amount',
  width: '143px',
  align: 'left',
  sortable: 'number',
  isMust: false,
  type: 'input',
  className: 'td-right',
  warningIcon: true,
  hide: false
}, {
  prop: 'att_num',
  label: '附件',
  transform: 'att_num',
  width: '98px',
  align: 'left',
  isMust: false,
  type: 'input',
  min_width: '100px'
}, {
  prop: 'vm_state',
  label: '凭证',
  align: 'center',
  width: '98px',
  sortable: 'number',
  desc: 'vm_state_desc',
  value: 'vt_num_list',
  type: 'text',
  tip: true
}, {
  prop: 'operation',
  label: '操作',
  align: 'center',
  width: '200px',
  addIcon: true,
  type: 'text',
  remarks: true

}]
export const expenseData = {
  btnType,
  columns
}
