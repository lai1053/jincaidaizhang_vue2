import store from '@/store/index'

export class SalaryVice {
  constructor ({bill_id, vm_state, vm_state_desc, i_pay_total, d_si_total, d_si_total_ent, d_hf, d_hf_ent, d_pi_tax, d_deduct_other_total, take_home_pay, dept_name, dept_id, private_state}) {
    this.bill_id = bill_id                  // 清单Id
    this.vm_state = vm_state                // 生成凭证状态
    this.vm_state_desc = vm_state_desc      // 生成凭证状态描述
    this.i_pay_total = i_pay_total          // 应发工资
    this.d_si_total = d_si_total            // 个人社保费
    this.d_si_total_ent = d_si_total_ent    // 公司社保费
    this.take_home_pay = take_home_pay      // 实发工资 & 工资合计
    this.d_hf = d_hf                        // 个人公积金
    this.d_hf_ent = d_hf_ent                // 公司公积金
    this.d_pi_tax = d_pi_tax                // 个人所得税
    this.d_deduct_other_total = d_deduct_other_total      // 其它扣税
    this.dept_id = dept_id                  // 部门 id
    this.private_state = private_state      // 8为导入
  }
}

/**
 * 创建工厂方法
 * @param salaryVice {Object} 数据
 * @returns {SalaryMain}
 */
export function createVice (salaryVice) {
  return new SalaryVice({
    bill_id: salaryVice.bill_id,                      // 清单Id
    vm_state: salaryVice.vm_state || 0,               // 生成凭证状态
    vm_state_desc: salaryVice.vm_state_desc || 0,     // 生成凭证状态描述
    i_pay_total: salaryVice.i_pay_total || 0,         // 应发工资
    d_si_total: salaryVice.d_si_total || 0,           // 个人社保费
    d_si_total_ent: salaryVice.d_si_total_ent || 0,   // 公司社保费
    take_home_pay: salaryVice.take_home_pay || 0,     // 实发工资 & 工资合计
    d_hf: salaryVice.d_hf || 0,                       // 个人公积金
    d_hf_ent: salaryVice.d_hf_ent || 0,               // 公司公积金
    d_pi_tax: salaryVice.d_pi_tax || 0,               // 个人所得税
    d_deduct_other_total: salaryVice.d_deduct_other_total || 0,     // 其它扣税
    dept_id: salaryVice.dept_id || undefined,                    // 部门 id
    private_state: salaryVice.private_state || 1                 // 8为导入
  })
}

export class SalaryMain {
  constructor ({bill_id, bank_acct_code, pay_falg, trans_desc, take_home_pay, trans_period, private_state, sm_id, pay_falg_name}) {
    this.bill_id = bill_id
    this.bank_acct_code = bank_acct_code     // 银行账号
    this.pay_falg = pay_falg                 // 工资处理方式
    this.pay_falg_name = ''                  // 工资处理方式
    this.trans_desc = trans_desc             // 业务说明
    this.take_home_pay = take_home_pay       // 实发合计
    this.trans_period = getDate(trans_period)      // 年份
    this.sm_id = sm_id                      // 结算方式ID
    this.private_state = private_state
  }
}

/**
 * 创建工厂方法
 * @param salaryMain {Object} 数据
 * @returns {createMain}
 */
export function createMain (salaryMain) {
  return new SalaryMain({
    bill_id: salaryMain.bill_id,
    take_home_pay: salaryMain.take_home_pay || 0,         // 实发合计
    bank_acct_code: salaryMain.bank_acct_code || '',      // 银行账号
    pay_falg: salaryMain.pay_falg || 1,                   // 工资处理方式ID
    pay_falg_name: salaryMain.pay_falg === 1 ? '计提' : '计提并发放',
    trans_desc: salaryMain.trans_desc || '',              // 业务说明
    trans_period: getDate(salaryMain.trans_period),          // 年份
    sm_id: salaryMain.sm_id || 1,                         // 结算方式ID
    private_state: salaryMain.private_state
  })
}

