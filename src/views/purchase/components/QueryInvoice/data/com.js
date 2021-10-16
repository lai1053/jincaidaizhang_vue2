export const mainTitle = {
  inv_no: {
    key: 'inv_no',
    name: '发票号码',
    value: '',
    placeholder: '请输入发票号码',
    maxLength: 22
  },
  date: {
    name: '开票月份',
    value: '',
    width: 5,
    isDate: true
  }
}
export const queryInvoiceDetail = {
  list: [],
  selectedList: [],
  oldList: []
}
export const columns = [{
  width: '110px',
  align: 'left',
  label: '发票号码',
  sortable: 'custom',
  prop: 'inv_no',
  tip: 'inv_no'
}, {
  width: '110px',
  align: 'left',
  label: '开票日期',
  prop: 'kprq',
  sortable: 'custom'
}, {
  width: '120px',
  align: 'left',
  label: '抵扣月份',
  prop: 'dkrq',
  sortable: 'custom'
}, {
  width: '',
  align: 'left',
  label: '开票单位',
  sortable: 'custom',
  prop: 'fkfmc',
  tip: 'fkfmc'
}, {
  width: '120px',
  align: 'right',
  label: '价税合计',
  sortable: 'custom',
  prop: 'jshjStr'
}, {
  width: '140px',
  align: 'left',
  sortable: 'custom',
  label: '凭证状态',
  prop: 'vm_state'
}]

