import {filterAccount} from '@/utils/filterAccount'
import store from '@/store'
export function getAllBankCodeList() {
  const accounts = store.getters.accountList.accounts || []
  const bankCode = filterAccount(accounts, ['1002'])
  const newList = {}
  for (let i = 0; i < bankCode.length; i++) {
    const itemId = bankCode[i].split(' ')[0]
    newList[itemId] = bankCode[i].split(' ')[1]
  }
  return newList
}