// 创建工厂明细列表数据
export class DetailListClass {
  constructor ({bill_id, d_absence, d_btax_total, d_chi, d_co_pi_tax, d_deduct_other,
                 d_deduct_other_total, d_deduct_total, d_eii_ent, d_hf, d_hf_ent, d_maternity_insu_ent,
                 d_mi, d_mi_ent, d_ot_pi_tax, d_pi_tax, d_pw_donation, d_ri, d_ri_ent, d_si_total, d_si_total_ent,
                 d_smi, d_smi_ent, d_soai, d_soai_ent, d_ui, d_ui_ent, dept_id, dept_name, emp_id_num, emp_id_type,
                 emp_name, ent_id, i_allowance, i_annual_bonus, i_basic, i_bonus, i_pay_other, i_pay_total, index_no,
                 pay_ent, sign, simple_module, take_home_pay}) {
    this.bill_id = bill_id
    this.d_absence = d_absence
    this.d_btax_total = d_btax_total
    this.d_chi = d_chi
    this.d_co_pi_tax = d_co_pi_tax
    this.d_deduct_other = d_deduct_other
    this.d_deduct_other_total = d_deduct_other_total
    this.d_deduct_total = d_deduct_total
    this.d_eii_ent = d_eii_ent
    this.d_hf = d_hf
    this.d_hf_ent = d_hf_ent,
    this.d_maternity_insu_ent = d_maternity_insu_ent
    this.d_mi = d_mi
    this.d_mi_ent = d_mi_ent
    this.d_ot_pi_tax = d_ot_pi_tax
    this.d_pi_tax = d_pi_tax
    this.d_pw_donation = d_pw_donation
    this.d_ri = d_ri
    this.d_ri_ent = d_ri_ent
    this.d_si_total = d_si_total
    this.d_si_total_ent = d_si_total_ent
    this.d_smi = d_smi
    this.d_smi_ent = d_smi_ent
    this.d_soai = d_soai
    this.d_soai_ent = d_soai_ent
    this.d_ui = d_ui
    this.d_ui_ent = d_ui_ent
    this.dept_id = dept_id
    this.dept_name = dept_name
    this.emp_id_num = emp_id_num
    this.emp_id_type = emp_id_type
    this.emp_name = emp_name
    this.ent_id = ent_id
    this.i_allowance = i_allowance
    this.i_annual_bonus = i_annual_bonus
    this.i_basic = i_basic
    this.i_bonus = i_bonus
    this.i_pay_other = i_pay_other
    this.i_pay_total = i_pay_total
    this.index_no = index_no
    this.pay_ent = pay_ent
    this.sign = sign
    this.simple_module = simple_module
    this.take_home_pay = take_home_pay
  }
}

