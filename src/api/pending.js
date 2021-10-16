import request from '@/utils/req'
import store from '@/store/index'

// const indexData = JSON.parse(sessionStorage.getItem('indexData')) || store.getters.indexData
// const urlInfo = JSON.parse(sessionStorage.getItem('urlInfo')) || store.getters.urlInfo

/* 获取列表 */
export function getColumnList (params) {
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/pending/getPendingList.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      archiveCode: urlInfo.ssyf
    }, params)
  })
}

/* 状态更改 */
export function batchUpdateState (params) {
  const indexData = store.getters.indexData
  return request({
    url: '/pending/batchUpdateState.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id // 企业id
    }, params)
  })
}

/* 清空回收站 */
export function batchDelete (params) {
  const indexData = store.getters.indexData
  return request({
    url: '/pending/batchDelete.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id // 企业id
    }, params)
  })
}

/* 分配至 */
export function pendingDistribute (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/pending/pendingDistribute.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid,       // 企业id
      nsrsbh: urlInfo.nsrsbh,   // 纳税人识别号
      ssyf: urlInfo.ssyf,       // 所属月份，当前期间
      iaeMark: indexData.iae_mark + '', // 是否进出口 1表示非进出口2表示进出口
      type: urlInfo.taxType,               // 行业类型1:工业,2:商贸,99:通用
      hydm: urlInfo.hydm       // 行业代码
    }, params)
  })
}

/* 查看数据 */
export function getItemDetail (params) {
  const indexData = store.getters.indexData
  return request({
    url: '/pending/getPendingDetail.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id // 企业id
    }, params)
  })
}

/* 同步发票 */
export function synchronizeBill (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/pending/syncInvoice.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid,       // 企业id
      nsrsbh: urlInfo.nsrsbh,   // 纳税人识别号
      ssyf: urlInfo.ssyf,       // 所属月份，当前期间
      iaeMark: indexData.iae_mark + '', // 是否进出口 1表示非进出口2表示进出口
      type: urlInfo.taxType               // 行业类型1:工业,2:商贸,99:通用
      // hydm: urlInfo.hydm,       //行业代码
    }, params)
  })
}

// 分配至采购
export function moveToPurchase (params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/pending/batchMoveToPurchase.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid,
      year_period: urlInfo.ssyf
    }, params)
  })
}
// 列表数据查询
export function queryPendingList (params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/pending/getPendingListForPage.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid,
      year_period: urlInfo.ssyf
    }, params)
  })
}
// 彻底删除数据
export function batchDeleteData (params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/pending/batchDelete.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid,
      year_period: urlInfo.ssyf
    }, params)
  })
}
// 查看列表数据详情
export function queryPendingListDetail (params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/pending/getPendingDetail.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid,
      year_period: urlInfo.ssyf
    }, params)
  })
}

/* 添加备注信息 */
export function addRemark (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/pending/addRemark.do',
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
    url: '/pending/deleteRemark.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间
      bill_id_array: params // 单据id
    })
  })
}
