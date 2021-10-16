
const more = [{
  itemType: 'queryInvoice',
  itemName: '查票'
}, {
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
}]
const acctSetStates = {
  '0': '全部',
  '1': '未设置',
  '2': '已设置'
}

const columns = [{
  prop: 'bill_type_name',
  label: '发票类型',
  align: 'left',
  width: '112px',
  sortable: 'custom',
  tip: 'bill_type_name'
}, {
  prop: 'billDate',
  label: '开票日期',
  align: 'left',
  width: '100px',
  sortable: 'custom'
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
  sortable: 'custom'
}, {
  prop: 'goodNames',
  label: '商品或服务名称',
  align: 'left',
  width: '',
  moreTip: 'goodNames'
}, {
  prop: 'amountStr',
  label: '价税合计',
  align: 'right',
  width: '',
  tip: 'amountStr',
  className: 'td-right',
  sortable: 'custom'
}, {
  prop: 'acct_10',
  label: '借方科目',
  align: 'left',
  width: '',
  moreTip: 'acctCodeNameList'
}, {
  prop: 'acct_20',
  label: '贷方科目',
  align: 'left',
  minWidth: '',
  customTip: true
},  {
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
  width: '130px'
}, {
  width: '20px',
  align: 'right',
  className: 'td-right',
  remarks: true
}]
const serviceColumns = [{
  prop: 'bill_type_name',
  label: '发票类型',
  align: 'left',
  width: '112px',
  tip: 'bill_type_name',
  sortable: 'custom'
}, {
  prop: 'inv_no',
  label: '发票号码',
  align: 'left',
  width: '',
  tip: 'inv_no',
  sortable: 'custom'
}, {
  prop: 'cust_name',
  label: '往来单位',
  align: 'left',
  width: '',
  tip: 'cust_name',
  sortable: 'custom'
}, {
  prop: 'goods_name',
  label: '商品或服务名称',
  align: 'left',
  tip: 'goods_name'
}, {
  prop: 'amountStr',
  label: '价税合计',
  align: 'right',
  width: '',
  tip: 'amountStr',
  className: 'td-right',
  sortable: 'custom'
}, {
  prop: 'sm_name',
  label: '结算方式',
  align: 'center',
  minWidth: '',
  tip: 'sm_name',
  sortable: 'custom'
}]
const businessColumns = [{
  prop: 'inv_type_name',
  label: '发票类型',
  align: 'left',
  width: '120',
  tip: 'inv_type_name',
  sortable: 'custom'
}, {
  prop: 'kprq',
  label: '开票日期',
  align: 'left',
  width: '120',
  tip: 'kprq',
  sortable: 'custom'
}, {
  prop: 'inv_no',
  label: '发票号码',
  align: 'left',
  width: '120',
  tip: 'inv_no',
  sortable: 'custom'
}, {
  prop: 'fkfmc',
  label: '往来单位',
  align: 'left',
  width: '',
  tip: 'fkfmc',
  sortable: 'custom'
}, {
  prop: 'goods_name',
  label: '商品或服务名称',
  align: 'left',
  tip: 'goods_name'
}, {
  prop: 'amountStr',
  label: '价税合计',
  align: 'right',
  width: '',
  tip: 'amountStr',
  className: 'td-right',
  sortable: 'custom'
}]
const certifiedTaxColumns =  [{
  prop: 'bill_date',
  label: '开票日期',
  align: 'left',
  width: '120'
}, {
  prop: 'inv_no',
  label: '发票号码',
  align: 'left',
  width: '120',
  tip: 'inv_no'
}, {
  prop: 'inv_code',
  label: '发票代码',
  align: 'left',
  width: '120'
}, {
  prop: 'cust_name',
  label: '往来单位',
  align: 'left',
  width: '200',
  tip: 'cust_name'
}, {
  width: '',
  align: 'right',
  label: '金额',
  prop: 'ex_tax_amount'
},  {
  width: '',
  align: 'right',
  label: '税额',
  prop: 'tax_amount'
}]
const typeDesc = {
  'setup': ['1030px', ''], // 理票 即批量设置
  'img': ['1100px', '查看图片'],
  'detail': ['1100px', ''],
  'edit': ['1100px', ''],
  'income': ['558px', '待认证转进项'],
  'query': ['940px', '查票'],
  'import': ['530px', '手工理票'],
  'setting': ['990px', '凭证习惯设置'],
  'check': ['900px', '发票详情']
}
const tabPane = [{
  label: '借方科目',
  key: 'one',
  columns: [{
    width: '320px',
    align: 'left',
    label: '商品或服务名称',
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
    label: '往来单位',
    prop: 'name'
  }, {
    width: '',
    align: 'left',
    label: '贷方科目',
    className: 'edit-row-box',
    prop: 'acct'
  }]
}]
const tabPaneSpec = [{
  label: '借方科目',
  key: 'one',
  columns: [{
    width: '260px',
    align: 'left',
    label: '商品或服务名称',
    prop: 'name'
  }, {
    width: '260px',
    align: 'left',
    label: '规格型号',
    prop: 'specification'
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
    label: '往来单位',
    prop: 'name'
  }, {
    width: '',
    align: 'left',
    label: '贷方科目',
    className: 'edit-row-box',
    prop: 'acct'
  }]
}]
const batchSetupTabPane = [{
  label: '按往来确认',
  key: 'one',
  columns: [{
    width: '',
    align: 'left',
    label: '往来单位',
    prop: 'cust_name'
  }, {
    width: '',
    align: 'left',
    label: '是否采购相关',
    prop: 'isPurchase'
  }]
}, {
  label: '按货品确认',
  key: 'two',
  columns: [{
    width: '',
    align: 'left',
    label: '商品或服务名称',
    prop: 'good_name'
  }, {
    width: '',
    align: 'left',
    label: '是否采购相关',
    prop: 'isPurchase'
  }]
}]

const billColumns = [{
  width: '',
  align: 'left',
  label: '商品或服务名称',
  prop: 'goods_name'
}, {
  width: '90px',
  align: 'left',
  label: '规格型号',
  prop: 'specification'
}, {
  width: '60px',
  align: 'left',
  label: '单位',
  prop: 'unit_name'
}, {
  width: '80px',
  align: 'left',
  label: '数量',
  prop: 'qty'
}, {
  width: '',
  align: 'right',
  label: '单价',
  prop: 'unitPrice'
}, {
  width: '',
  align: 'right',
  label: '金额',
  prop: 'exTaxAmount'
}, {
  width: '60',
  align: 'right',
  label: '税率',
  prop: 'taxRate'
}, {
  width: '',
  align: 'right',
  label: '增值税税额',
  prop: 'taxAmount'
}, {
  width: '',
  align: 'right',
  label: '价税合计',
  prop: 'amountStr'
}, {
  width: '180px',
  align: 'left',
  label: '借方科目',
  prop: 'acct',
  isMust: true,
  type: 'autoComplete',
  needAssist: true
}]

const billTypes = [
  '全部',
  '普票',
  '专票（已认证）',
  '专票（未认证）',
  '代开专票（已认证）',
  '代开专票（未认证）',
  '机动车（已认证）',
  '机动车（未认证）',
  '海关（已认证）',
  '统一收购（已认证）',
  '农产品（已认证）',
  '通行费（已认证）',
  '通行费（未认证）'
]

export const fixedData = {
  more,
  columns,
  acctSetStates,
  typeDesc,
  serviceColumns,
  tabPane,
  tabPaneSpec,
  billColumns,
  billTypes,
  businessColumns,
  batchSetupTabPane,
  certifiedTaxColumns
}
