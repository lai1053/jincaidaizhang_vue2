import request from '@/utils/req'
// import store from '@/store/index'

/* 获取表单数据 */
export function getSimpleTally (params) {
  return request({
    url: '/simpleacct/initViewOrEdit.do',
    method: 'GET',
    params: params
  })
}

/* 复制上期 */
export function copyLastData (params) {
  return request({
    url: '/simpleacct/copyLastData.do',
    method: 'POST',
    data: Object.assign({
    }, params)
  })
}

/* 保存或者记账报税 */
export function saveAndFiletax (params) {
  return request({
    url: '/simpleacct/SaveAndFiletax.do',
    method: 'POST',
    data: Object.assign({
    }, params)
  })
}
