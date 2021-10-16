import request from '@/utils/req'
import store from '@/store/index'

/* 凭证检查接口(所有模块共用) */
export function checkPz (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/framework/checkPz.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid,            // 企业id
      year_period: urlInfo.ssyf,
      mark: '', // 对应模块的标识(销售:xs;采购:cg;费用:fy;资金:zj,工资表:gz)
      pzId: '' // 凭证id
    }, params)
  })
}

/* 获取 匹配科目列表 */
export function SubjectMatch (params, type) {
  const urlInfo = store.getters.urlInfo
  const url = params && params === 0 ? `/subjectMatch/mathList.do?qyid=${urlInfo.qyid}&satchParam=0&isSimpleAccount=${type}` : `/subjectMatch/mathList.do?qyid=${urlInfo.qyid}&isSimpleAccount=${type}`
  return request({
    url: url,
    method: 'GET'
  })
}

/* 重新匹配科目 */
export function SubjectReMatch (params) {
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/subjectMatch/again.do?qyid' + urlInfo.qyid,
    method: 'GET'
  })
}

/* 同步科目 */
export function staySubject (params) {
  const urlInfo = store.getters.urlInfo
  return request({
    url: `/framework/getAccountList.do?qyid=${urlInfo.qyid}&isDetail=${false}`,
    method: 'GET',
    data: Object.assign({}, params)
  })
}

/* 实时更新匹配科目接口 */
export function updateSubjcetMatch (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/subjectMatch/updateSubjcetMatch.do',
    method: 'POST',
    data: Object.assign({
      // ent_id: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid,            // 企业id
    }, params)
  })
}

/* 重新匹配科目 */
export function subjectMatchAgain (params) {
  const urlInfo = store.getters.urlInfo
  return request({
    url: `/subjectMatch/again.do?qyid=${urlInfo.qyid}`,
    method: 'GET',
    data: Object.assign({}, params)
  })
}

/* 获取新增科目下拉列表 */
export function initAddAcct (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/expense/initAcctCode.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid // 企业id
    }, params)
  })
}

/* 匹配科目 新增初始化接口 */
export function toAddAcct (params) {
  const urlInfo = store.getters.urlInfo
  return request({
    url: `/subjectMatch/toAddAcct.do?qyid=${urlInfo.qyid}&name=${params.acct_name}&acct=${params.acct_code}`,
    method: 'GET'
  })
}

/* 匹配科目 新增保存 */
export function addAcct (params) {
  const urlInfo = store.getters.urlInfo
  // return request({
  //   url: `/subjectMatch/addAcct.do?qyid=${urlInfo.qyid}&acctName=${params.acctName}&acct=${params.acct}`,
  //   method: 'GET'
  // })
  return request({

    method: 'POST'
  })
}

/* 辅助核算 获取数据接口 */
export function getAssisi(params) {
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/framework/getAuxAccAndItem.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid,
      acctCiName: ''
    }, params)
  })
}

/* 辅助核算   获取存货下计量单位 */

export function getUnit (params) {
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/framework/getUnit.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid            // 企业id
    }, params)
  })
}

/* 辅助核算  新增项目 */

export function createAuxAccItem(params) {
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/framework/createAuxAccItem.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid
    }, params)
  })
}
// 新增科目接口 （公共）
export function addAcctCommon(params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/framework/addAcct.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      numberUnit: '', // 数量单位(不填则传空字符串)
      acctName: '', // 科目名称
      currency: '',
      acct: ''
    }, params)
  })
}

// 记账接口(所有模块共用)
export function createTempPZ(params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/framework/createTempPZ.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      id: '', // 清单id
      mark: '' // 对应模块的标识(销售:xs;采购:cg;费用:fy;资金:zj)
    }, params)
  })
}
// 批量新增科目（销售采购）
export function batchAddNewKM (params) {
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/framework/batchAddNewKM.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
    }, params)
  })
}
// 新增科目时判断核素是否可以编辑
export function checkBalance (params) {
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/framework/checkBalance.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
    }, params)
  })
}
// 凭证接口(所有模块共用)
export function queryVoucherRule(params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/voucherRule/queryVoucherRule.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      account_id: urlInfo.accountId, // 清单id
      module: ''
    }, params)
  })
}
// 保存凭证接口(所有模块共用)
export function updateVoucherRule(params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/voucherRule/updateVoucherRule.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      account_id: urlInfo.accountId, // 清单id
      module: ''
    }, params)
  })
}
export function viewInventoryInfo(params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/framework/viewInventoryInfo.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      ccode: '', // 存货业务号
      module: '',
      inve_billtitle_id: '' // 存货单据号
    }, params)
  })
}
