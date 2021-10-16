import request from '@/utils/req'
import store from '@/store/index'
// 列表查询
export function queryPsbList(params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/psb/queryPSBListForPage.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      pageQueryVO: {
        currentPage: '', // 当前页，默认1
        pageSize: '', // 每页数量，默认15
      }
    }, params)
  })
}
export function importData(params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/psb/importPSBData.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf // 业务期间，格式：yyyymm
    }, params)
  })
}
export function createVoucher(params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/psb/generateVoucher.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf // 业务期间，格式：yyyymm
    }, params)
  })
}
export function deleteVoucher(params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/psb/deleteVoucher.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf // 业务期间，格式：yyyymm
    }, params)
  })
}
export function savePsbData(params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/psb/savePSBData.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf // 业务期间，格式：yyyymm
    }, params)
  })
}
export function queryInvoiceDetail(params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/psb/queryInvoiceDetails.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf // 业务期间，格式：yyyymm
    }, params)
  })
}
