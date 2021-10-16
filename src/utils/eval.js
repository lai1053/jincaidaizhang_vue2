import {filterAccount} from '@/utils/filterAccount'
import store from '@/store'

// 获取末级核算科目（type true去除外币科目 false包含外币科目 ）
export function getLastStageCode(code, type) {
  const accountList = store.getters.accountList
  let list = []
  if (accountList && accountList.accounts && accountList.accounts.length) {
    list = filterAccount(accountList.accounts, code)
  } else {
    store.dispatch('GetAccountList').then(resp => {
      const accounts = store.getters.accountList.accounts
      list = filterAccount(accounts, code)
    })
  }
  if (!type) return list
  return removeCurrencyAccount(list)
}

export function removeCurrencyAccount(list) {
  const currencyAccount = store.getters.currencyAccount
  const result = []
  list.forEach((item, idx) => {
    const id = typeof (item) === 'object' ? item.account.split(' ')[0] : item.split(' ')[0]
    if (currencyAccount.indexOf(id) > -1) return
    result.push(item)
  })
  return result
}

export function isFuzhuSub(acct) {
  let acctCodeName = acct
  const accountList = store.getters.accountList
  if (accountList && accountList.lastAccount) {
    const detail = accountList.lastAccount
    const idx = detail.findIndex(v => v._Code === acct.split(' ')[0])
    if (idx > -1 && detail[idx]._AuxAccItem.trim() !== '' && detail[idx]._AuxAccItem.trim() !== null) {
      acctCodeName = `${acct.split(' ')[0]} ${acct.split(' ')[1]} 辅`
    }
  }
  return acctCodeName
}
export function isDisabledSub(acct) {
  const accountList = store.getters.accountList
  if (accountList && accountList.disabledAccount) {
    const detail = accountList.disabledAccount
    const idx = detail.findIndex(v => v._Code === acct.split(' ')[0])
    return idx > -1
  }
}
