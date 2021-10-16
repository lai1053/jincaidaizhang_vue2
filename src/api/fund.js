import req from '@/utils/req'
import store from '@/store/index'

// 获取资金清单列表
export function queryFlowFundList (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return req({
    url: '/flowFund/queryFlowFundListForPage.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      bank_num: '', // 银行账号（1）‘’（空）：代表所有的银行账号，即全部；（2）非空：特定的银行账号
      bill_type_id: '0', // 单据类型 51000015收款 51000016付款 51000017转款
      acct_setup_state: '0', // 会计科目设置状态：0：全部；1：未设置；2：已设置
      vm_state: '0', // 所选单据类型：0为全部  1为未执行生成  2为已生成凭证  3为生成凭证失败
      check_latest_bank_acct: '', // 是不是只返回最新导入的一家银行对账单0：不是1：是
      vt_num: '', // 凭证字号：（1）默认不传，（2）传的时候需要为数字
      pageQueryVO: {
        currentPage: '', // 当前页，默认1
        pageSize: '' // 每页数量，默认15
      }
    }, params)
  })
}
// 保存银行对账单修改
export function updateFlowFund (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return req({
    url: '/flowFund/updateFlowFund.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      flowFundVOList: [] // 资金VO列表
    }, params)
  })
}
// 12.12 添加备注信息
export function addRemark (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return req({
    url: '/flowFund/addRemark.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf // 业务期间
    }, params)
  })
}
// 10.4.查询银行账号列表
export function queryBankAcctList (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return req({
    url: '/flowFund/queryBankAcctList.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      check_bill_data: '0', // 0：不需要银行账号当前会计期间有对账单数据，可以有对账单数据或者没有对账单数据；1：需要银行账号当前会计期间有对账单数据
      bank_state: '0' // 银行账号启用状态：0：代表全部（弃用和停用）1：启用4：停用
    }, params)
  })
}
// 10.11.生成凭证（支持批量）
export function createVoucher (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return req({
    url: '/flowFund/createVoucher.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      idArray: [] // 单据ID数组
    }, params)
  })
}
// 10.12.删除凭证（支持批量）
export function deleteVoucher (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return req({
    url: '/flowFund/deleteVoucher.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      vch_id_list_array: [] // 凭证ID数组
    }, params)
  })
}
// 10.2.删除银行对账单列表
export function deleteFlowFundList (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return req({
    url: '/flowFund/deleteFlowFundList.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      bank_num: '' // 银行账号（1）‘’（空）：代表所有的银行账号，即全部；（2）非空：特定的银行账号
    }, params)
  })
}

// 10.9.查询批量设置列表
export function queryBatchSetupList (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return req({
    url: '/flowFund/queryBatchSetupList.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      bank_num: '', // 银行账号（1）‘’（空）：代表所有的银行账号，即全部；（2）非空：特定的银行账号
      bill_type_id: '',
      acct_setup_state: '',
      vm_state: ''
    }, params)
  })
}
// 10.10.保存批量设置
export function saveBacthSetup (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return req({
    url: '/flowFund/saveBacthSetup.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      bank_num: '', // 银行账号（1）‘’（空）：代表所有的银行账号，即全部；（2）非空：特定的银行账号
      acctInfoList: []
    }, params)
  })
}
// 10.8.保存导入银行对账单
export function saveBankStatement (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return req({
    url: '/flowFund/saveBankStatement.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      flowFundVOList: [], // 批量保存资金列表
      acctInfoList: [] // 批量设置对方名称和科目：
    }, params)
  })
}
// 10.5.保存银行账号（添加和修改）
export function saveBankAcct (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return req({
    url: '/flowFund/saveBankAcct.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      bankAcctList: [] // 银行账号列表，用于批量保存银行账号
    }, params)
  })
}
// 6.12 批量新增科目接口 batchAddNewKM.
export function batchAddNewKM (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return req({
    url: '/flowFund/batchAddNewKM.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      flowKMVOList: []
    }, params)
  })
}

/* 删除备注信息 */
export function deleteRemark (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return req({
    url: '/flowFund/deleteRemark.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间
      idArray: params // 单据id
    })
  })
}
// 12 19 理票新增科目信息
export function getFundContactList() {
  const urlInfo = store.getters.urlInfo
  return req({
    url: '/flowFund/getContactAccountList.do',
    method: 'GET',
    params: {qyid: urlInfo.qyid}
  })
}
// 理票下拉列表数据
export function getFundAccountList() {
  const urlInfo = store.getters.urlInfo
  return req({
    url: '/flowFund/getAccountList.do',
    method: 'GET',
    params: {qyid: urlInfo.qyid}
  })
}
