const btnType = [{
  key: 'batchSetup',
  name: '理票'
}]
// {
//   key: 'createVoucher',
//     name: '生成凭证'
// },
const more =  [{
  itemType: 'deleteVoucher',
  itemName: '删除凭证'
}, {
  itemType: 'deleteInvoice',
  itemName: '删除清单'
}, {
  itemType: 'remarks',
  itemName: '添加备注'
}, {
  itemType: 'deleteRemarks',
  itemName: '删除备注'
}, {
  itemType: 'deleteInventory',
  itemName: '删除存货单据'
}
]
const columns = [{
  prop: 'bill_type_name',
  label: '发票类型',
  align: 'left',
  width: '100px',
  tip: 'bill_type_name',
  sortable: 'custom',
  isMust: true
}, {
  prop: 'billDate',
  label: '开票日期',
  align: 'left',
  width: '100px',
  tip: 'billDate',
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
  prop: 'cust_name',
  label: '往来单位',
  align: 'left',
  width: '',
  tip: 'cust_name',
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
}, {
  prop: 'amountStr',
  label: '价税合计',
  align: 'right',
  width: '',
  tip: 'amountStr',
  sortable: 'custom',
  className: 'td-right',
  isMust: true
}, {
  prop: 'acct_10',
  label: '借方科目',
  align: 'left',
  width: '',
  sortable: false,
  isMust: true,
  customTip: true
}, {
  prop: 'acct_20',
  label: '贷方科目',
  align: 'left',
  width: '',
  moreTip: 'acctCodeNameList',
  sortable: false,
  isMust: true
}, {
  prop: 'vm_state',
  label: '凭证',
  align: 'center',
  width: '98px',
  sortable: 'custom',
  desc: 'vm_state_desc',
  value: 'vt_num_list'
}, {
  prop: 'operation',
  label: '操作',
  align: 'center',
  width: '130px'
}, {
  width: '30px',
  align: 'right',
  className: 'td-right',
  remarks: true
}]
const serviceColumns = [{
  prop: 'bill_type_name',
  label: '发票类型',
  align: 'left',
  width: '',
  tip: 'bill_type_name',
  sortable: 'custom',
  isMust: true
}, {
  prop: 'inv_no',
  label: '发票号码',
  align: 'left',
  width: '',
  tip: 'inv_no',
  sortable: 'custom',
  isMust: true
}, {
  prop: 'cust_name',
  label: '往来单位',
  align: 'left',
  width: '',
  tip: 'cust_name',
  sortable: 'custom',
  isMust: true
}, {
  prop: 'goods_name',
  label: '商品或服务名称',
  align: 'left',
  width: '',
  tip: 'goods_name',
  sortable: false,
  isMust: true
}, {
  prop: 'amountStr',
  label: '价税合计',
  align: 'right',
  width: '',
  tip: 'amount',
  sortable: 'custom',
  className: 'td-right',
  isMust: true
}, {
  prop: 'sm_name',
  label: '结算方式',
  align: 'center',
  width: '',
  tip: 'sm_name',
  sortable: 'custom',
  isMust: true
}]
const tabPane = [
  {
    label: '借方科目',
    key: 'one',
    columns: [{
      width: '320px',
      align: 'left',
      label: '往来单位',
      prop: 'name'
    }, {
      width: '',
      align: 'left',
      label: '借方科目',
      className: 'edit-row-box',
      prop: 'acct'
    }]
  }, {
    label: '贷方科目',
    key: 'two',
    columns: [{
      width: '320px',
      align: 'left',
      label: '商品或服务名称',
      prop: 'name'
    }, {
      width: '',
      align: 'left',
      label: '贷方科目',
      className: 'edit-row-box',
      prop: 'acct'
    }]
  }
]
const tabPaneSpec = [
  {
    label: '借方科目',
    key: 'one',
    columns: [{
      width: '260px',
      align: 'left',
      label: '往来单位',
      prop: 'name'
    }, {
      width: '',
      align: 'left',
      label: '借方科目',
      className: 'edit-row-box',
      prop: 'acct'
    }]
  }, {
    label: '贷方科目',
    key: 'two',
    columns: [{
      width: '260px',
      align: 'left',
      label: '商品或服务名称',
      prop: 'name'
    }, {
      width: '',
      align: 'left',
      label: '规格型号',
      prop: 'specification'
    }, {
      width: '',
      align: 'left',
      label: '贷方科目',
      className: 'edit-row-box',
      prop: 'acct'
    }]
  }
]
const typeDesc = {
  'setup': ['1030px', ''], // 理票 即批量设置
  'img': ['1100px', '查看图片'],
  'edit': ['1100px', '销售专票'],
  'detail': ['1100px', '销售专票'],
  'import': ['530px', '手工理票'],
  'setting': ['990px', '凭证习惯设置']
}

const mainTitle = {
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
  cust_name: {
    name: '往来单位',
    value: '',
    width: 5
  },
  sm_name: {
    name: '结算方式',
    value: '',
    width: 5,
    type: 'select',
    options: 'settleMethod'
  },
  acct: {
    name: '借方科目',
    value: '',
    width: 5,
    type: 'autoComplete',
    options: 'debitSub',
    clear: true,
    hasAssist: true,
    acct_10_ci_name: ''
  },
  empty: {
    empty: true,
    name: '',
    value: '',
    width: 8
  }
}
const billColumns = [{
  prop: 'goods_name',
  label: '商品或服务名称',
  align: 'left',
  width: '120px'
}, {
  prop: 'specification',
  label: '规格型号',
  align: 'left',
  width: ''
}, {
  prop: 'unit_name',
  label: '单位',
  align: 'left',
  width: ''
}, {
  prop: 'qty',
  label: '数量',
  align: 'left',
  width: ''
}, {
  prop: 'unitPrice',
  label: '单价',
  align: 'right',
  width: ''
}, {
  prop: 'exTaxAmount',
  label: '金额',
  align: 'right',
  width: ''
}, {
  prop: 'tax_rate',
  label: '税率',
  align: 'center',
  width: ''
},  {
  prop: 'taxAmount',
  label: '增值税税额',
  align: 'right',
  width: ''
}, {
  prop: 'amountStr',
  label: '价税合计',
  align: 'right',
  width: '',
  tip: 'amount'
}, {
  prop: 'acct',
  label: '贷方科目',
  align: 'left',
  width: '180px',
  options: 'creditSub',
  isMust: true,
  type: 'autoComplete',
  needAssist: true
}]

export const fixedData = {
  btnType,
  more,
  columns,
  serviceColumns,
  billColumns,
  tabPane,
  tabPaneSpec,
  typeDesc,
  mainTitle
}
