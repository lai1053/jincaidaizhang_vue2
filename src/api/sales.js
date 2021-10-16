import request from '@/utils/req'
import stores from '@/store/index'
const store = stores

/* 获取销售单据列表1111 */
export function getSaleList (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/sale/querySaleListForPage.do',
    method: 'POST',
    data: Object.assign({
      // sub: indexData.subordinateindustry, // 行业类型1:工业2:商业99:通用
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      // iaeMark: indexData.iae_mark, // 进出口企业标志"1":非进出口企业"2":进出口企业
      screen: '0', // 刷选的单据类型：0:全部1:未执行生成2:已生成凭证3:生成凭证失败
      year_period: urlInfo.ssyf, // 所属月份
      type: '' // 销售类型
    }, params)
  })
}

/* 查看单条清单明细 */
export function queryDetail (params) {
  const indexData = store.getters.indexData
  return request({
    url: '/saleInvoice/queryDetail.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      billId: ''
    }, params)
  })
}

/* 删除清单 */
export function delSaleInvoice (params) {
  const indexData = store.getters.indexData
  return request({
    url: `/saleInvoice/delSaleInvoice.do?ids=${params.ids}&ent_id=${indexData.entAcctVO.id}`,
    method: 'GET'
  })
}

/* 生成凭证 111*/
export function createVoucher (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/sale/createVoucher.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf // 会计期间
    }, params)
  })
}

/* 单个删除凭证1111 */
export function delVoucher (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/sale/deleteVoucher.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid,
      vch_id_list_array: '', // 凭证id
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf // 会计期间
      // token: urlInfo.token, // 用户token
      // acctId: urlInfo.accountId // 账套id
    }, params)
  })
}

/* 批量删除凭证  */
export function batchDelVoucher (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/saleInvoice/batchDelVoucher.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid,
      ids: [], // 凭证id
      ent_id: indexData.entAcctVO.id, // 企业id
      token: urlInfo.token, // 用户token
      acctId: urlInfo.accountId // 账套id
    }, params)
  })
}

/* 编辑页面接口 */
export function editBills (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: 'sale/querySaleInvoiceDetail.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      // type: '', // 销售类型
      // archiveCode: urlInfo.ssyf, // 会计期间
      qyid: urlInfo.qyid, // 企业id
      billId: '', // 编辑清单id
      year_period: urlInfo.ssyf // 会计期间
      // acctSys: indexData.acctsys_id, // 会计准则
      // hasVoucher: '' // 生成凭证的标记
    }, params)
  })
}

/* 批量设置的页面 */
export function batchSet (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/saleInvoice/batchSet.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业ID
      archiveCode: urlInfo.ssyf, // 会计期间
      type: '', // 销售类型id
      ent_id: indexData.entAcctVO.id, // 企业id
      sub: indexData.subordinateindustry, // 行业类型
      billIds: '' // 清单id,多个id以;拼接
    }, params)
  })
}

/* 保存科目新增接口 */
export function addAcct (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/saleInvoice/addAcct.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      qyid: urlInfo.qyid, // 企业ID
      checked: '', // 会择同步客户复选框值为true
      custName: '', // 客户名称
      acctName: '', // 科目名称
      currency: '', // 外币名称
      acct: '' // 父级科目code
    }, params)
  })
}

/* 保存批量设置接口 */
export function saveBatch (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/saleInvoice/saveBatch.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业ID
      billIds: '', // 多条清单以;拼接
      type: '', // 销售类型id
      ent_id: indexData.entAcctVO.id, // 企业id
      sub: indexData.subordinateindustry, // 行业类型
      bankAcct: '', // 银行账号
      payMent: '', // 结算方式
      custName: '', // 客户名称
      debit: '' // 借方科目
    }, params)
  })
}

/* 保存清单 */
export function saveInvoice (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/saleInvoice/saveInvoice.do',
    method: 'POST',
    data: {
      bill: JSON.stringify(
        Object.assign({
          ssyf: urlInfo.ssyf, // 会计期间
          billId: '', // 清单的id,新增的时候是0,编辑的时候大于0
          ent_id: indexData.entAcctVO.id, // 企业的id
          archiveCode: urlInfo.ssyf, // 会计期间
          year_period: urlInfo.ssyf, // 会计期间
          iaeMark: indexData.iae_mark, // 进出口企业标志"1":非进出口企业"2":进出口企业
          qyid: urlInfo.qyid, // 企业id
          type: '', // 销售类型
          typeId: '', // 选择的销售类型id
          bankAcct: '', // 银行账号
          payMent: '', // 结算方式
          inv_no: '', // 发票号码
          inv_code: '', // 发票代码
          custName: '', // 客户名称
          debit: '', // 借方科目
          credit: '', // 贷方科目
          summary: '', // 摘要
          price: '', // 金额
          tax: '', // 税额
          amount: '', // 价税合计
          desc: '', // 业务说明
          modify_trans_type_id: false,
          kpdw: '',
          detail: [] // 从档数据
        }, params)
      )
    }
  })
}

