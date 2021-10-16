import {filterAccount} from '@/utils/filterAccount'
import store from '@/store'

// 获取银行账号列表
export function bankList () {
  const accounts = store.getters.accountList.accounts || []
  const bankCode = filterAccount(accounts, ['1002'])
  const newList = {}
  for (let i = 0; i < bankCode.length; i++) {
    const itemId = bankCode[i].split(' ')[0]
    const itemVal = bankCode[i].split(' ')[1]
    // ‘计提并发放’时，若结算方式为‘银行存款’时，‘银行账号’字段若找到1002科目无下级时，直接将1002 的名称 银行存款 带出，生成凭证时科目套用1002
    // lss 2018-5-18
    if (itemId !== '1002' && bankCode.length > 1 ) {
      newList[itemId] = itemVal
    } else {
      newList[itemId] = itemVal
    }
  }
  return newList
}

// 获取银行账号列表（需要过滤外币账号的方法）lss 2018-5-24
export function bankList2 () {
  const accounts = store.getters.accountList.accounts || []
  const bankCode0 = filterAccount(accounts, ['1002'])

  // lss 2018-5-24 .过滤外币账号
  const currencyAccount = store.getters.currencyAccount
  console.log('-------------',currencyAccount)
  let bankCode = bankCode0.filter(function(item,index){
    console.log(item)
    let _id = item.split(' ')[0]
    return currencyAccount.indexOf(_id) === -1
  })


  const newList = {}
  for (let i = 0; i < bankCode.length; i++) {
    const itemId = bankCode[i].split(' ')[0]
    const itemVal = bankCode[i].split(' ')[1]
    // ‘计提并发放’时，若结算方式为‘银行存款’时，‘银行账号’字段若找到1002科目无下级时，直接将1002 的名称 银行存款 带出，生成凭证时科目套用1002
    // lss 2018-5-18
    if (itemId !== '1002' && bankCode.length > 1 ) {
      newList[itemId] = itemVal
    } else {
      newList[itemId] = itemVal
    }
  }



  return newList
}
