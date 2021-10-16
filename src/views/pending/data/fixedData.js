const btnType = []

// {name: '移至采购',
//   key: 'moveToPurchase'
// }
const columns = [{
  prop: 'inv_type_name',
  label: '发票类型',
  align: 'left',
  width: '112px',
  tip: 'inv_type_name',
  sortable: 'custom',
  isMust: true
}, {
  prop: 'kprq',
  label: '开票日期',
  align: 'left',
  width: '100px',
  tip: 'kprq',
  sortable: 'custom',
  isMust: true
}, {
  prop: 'inv_no',
  label: '发票号码',
  align: 'left',
  width: '100px',
  tip: 'inv_no',
  sortable: 'custom',
  isMust: true
}, {
  prop: 'goodNames',
  label: '商品或服务名称',
  align: 'left',
  width: '',
  sortable: false,
  isMust: true,
  moreTip: 'goodNames'
},  {
  prop: 'fkfmc',
  label: '销售方名称',
  align: 'left',
  width: '',
  tip: 'fkfmc',
  isMust: true
}, {
  prop: 'hjjeStr',
  label: '金额',
  align: 'right',
  width: '',
  tip: 'hjjeStr',
  sortable: 'custom',
  className: 'td-right',
  isMust: true
}, {
  prop: 'taxRate',
  label: '税率',
  align: 'center',
  width: '',
  tip: 'taxRate',
  isMust: true
}, {
  prop: 'hjseStr',
  label: '增值税税额',
  align: 'right',
  width: '',
  tip: 'hjseStr',
  sortable: 'custom',
  className: 'td-right',
  isMust: true
}, {
  prop: 'jshjStr',
  label: '价税合计',
  align: 'right',
  width: '',
  tip: 'jshjStr',
  sortable: 'custom',
  className: 'td-right',
  isMust: true
}, {
  align: 'right',
  width: '20px',
  className: 'td-right',
  remarks: true
}]
export const pend = {
  btnType,
  columns
}
