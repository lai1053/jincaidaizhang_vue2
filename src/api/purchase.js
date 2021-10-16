import request from '@/utils/req'
import store from '@/store/index'

/* 获取采购单据列表 */
export function queryPurchaseList (params) {
  // console.log(store.getters.urlInfo)
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/queryPurchaseListForPage.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      inv_type_name: '0', // 发票类型
      cust_name: '', // 模糊搜索条件：供应商(即往来单位)
      inv_no: '', // 模糊搜索条件：发票号码
      bill_date_start: '', // 范围搜索：开票日期起，YYYY-MM-DD
      bill_date_end: '', // 范围搜索：开票日期止，YYYY-MM-DD
      min_amount: '', // 范围搜索：价税合计起
      max_amount: '', // 范围搜索：价税合计止
      pageQueryVO: {
        currentPage: '', // 当前页，默认1
        pageSize: '', // 每页数量，默认15
        orderName: '', // 发票类型：bill_type_id 价税合计：amount 凭证字号：vt_num_list 往来单位：cust_name 结算科目：acct_20_code 存货科目：acct_10_code 开票日期：bill_date
        order: '' // 排序方式，二选一： ASC：升序DESC：降序
      }
    }, params)
  })
}

// 12.2.采购发票下载
export function downloadPurchaseInvoice (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/downloadPurchaseInvoice.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf // 业务期间，格式：yyyymm
    }, params)
  })
}
export function queryPurchaseSettlement (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/queryPurchaseSettlement.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf // 业务期间，格式：yyyymm
    }, params)
  })
}
// 12.4.采购科目确认查询
export function queryPurchaseAcctList (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/queryPurchaseAcctList.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      invoiceInfoList: [] // 发票信息列表
    }, params)
  })
}

// 12.5.保存业务和科目确认
export function saveInvoiceInfo (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/savePurchaseSummaryAndAcct.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      invoiceInfoList: [], // 发票信息列表（发票下载信息，修改结算方式信息后，回传后端）
      contactList: [], // 往来科目列表信息
      incomeList: [], // 存货科目列表信息
      delInfoList: [], // 采购界面删除的发票信息
      cgData: [], // 待用区入库的数
      dyData: [], // 待用区留用的数据
      fpData: [], // 待用区废票数据
      purchaseList: [],
      accountList: []
    }, params)
  })
}

// queryPurchaseDetail, // 12.6.单张发票编辑查询
export function queryPurchaseDetail (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/queryPurchaseInvoiceDetail.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      bill_id: '' // 单据id
    }, params)
  })
}

// 删除清单发票
export function deleteInvoice (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/deletePurchaseInvoice.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      ids: [] // 清单id数组
    }, params)
  })
}

/* 删除凭证 */
export function deleteVoucher (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/deleteVoucher.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      vch_id_list_array: [], // 凭证id
      delCertifyTaxVoucher: '' // 是否删除待认证转进项税额凭证：0：不是（默认值）1：是
    }, params)
  })
}

// 生成凭证（支持批量）
export function createVoucher (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/createVoucher.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      ids: [] // 单据ID数组
    }, params)
  })
}
// 12.7.单张发票保存（并生成凭证）
export function saveAndGeneratePz (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/savePurchaseInvoiceAndGeneratePz.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      bill_id: '', // 单据id
      generatePZ: '', // 是否生成凭证：0：仅仅保存1：保存并且生成凭证
      sm_id: '', // 结算方式id
      acct_20_code: '', // 贷方科目代码
      acct_20_name: '', // 贷方科目名称
      acct_20_ci_name: '', // 贷方科目辅助核算项
      detailList: []
    }, params)
  })
}

// 12.10.待认证转进项税额查询
export function queryToBeCertifiedTax (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/queryToBeCertifiedTax.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf // 业务期间，格式：yyyymm
    }, params)
  })
}
// 12.11 备注信息
export function addRemark (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/addRemark.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf // 业务期间
    }, params)
  })
}

export function createVoucherIncome (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/createVoucherForToBeCertifiedTax.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      total_certify_tax_amount: ''
    }, params)
  })
}
export function savePendingData (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/savePendingData.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      delInfoList: [], // 采购界面删除的发票信息
      cgData: [], // 待用区入库的数
      dyData: [], // 待用区留用的数据
      fpData: [], // 待用区废票数据
      purchaseList: [],
      accountList: []
    }, params)
  })
}
// 查票
export function queryJxHistoryInvoice (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/queryJxHistoryInvoice.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      inv_no: '',
      inv_code: '',
      kpyf: ''
    }, params)
  })
}
export function saveJxHistoryInvoice (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/saveJxHistoryInvoice.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      cgData: []
    }, params)
  })
}
export function queryCertifiedTaxDetail (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/queryCertifiedTaxDetail.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间，格式：yyyymm
      id: ''
    }, params)
  })
}

/* 删除备注信息 */
export function deleteRemark (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/deleteRemark.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间
      ids: params // 单据id
    })
  })
}
// 理票新增科目全科目列表
export function getPurchaseContactList (params) {
  return request({
    url: '/purchase/getContactAccountList.do',
    method: 'GET',
    params: params
  })
}
// 理票下拉列表数据
export function getPurchaseAccountList () {
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/purchase/getAccountList.do',
    method: 'GET',
    params: {qyid: urlInfo.qyid}
  })
}
// 删除存货单据
export function deleteInventoryBill(params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/purchase/deleteInventoryBills.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间
      qyid: urlInfo.qyid // 企业id
    }, params)
  })
}
