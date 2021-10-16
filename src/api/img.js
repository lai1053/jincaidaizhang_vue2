import request from '@/utils/req'
import specialReq from  '@/utils/specialReq'
import store from '@/store/index'
/* 1.6.获取绑定图片清单 */
export function getImgsUrl (params) {
  const indexData = store.getters.indexData
  const clxx = indexData.daxxNew[params.billType]
  const urlInfo = store.getters.urlInfo
  return request({
    url: `/framework/getImgsUrl.do?cltxm=${clxx.cltxm}&cllx=${clxx.cllxid}&qysbh=${urlInfo.qyid}`,
    method: 'GET'
  })
}
/* 1.7.上传绑定 */
export function getMdUrl (params) {
  const indexData = store.getters.indexData
  const clxx = indexData.daxxNew[params.billType]
  const qdbh = `${indexData.entAcctVO.id}.${params.billType}.${params.id}`
  return specialReq({
    url: `/framework/getMdUrl.do?txm=${indexData.archiveCode}&xtid=jcgj&qdbh=${qdbh}&clid=${clxx.clid2}`,
    method: 'GET'
  })
}
/* 1.8.解绑图片 */
export function unBindImg (params) {
  return request({
    url: '/framework/unBindImg.do',
    method: 'POST',
    data: Object.assign({
      imgIds: '',
      qdbh: ''
    }, params)
  })
}

/* 1.8.解绑图片 */
export function updateBillImgQty (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/framework/updateBillImgQty.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id,
      id: '',
      bill_type_id: '',
      archive_code: String(urlInfo.ssyf),  // 凭证条码
      imgQty: '',
      tableName: ''
    }, params)
  })
}
