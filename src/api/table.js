import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/salary/getSalaryDeptDetailList.do',
    method: 'POST',
    params
  })
}
