export const localParams = {
  lock: true,
  text: 'Loading',
  spinner: 'el-icon-loading',
  background: 'rgba(0, 0, 0, 0.2)'
}
export const duration = 1700
export const subData = {
  complex: false,
  subModal: false,
  subTitle: '', // 模态框名称
  subType: '', // 需要增加的科目类型，贷方科目 || 借方科目
  // 上级科目名称
  superiorSub: {
    code: '', // 上级科目过滤规则
    curVal: '', // 当前选择值
    options: {} // 上级科目列表
  },
  // 核算科目
  accounting: {
    type: '', // 核算科目类型: 结算科目，收入科目
    code: '', // 核算科目过滤规则
    options: '', // 核算科目列表
    mainMenu: '' // 模块名
  },
  initSubVal: '', // 默认带出的值
  // 新增科目名称
  newSubVal: '',
  hasCheck: '', // 是否需要同步增加选项
  synAdd: false, // 同步增加 选项
  hasUnit: '', // 是否需要数量单位
  unitCheck: false, // 是否选择数量单位
  unitVal: '', // 数量单位
  hasMoney: '', // 是否存在外币核算
  moneyCheck: false, // 是否选择外币核算
  moneyType: '', // 外币币种
  editFlag: true, // 是否可以编辑核算科目 true 可编辑
  removeCurrency: false,
  guige: '', // 规格
  unitName: '', // 单位
  isStock: false, // 选中值是否存货科目
  assistCode: '',
  module: '' // 模块名称  进项理票时传
}

export const batchSubData = {
  subModal: false,
  subTitle: '', // 模态框名称
  subType: '', // 需要增加的科目类型，贷方科目 || 借方科目
  list: [], // 需要批量新增的列表
  // 上级科目名称
  superiorSub: {
    code: '', // 上级科目过滤规则
    curVal: '', // 当前选择值
    options: {} // 上级科目列表
  },
  guige: '',
  unitName: '',
  isStock: false,
  assistCode: '',
  module: '' // 模块名称  进项理票时传
}

export const options = {
  listSize: 20,
  isLoadMore: true
}
export const subjectData = {
  code: [], // 可选科目
  options: [], // 下拉科目数据
  curVal: '', // 选中的值
  acctCiName: '',
  mainMenu: '',
  subTitle: '批量设置科目', // 模态框名称
  subModal: false,
  accounting: {
    type: ''
  }
}