/* 保存清单并生成凭证接口 */
export function saveAndNewVoucher (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/saleInvoice/saveAndNewVoucher.do',
    method: 'POST',
    data: {
      bill: JSON.stringify(
        Object.assign({
          acctId: urlInfo.accountId, // 账套id
          ssyf: urlInfo.ssyf, // 会计期间
          billId: '', // 清单的id,新增的时候是0,编辑的时候大于0
          ent_id: indexData.entAcctVO.id, // 企业的id
          archiveCode: urlInfo.ssyf, // 会计期间
          year_period: urlInfo.ssyf, // 会计期间
          iaeMark: indexData.iae_mark, // 进出口企业标志"1":非进出口企业"2":进出口企业
          qyid: urlInfo.qyid, // 企业id
          type: '', // 销售类型
          typeId: '', // 选择的销售类型id
          bankAcct: '', // 银行账号
          payMent: '', // 结算方式
          inv_no: '', // 发票号码
          inv_code: '', // 发票代码
          custName: '', // 客户名称
          debit: '', // 借方科目
          credit: '', // 贷方科目
          summary: '', // 摘要
          price: '', // 金额
          tax: '', // 税额
          amount: '', // 价税合计
          desc: '', // 业务说明
          modify_trans_type_id: false,
          kpdw: '',
          detail: [] // 从档数据
        }, params)
      )
    }
  })
}

/* 保存贷方科目新增接口 saveDebit*/
export function saveDebit (params) {
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/saleInvoice/saveDebit.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业ID
      numberUnit: '', // 数量单位值
      acctName: '', // 科目名称
      currency: '', // 外币名称
      acct: '' // 父级科目code
    }, params)
  })
}

// 11.6.单张发票保存（并生成凭证）
export function saveSaleInvoiceAndGeneratePz (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/sale/saveSaleInvoiceAndGeneratePz.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业ID
      ent_id: indexData.entAcctVO.id, // 企业的id
      year_period: urlInfo.ssyf // 会计期间
    }, params)
  })
}

// 理票数据获取
export function downloadSaleInvoice (params) {
  const urlInfoQyid = store.getters.urlInfo.qyid
  const year_period = store.getters.urlInfo.ssyf
  const indexData = store.getters.indexData.entAcctVO.id
  if (urlInfoQyid && year_period && indexData) {
    return request({
      url: '/sale/downloadSaleInvoice.do',
      method: 'POST',
      data: Object.assign({
        qyid: urlInfoQyid, // 企业ID
        ent_id: indexData, // 企业的id
        year_period: year_period// 会计期间
      }, params)
    })
  }
}
// 科目确认数据查询
export function querySaleAcctList (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/sale/querySaleAcctList.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业ID
      ent_id: indexData.entAcctVO.id, // 企业的id
      year_period: urlInfo.ssyf // 会计期间
    }, params)
  })
}
// 保存业务和科目
export function saveAcct (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/sale/saveSaleSummaryAndAcct.do',
    method: 'POST',
    data: Object.assign({
      qyid: urlInfo.qyid, // 企业ID
      ent_id: indexData.entAcctVO.id, // 企业的id
      year_period: urlInfo.ssyf // 会计期间
    }, params)
  })
}
// 备注信息
export function addRemark (params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/sale/addRemark.do',
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
    url: '/sale/deleteRemark.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间
      billIdArray: params // 单据id
    })
  })
}
// 12 19 理票新增科目信息
export function getSaleContactList(params) {
  return request({
    url: '/sale/getContactAccountList.do',
    method: 'GET',
    params: params
  })
}
// 理票下拉列表数据
export function getSaleAccountList() {
  const urlInfo = store.getters.urlInfo
  return request({
    url: '/sale/getAccountList.do',
    method: 'GET',
    params: {qyid: urlInfo.qyid}
  })
}
// 删除清单
export function deleteSaleInvoice(params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/sale/deleteSaleInvoice.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间
      qyid: urlInfo.qyid, // 企业ID
      billIdArray: [] // 单据id
    }, params)
  })
}
// 删除存货单据
export function deleteInventoryBill(params) {
  const urlInfo = store.getters.urlInfo
  const indexData = store.getters.indexData
  return request({
    url: '/sale/deleteInventoryBills.do',
    method: 'POST',
    data: Object.assign({
      ent_id: indexData.entAcctVO.id, // 企业id
      year_period: urlInfo.ssyf, // 业务期间
      qyid: urlInfo.qyid // 企业id
    }, params)
  })
}
