import request from '@/utils/req'
import store from '@/store/index'
const urlInfo = store.getters.urlInfo
const indexData = store.getters.indexData

/* 获取列表 */
export function getColumnList (params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/expense/getExpenseList.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf,
      qyid: urlInfo.qyid
    }, params)
  })
}

/* 删除凭证 包含批量删除 */
export function deleteVoucher (params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/expense/delExpenseVoucher.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf,
      vch_id_list_array: params
    })
  })
}

/* 获取费用科目 */
export function initAcctCode (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/expense/initAcctCode.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf,
      qyid: urlInfo.qyid
    }, params)
  })
}

/* 编辑保存页面接口 */
export function saves (params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/expense/saveExpenseRecord.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid // 企业id
    }, params)
  })
}

/* 编辑保存页面接口 */
export function saveExpenseRecord (params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/expense/saveExpenseRecord.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid // 企业id
    }, params)
  })
}

/* 单个或批量删除清单 */
export function deleteBills (params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/expense/deleteBills.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf,
      qyid: urlInfo.qyid,
      ids: params //
    })
  })
}

/* 生成凭证 */
export function createVouchers (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/expense/batchGenVoucher.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid, // 企业id
      year_period: urlInfo.ssyf
    }, params)
  })
}

/* 新增贷方科目 初始化新增科目 */
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

/* 添加备注信息 */
export function addRemark (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/expense/addRemark.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf // 业务期间
    }, params)
  })
}

/* 删除备注信息 */
export function deleteRemark (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/expense/deleteRemark.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间
      ids: params // 单据id
    })
  })
}
