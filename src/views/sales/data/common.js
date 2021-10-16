const saleType = {
  special: '51000002',
  ordinary: '51000003',
  others: '51000004'
}

const btnType = [{
  icon: 'fa fa-plus-square',
  key: 'synInvoice',
  name: '同步发票'
}, {
  icon: 'fa fa-plus-square',
  key: 'createVoucher',
  name: '生成凭证'
}]
/* const btnType = [{
  icon: 'fa fa-plus-square',
  key: 'createVoucher',
  name: '生成凭证'
}] */

const more = [{
  icon: 'fa fa-plus',
  itemType: 'addBill',
  itemName: '新增'
}, {
  icon: 'fa fa-trash-alt',
  itemType: 'deleteBill',
  itemName: '删除'
}, {
  icon: 'fa fa-trash-alt',
  itemType: 'deleteVoucher',
  itemName: '删除凭证'
}, {
  icon: 'fa fa-files-o',
  itemType: 'mergeBill',
  itemName: '清单合并'
}, {
  icon: 'fa fa-repeat',
  itemType: 'restoreBill',
  itemName: '清单还原'
}, {
  icon: 'fa fa-bullseye',
  itemType: 'matchSubjects',
  itemName: '业务模版配置'
}, {
  icon: 'fa fa-sign-out-alt',
  itemType: 'exportForm',
  itemName: '导出'
},
{
  icon: 'fa fa-cog',
  itemType: 'batchSetup',
  itemName: '批量设置'
}]

const columns = [{
  prop: 'strTypeName',
  label: '销售类型',
  align: 'left',
  width: '',
  tip: 'strTypeName',
  sortable: false,
  isMust: true
}, {
  prop: 'inv_no',
  label: '发票号码',
  align: 'left',
  width: '',
  tip: 'inv_no',
  sortable: false,
  isMust: true
}, {
  prop: 'cust_name',
  label: '客户',
  align: 'left',
  width: '',
  tip: 'cust_name',
  sortable: 'custom',
  isMust: true
}, {
  prop: 'strAmount',
  label: '价税合计',
  align: 'right',
  width: '',
  tip: 'strAmount',
  sortable: 'custom',
  className: 'td-right',
  isMust: true
}, {
  prop: 'acct_10',
  label: '借方科目',
  align: 'left',
  width: '',
  tip: 'acct_10',
  sortable: false,
  isMust: true
}, {
  prop: 'acct_20',
  label: '贷方科目',
  align: 'left',
  width: '',
  tip: 'acct_20',
  sortable: false,
  isMust: true
}, {
  prop: 'inv_code',
  label: '发票代码',
  align: 'left',
  width: '',
  tip: 'inv_code',
  sortable: false,
  isMust: false,
  hide: true
}, {
  prop: 'sm_name',
  label: '结算方式',
  align: 'left',
  width: '',
  tip: 'sm_name',
  sortable: 'sm_name',
  isMust: false,
  hide: true
}, {
  prop: 'ex_tax_amount',
  label: '金额',
  align: 'right',
  width: '',
  tip: 'ex_tax_amount',
  sortable: 'custom',
  className: 'td-right',
  isMust: false,
  hide: true
}, {
  prop: 'tax_amount',
  label: '增值税税额',
  align: 'right',
  width: '',
  tip: 'tax_amount',
  sortable: 'custom',
  isMust: false,
  hide: true
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

const billColumns = [{
  width: '115',
  align: 'left',
  label: '商品或服务名称*',
  prop: 'goods_name',
  isMust: true,
  type: 'selectInput'
}, {
  width: '80',
  align: 'left',
  label: '规格型号',
  prop: 'specification',
  type: 'input'
}, {
  width: '80',
  align: 'left',
  label: '单位',
  prop: 'unit_name',
  type: 'input'
}, {
  width: '100',
  align: 'left',
  label: '数量*',
  isMust: true,
  prop: 'strQty',
  type: 'input'
}, {
  width: '100',
  align: 'left',
  label: '单价*',
  isMust: true,
  prop: 'unit_price',
  type: 'input'
}, {
  width: '120',
  align: 'left',
  label: '金额',
  prop: 'strEx_tax_amount',
  type: 'input'
}, {
  width: '60',
  align: 'left',
  label: '税率',
  prop: 'tax_rate',
  type: 'select'
}, {
  width: '100',
  align: 'left',
  label: '增值税税额',
  prop: 'tax_amount',
  type: 'input'
}, {
  width: '140',
  align: 'left',
  label: '价税合计',
  prop: 'amount',
  type: 'readonly'
}, {
  width: '200',
  align: 'left',
  label: '贷方科目',
  prop: 'acct_20_code',
  type: 'autoComplete',
  options: 'creditSub',
  clear: true,
  needAssist: true
}]

const mainTitle = {
  trans_type_id: {
    name: '销售类型',
    value: '',
    width: 5,
    isMust: true,
    type: 'select',
    options: 'mainType'
  },
  inv_no: {
    name: '发票号码',
    value: '',
    width: 5,
    isMust: true,
    type: 'input'
  },
  inv_code: {
    name: '发票代码',
    value: '',
    width: 5,
    isMust: true,
    type: 'input'
  },
  sm_id: {
    name: '结算方式',
    value: '7',
    width: 5,
    isMust: true,
    type: 'select',
    options: 'settleMethod'
  },
  cust_name: {
    name: '客户名称',
    value: '',
    width: 5,
    isMust: true,
    type: 'selectInput',
    options: 'cusName'
  },
  acct_10_code: {
    name: '借方科目',
    value: '',
    width: 5,
    isMust: true,
    type: 'autoComplete',
    options: 'debitSub',
    hasAssist: true
  },
  acct_20_code: {
    name: '贷方科目',
    value: '',
    width: 5,
    isMust: false,
    type: 'autoComplete',
    options: 'creditSub',
    clear: true,
    hasAssist: true
  },
  summary: {
    name: '摘要',
    value: '',
    width: 5,
    isMust: true,
    type: 'input'
  },
  ccy_name: {
    name: '原币币种',
    id: '',
    value: '',
    width: 5,
    isMust: true,
    type: 'readonly',
    hide: true
  },
  ccy_rate: {
    name: '汇率',
    value: '',
    width: 5,
    isMust: true,
    type: 'readonly',
    hide: true
  },
  amount_for: {
    name: '原币金额',
    value: '',
    width: 5,
    isMust: true,
    type: 'input',
    hide: true
  },
  other: {
    name: '',
    value: '',
    width: 5,
    type: 'readonly'
  }
  /* ,
  trans_desc: {
    name: '业务说明',
    value: '',
    width: 21,
    isMust: false,
    type: 'input',
    hide: true
  } */
}
const setupTitle = {
  sm_id: {
    name: '结算方式',
    value: '',
    width: 5,
    isMust: true,
    type: 'select',
    options: 'settleMethod'
  },
  cust_name: {
    name: '客户名称',
    value: '',
    width: 5,
    isMust: true,
    type: 'selectInput',
    options: 'cusName'
  },
  acct_10_code: {
    name: '借方科目',
    value: '',
    width: 5,
    isMust: true,
    type: 'select',
    options: 'debitSub',
    hasAssist: true
  }/*,
  other: {
    name: '',
    value: '',
    width: 13,
    type: 'readonly'
  }*/
}
export const salesData = {
  saleType, // 销售类型
  btnType, // button列表
  more, // 更多下面的选项
  columns,
  billColumns,
  mainTitle,
  setupTitle
}