export function createDetailList (createDetailList) {
  return new DetailListClass({
    bill_id: createDetailList.bill_id,
    d_absence: createDetailList.d_absence,
    d_btax_total: createDetailList.d_btax_total,
    d_chi: createDetailList.d_chi,
    d_co_pi_tax: createDetailList.d_co_pi_tax,
    d_deduct_other: createDetailList.d_deduct_other,
    d_deduct_other_total: createDetailList.d_deduct_other_total,
    d_deduct_total: createDetailList.d_deduct_total,
    d_eii_ent: createDetailList.d_eii_ent,
    d_hf: createDetailList.d_hf,
    d_hf_ent: createDetailList.d_hf_ent,
    d_maternity_insu_ent: createDetailList.d_maternity_insu_ent,
    d_mi: createDetailList.d_mi,
    d_mi_ent: createDetailList.d_mi_ent,
    d_ot_pi_tax: createDetailList.d_ot_pi_tax,
    d_pi_tax: createDetailList.d_pi_tax,
    d_pw_donation: createDetailList.d_pw_donation,
    d_ri: createDetailList.d_ri,
    d_ri_ent: createDetailList.d_ri_ent,
    d_si_total: createDetailList.d_si_total,
    d_si_total_ent: createDetailList.d_si_total_ent,
    d_smi: createDetailList.d_smi,
    d_smi_ent: createDetailList.d_smi_ent,
    d_soai: createDetailList.d_soai,
    d_soai_ent: createDetailList.d_soai_ent,
    d_ui: createDetailList.d_ui,
    d_ui_ent: createDetailList.d_ui_ent,
    dept_id: createDetailList.dept_id,
    dept_name: createDetailList.dept_name,
    emp_id_num: createDetailList.emp_id_num,
    emp_id_type: createDetailList.emp_id_type,
    emp_name: createDetailList.emp_name,
    ent_id: createDetailList.ent_id,
    i_allowance: createDetailList.i_allowance,
    i_annual_bonus: createDetailList.i_annual_bonus,
    i_basic: createDetailList.i_basic,
    i_bonus: createDetailList.i_bonus,
    i_pay_other: createDetailList.i_pay_other,
    i_pay_total: createDetailList.i_pay_total,
    index_no: createDetailList.index_no,
    pay_ent: createDetailList.pay_ent,
    sign: createDetailList.sign,
    simple_module: createDetailList.simple_module,
    take_home_pay: createDetailList.take_home_pay

  })
}

// 处理日期问题
function getDate (val) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  let ret = ''
  if (!val) {
    ret = urlInfo.ssyf
  } else {
    ret = String(val)
  }

  return ret
}
export const dept_list = [
  {
    value: 1,
    label: '管理部门'
  },
  {
    value: 2,
    label: '销售部门'
  },
  {
    value: 3,
    label: '制造部门'
  },
  {
    value: 4,
    label: '生产部门'
  },
  {
    value: 5,
    label: '研发部门'
  },
  {
    value: 6,
    label: '加工修理部门'
  }
]

export const credentialsListData = [
  {
    value: 1,
    label: '居民身份证'
  },
  {
    value: 2,
    label: '军官证'
  },
  {
    value: 3,
    label: '士兵证'
  },
  {
    value: 4,
    label: '中国护照'
  },
  {
    value: 5,
    label: '武警警官证'
  },
  {
    value: 0,
    label: ' '
  }
]


export const isMust = {
  take_home_pay: {    // 工资合计
    isMust: true,
    type: 1,
    tips: '工资合计不能为空'
  },
  sm_id: {            // 结算方式ID
    isMust: true,
    type: 1,
    tips: '结算方式不能为空'
  },
  trans_period: {     // 年份
    isMust: true,
    type: 1,
    tips: '业务期间不能为空'
  },
  bank_acct_code: {     // 年份
    isMust: false,
    type: 1,
    tips: '银行账号不能为空'
  },
  pay_falg: {         // 工资处理方式ID
    isMust: true,
    type: 1,
    tips: '工资处理不能为空'
  },
  dept_id: {          // 部门 id
    isMust: true,
    type: 2,
    tips: '部门不能为空'
  },
  i_pay_total: {      // 应发工资
    isMust: true,
    type: 2,
    tips: '应发工资不能为空'
  }
}

export const headBtns = [
  {
    name: '新增',
    key: 'handleCreateBill',
    icon: 'fa fa-plus-square',
    isShow: false
  },
  {
    name: '导出',
    key: 'exportMonth',
    icon: 'fa fa-random',
    isShow: true
  },
  {
    name: '复制上期',
    key: 'copyOfLastPeriod',
    // key: 'copyMonth',
    icon: 'fa fa-copy',
    isShow: false
  },

  // {
  //   name: '科目匹配',
  //   key: 'handleMatchSubjects',
  //   // key: 'copyMonth',
  //   icon: 'fa fa-copy',
  //   isShow: false
  // }
]

