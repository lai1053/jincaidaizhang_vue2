import {filterAccount} from '@/utils/filterAccount'
import {filerItem} from '@/utils/utils'
import store from '@/store'
export function getDeditSub(curTransVal, editData) {
  const credit = filerDebitSub(curTransVal)
  if (store.getters.accountList && credit.length) {
    const accounts = store.getters.accountList.accounts || []
    const creditAccount = filterAccount(accounts, credit)
    editData.debitSub = filerItem(creditAccount)
  } else {
    editData.debitSub = {}
  }
}
export function getCreditSub (editData) {
  const credit = filerCreditSub()
  if (store.getters.accountList && credit.length) {
    const accounts = store.getters.accountList.accounts || []
    const creditAccount = filterAccount(accounts, credit)
    editData.creditSub = filerItem(creditAccount)
  } else {
    editData.creditSub = {}
  }
}
const versionValue = {
  bzb: 'standard',
  jjb: 'simple'
}
// 主表过滤结算科目规则
export function filerDebitSub (curSmIdVal) {
  const indexData = store.getters.indexData
  const version = indexData.version
  let creditCode = []
  switch (curSmIdVal) {
    case '0': // 往来结算
      creditCode = ['1121', '1122', '1123', '1221', '2201', '2202', '2203', '2241', '1001']
      break
    case '1': // 现金
      creditCode = ['1001']
      break
    case '2': // 银行存款
      creditCode = ['1002']
      break
    case '3': // 支付宝
      creditCode = version === versionValue.jjb ? ['1221', '1012'] : ['101209']
      break
    case '4': // 微信
      creditCode = version === versionValue.jjb ? ['1221', '1012'] : ['101210']
      break
    case '5': // 冲减预收款
      creditCode = ['1122', '2202', '2203']
      break
    case '6': // 冲减预付款
      creditCode = ['1122', '1123', '2202']
      break
    case '7': // 暂未收款
      creditCode = ['1122']
      break
    case '8': // 未付货款
      creditCode = ['2202']
      break
    case '9':
      creditCode = ['122101']
      break
    case '10': // 银行本票
    case '11': // 银行汇票
      creditCode = ['1002', '2201']
      break
    case '12': // 商业汇票
      creditCode = ['1121']
      break
  }
  return creditCode
}
export function filerCreditSub () {
  const indexData = store.getters.indexData
  const acctSys = String(indexData.acctsys_id) // 会计准则
  let credit = []
  credit = acctSys === '101' ? ['6001', '6051', '6031'] : ['5001', '5051', '5301']
  return credit
}
export function isAssist (val) {
  if (val) {
    const accountList = store.getters.accountList
    if (accountList && accountList.accountDetail) {
      const curVal = val.split(' ')
      const detail = accountList.accountDetail
      const idx = detail.findIndex(v => {
        return v._Code === curVal[0]
      })
      if (idx > -1 && detail[idx]._AuxAccItem.trim() !== '' && detail[idx]._AuxAccItem.trim() !== null) {
        val = `${val} 辅`
      }
    }
    return val
  }
}
