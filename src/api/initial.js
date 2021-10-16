import request from '@/utils/req'

/* 一体化进入清单接口 */
export function ywqdindex(params) {
  const { qyid, ssyf, hydm, nsrsbh, nsrmc, token, accountId, taxType, from, isjckqy, accountType, regPhone } = params
  const url = `/framework/ywqdindex.do?from=${from}&qyid=${qyid}&token=${token}&ssyf=${ssyf}&hydm=${hydm}&nsrsbh=${nsrsbh}&nsrmc=${nsrmc}&accountId=${accountId}&taxType=${taxType}&isjckqy=${isjckqy}&accountType=${accountType}&regPhone=${regPhone}`
  return request({
    url: url,
    method: 'POST'
  })
}
/* 获取明细科目列表 */
export function getAccountList(params) {
  const url = `/framework/getAccountList.do?qyid=${params.qyid}&isDetail=false`
  return request({
    url: url,
    method: 'GET'
  })
}
/* 获取科目匹配表的数据 */
export function getMatchAccountList(params) {
  const url = `/framework/getMatchAccountList.do?qyid=${params.qyid}`
  return request({
    url: url,
    method: 'GET'
  })
}
/* 获取外币列表 */
export function getCurrencyList(params) {
  const url = `/framework/getCurrencyList.do?qyid=${params.qyid}&ssyf=${params.ssyf}`
  return request({
    url: url,
    method: 'GET'
  })
}
// 获取科目匹配数据
/* 获取科目匹配表的数据 */
export function subjectMatch(params) {
  const url = `/subjectMatch/mathList.do?qyid=${params.qyid}`
  return request({
    url: url,
    method: 'GET'
  })
}
