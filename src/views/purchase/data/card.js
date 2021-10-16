const basis = {
  name: {
    name: '资产名称',
    value: '',
    width: 7,
    isMust: true,
    type: 'input'
  },
  asset_type_id: {
    name: '类别',
    value: '',
    width: 7,
    isMust: true,
    type: 'readonly'
  },
  specification: {
    name: '规格型号',
    value: '',
    width: 7,
    isMust: false,
    type: 'input'
  },
  post_date: {
    name: '入账日期',
    value: '',
    width: 7,
    isMust: true,
    type: 'datePicker'
  },
  dept: {
    name: '使用部门',
    value: '',
    width: 7,
    isMust: true,
    type: 'select',
    options: 'dept'
  },
  addType: {
    name: '增加方式',
    value: '购入',
    width: 7,
    isMust: false,
    type: 'readonly'
  },
  qty: {
    name: '数量',
    value: '',
    width: 7,
    isMust: true,
    type: 'readonly'
  },
  tax_deed: {
    name: '契税',
    value: '',
    width: 7,
    isMust: false,
    type: 'input'
  },
  tax_veh_pur: {
    name: '车辆购置税',
    value: '',
    width: 7,
    isMust: false,
    type: 'input'
  }
}
const depreciation = {
  org_value: {
    name: '原值',
    value: '',
    width: 7,
    isMust: false,
    type: 'readonly'
  },
  deprMethod: {
    name: '折旧方法',
    value: '',
    width: 7,
    isMust: true,
    type: 'select',
    options: 'deprMethod'
  },
  workload: {
    name: '工作总量',
    value: '',
    width: 7,
    isMust: true,
    type: 'input'
  },
  wl_unit: {
    name: '工作单位',
    value: '',
    width: 7,
    isMust: false,
    type: 'input'
  },
  salvage_value_rate: {
    name: '残值率',
    value: '',
    width: 7,
    isMust: false,
    type: 'input'
  },
  salvage_value: {
    name: '净残值',
    value: '',
    width: 7,
    isMust: false,
    type: 'input'
  },
  t_period: {
    name: '预计使用年限',
    value: '',
    width: 7,
    isMust: true,
    type: 'input'
  }
}
export const card = {
  basis, // 基本信息
  depreciation // 折旧信息
}
