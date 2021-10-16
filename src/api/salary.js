import request from '@/utils/req'
import store from '@/store/index'

/* 一、获取可导出月份 */
export function getPeriod (params) {
  const indexData = store.getters.indexData
  return request({
    url: '/salary/getPeriod.do',
    method: 'GET',
    params: Object.assign({
      ent_id: indexData.entAcctVO.id,   // 企业id
      // qymc: indexData.nsrmc,        //企业名称
    }, params)
  })
}

/* 二、导出excel */
export function exportExl (params) {
  const indexData = store.getters.indexData
  return request({
    url: '/salary/exportExl.do',
    method: 'GET',
    params: Object.assign({
      ent_id: indexData.entAcctVO.id,   // 企业id
      qymc: indexData.nsrmc       // 企业名称
    }, params)
  })
}
/* 三、复制上一期 */
export function copyOfLastPeriod (params) {
  const indexData = store.getters.indexData
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/salary/copyOfLastPeriod.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id,   // 企业id
      ssyf: urlInfo.ssyf,        // 所属月份
      year_period: ''
    }, params)
  })
}

/* 四、获取工资表单据列表（应该是清单列表） */
export function getSalaryList (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/salary/getSalaryDeptDetailList.do',
    method: 'POST',
    data: Object.assign({
      entId: indexData.entAcctVO.id, // 企业id
      ssyf: urlInfo.ssyf, // 所属月份
      vm_state: 0  // 默认为全部 0   生成凭证状态,1:未生成;2:成功;3:失败
    }, params)
  })
}

/* 五、删除工资表 */
export function deleteSalary (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/salary/deleteSalary.do',
    method: 'POST',
    data: Object.assign({
      entId: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid, // 企业id
      ssyf: urlInfo.ssyf
    }, params)
  })
}

/* 六、生成凭证 */
export function newVoucher (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/salary/newVoucher.do',
    method: 'POST',
    data: Object.assign({
      entId: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid, // 企业id
      ssyf: urlInfo.ssyf
    }, params)
  })
}

/* 七、删除凭证 */
export function deleteVoucher (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/salary/deleteVoucher.do',
    method: 'POST',
    data: Object.assign({
      entId: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid // 企业id
    }, params)
  })
}

/* 八、获取单个工资单据数据  就是明细一类的 */
export function getSalaryDeptDetail (params) {
  const indexData = store.getters.indexData
  return request({
    url: '/salary/getSalaryDeptDetail.do',
    method: 'POST',
    data: Object.assign({
      entId: indexData.entAcctVO.id, // 企业id
    }, params)
  })
}

/* 九、保存 （编辑）更新工资表单据 */
export function updateSalaryDeptL(params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/salary/updateSalaryDeptL.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid
    }, params)
  })
}

/* 十、保存 （新增） 保存工资表数据并生成凭证*/
export function saveSalary (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/salary/saveSalary.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid
    }, params)
  })
}

export function getImportSalary (params) {
  const indexData = store.getters.indexData
  return request({
    url: '/salary/getImportSalary.do',
    method: 'POST',
    data: Object.assign({
      entId: indexData.entAcctVO.id // 企业id
    }, params)
  })
}

/**/
export function getCopyPeriod (params) {
  const indexData = store.getters.indexData
  return request({
    url: '/salary/getCopyPeriod.do',
    method: 'GET',
    params: Object.assign({
      ent_id: indexData.entAcctVO.id   // 企业id
    }, params)
  })
}

