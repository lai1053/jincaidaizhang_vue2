import {filterAccount} from '@/utils/filterAccount'
import {addOriginalCurrency, getOriginalCurrency, judgeWBHS, filerItem, getObjFirstVal, getBankList} from '@/utils/utils'
import store from '@/store'

const versionValue = {
  bzb: 'standard',
  jjb: 'simple'
}

export function getMainFileVal(dex, mainTitle, editData, billResp, totalData, mainAssistSub) {
  switch (dex) {
    case 'trans_type_id': // 收入类型改变时，摘要的联动, 贷方科目联动
      changeTransType(dex, mainTitle, editData, billResp, totalData, mainAssistSub)
      break
    case 'sm_id': // 结算类型改变时，其他科目(银行账号、客户名称、借方科目)的联动
      changeSmId(dex, mainTitle, editData, billResp, totalData, mainAssistSub)
      break
    case 'bank_acct_code': // 银行账号改变时，其他科目(借方科目)的联动
      changeBankCode(dex, mainTitle, editData, totalData, mainAssistSub)
      break
    case 'cust_name': // 客户名称改变时，(借方科目)的联动
      changeCustName(dex, mainTitle, editData, billResp, totalData, mainAssistSub)
      break
    case 'acct_10_code': // 借方科目改变时，原币币种的联动
      changeAcct10Code(dex, mainTitle, totalData, mainAssistSub)
      break
    case 'acct_20_code':
      mainAssistSub.acct_20_ci_name = ''
      break
    case 'amount_for': // 借方科目改变时，原币币种的联动
      changeAmountFor(dex, mainTitle, totalData)
      break
  }
  return {mainTitle, editData}
}

function changeTransType(dex, mainTitle, editData, billResp, totalData, mainAssistSub) {
  const curTransVal = mainTitle[dex].value
  // 1销售商品 2销售产品 3提供修理、加工劳务收入 4销售材料收入 5动产租赁收入 6不动产租赁收入 7罚款（违约）收入 8服务收入
  getCreditSub(curTransVal, editData)
  // console.log(getObjFirstVal(editData.creditSub))
  mainTitle.acct_20_code.value = getObjFirstVal(editData.creditSub)
  mainTitle.acct_20_code.type = curTransVal === '7' ? 'select' : 'autoComplete'
  mainTitle.summary.value = editData.mainType[curTransVal]
  // curTransVal 为 149出口销售收入 新增相关的币种，汇率，原币金额 【适用销售（普票/其他票据】
  addOriginalCurrency(curTransVal, mainTitle, 'acct_10_code', 'sales', totalData)
  mainAssistSub.acct_20_ci_name = ''
  // 业务类型改变 在有结算方式的前提下过滤 借方科目
  const curSmIdVal = mainTitle.sm_id.value
  if (curSmIdVal) {
    getDebitSubList(curSmIdVal, mainTitle, editData)
    if (!editData.debitSub[mainTitle.acct_10_code.value]) {
      mainTitle.acct_10_code.value = getObjFirstVal(editData.debitSub)
      mainAssistSub.acct_10_ci_name = ''
    }
  }
}

export function getCreditSub(curTransVal, editData) {
  const credit = filerCreditSub(curTransVal)
  if (store.getters.accountList && credit.length) {
    const accounts = store.getters.accountList.accounts || []
    const creditAccount = filterAccount(accounts, credit)
    editData.creditSub = filerItem(creditAccount)
  } else {
    editData.creditSub = {}
  }
}

export function filerCreditSub(curTransVal) {
  const indexData = store.getters.indexData
  const version = indexData.version
  const acctSys = String(indexData.acctsys_id) // 会计准则
  const iaeMark = String(indexData.iae_mark)
  let credit = []
  if (curTransVal <= 3) {
    if (iaeMark === '2') {
      if (version === versionValue.jjb) {
        credit = acctSys === '101' ? ['6001'] : ['5001']
      } else {
        credit = acctSys === '101' ? ['600181'] : ['500181']
      }
    } else {
      credit = acctSys === '101' ? ['6001'] : ['5001']
    }
  } else if (curTransVal === '7') { // 7罚款（违约）收入
    if (version === versionValue.jjb) {
      credit = acctSys === '101' ? ['6301'] : ['5301']
    } else {
      credit = acctSys === '101' ? ['630108'] : ['530110']
    }
  } else {
    if (iaeMark === '2' && curTransVal === '149') {
      if (version === versionValue.jjb) {
        credit = acctSys === '101' ? ['6001'] : ['5001']
      } else {
        credit = acctSys === '101' ? ['600182'] : ['500182']
      }
    } else {
      if (curTransVal === '8') {
        credit = acctSys === '101' ? ['6051', '6001'] : ['5051', '5001']
      } else {
        credit = acctSys === '101' ? ['6051'] : ['5051']
      }
    }
  }
  return credit
}

export function changeSmId(dex, mainTitle, editData, billResp, totalData, mainAssistSub) {
  const curSmIdVal = mainTitle[dex].value
  // 结算类型为银行存款时银行账号(bank_acct_code)科目可选
  // 金财管家V1.0 清单数据录入字段优化业务需求2018-06-05 删除银行账号
  /* if (curSmIdVal === '2') {
    editData.bankCode = getBankList(mainTitle)
    mainTitle.bank_acct_code.isMust = true
    mainTitle.bank_acct_code.type = 'select'
    mainTitle.bank_acct_code.options = 'bankCode'
  } else {
    mainTitle.bank_acct_code.isMust = false
    mainTitle.bank_acct_code.type = 'disabled'
  }
  mainTitle.bank_acct_code.value = '' */
  /** 结算类型改变，客户名称(cust_name)类型改变
   /* ['1', '3', '4']: 为type = 'select', isMust = false
   /* ['2' ]: 为type = 'input', isMust = false
   /* ['5', '7', '10', '11', '12']: 为type = 'select', isMust = true **/
  /* const type1 = ['1', '3', '4', '6', '8']
  const type2 = ['2']
  const type3 = ['5', '7', '10', '11', '12']
  if (type1.indexOf(curSmIdVal) > -1) {
    mainTitle.cust_name.isMust = false
    mainTitle.cust_name.type = 'selectInput'
  }
  if (type2.indexOf(curSmIdVal) > -1) {
    mainTitle.cust_name.isMust = false
    mainTitle.cust_name.type = 'input'
  }
  if (type3.indexOf(curSmIdVal) > -1) {
    mainTitle.cust_name.isMust = true
    mainTitle.cust_name.type = 'selectInput'
  }
  mainTitle.cust_name.value = '' */
  getDebitSubList(curSmIdVal, mainTitle, editData)

  getDebitByMemory(dex, mainTitle, editData, billResp, totalData, mainAssistSub)
}

export function getDebitSubList(curSmIdVal, mainTitle, editData) {
  /** 结算类型改变，借方科目(debitSub)类型改变 **/
  const debitCode = filerDebitSub(curSmIdVal)
  if (store.getters.accountList && debitCode.length) {
    const accounts = store.getters.accountList.accounts || []
    const debit = filterAccount(accounts, debitCode)
    /* if (curSmIdVal === '2') {
      const debitAccount = []
      for (let i = 0; i < debit.length; i++) {
        if (debit[i].split(' ')[0] !== '1002') {
          debitAccount.push(debit[i])
        }
      }
      debit = debitAccount
    } */
    if (mainTitle.trans_type_id) {
      editData.debitSub = filerItem(debit, judgeWBHS(mainTitle.trans_type_id.value))
    } else {
      editData.debitSub = filerItem(debit)
    }
  } else {
    editData.debitSub = {}
  }
  if (mainTitle.trans_type_id) {
    mainTitle.acct_10_code.type = curSmIdVal === '' || curSmIdVal === '1' ? 'select' : 'autoComplete'
  }
}

function changeBankCode(dex, mainTitle, editData, totalData, mainAssistSub) {
  const codeVal = editData.debitSub[mainTitle[dex].value] ? mainTitle[dex].value : ''
  if (mainTitle.acct_10_code.value === codeVal) return
  mainTitle.acct_10_code.value = codeVal
  changeAcct10Code('acct_10_code', mainTitle, totalData, mainAssistSub)
}

function changeCustName(dex, mainTitle, editData, billResp, totalData, mainAssistSub) {
  const curCustName = mainTitle[dex].value // 当前的客户id
  if (editData.cusName.indexOf(curCustName) < 0) return
  getDebitByMemory(dex, mainTitle, editData, billResp, totalData, mainAssistSub)
  /* const curSmIdVal = mainTitle.sm_id.value // 当前的结算方式
  const drList = billResp.drList
  const cust_acctList = editData.debitSub
  const newList = {}
  if (drList && drList.length > 0) {
    let debitAcct = ''
    for (let i = 0; i < cust_acctList.length; i++) {
      if (cust_acctList[i].split(' ')[1] === curCustName) {
        newList.push(cust_acctList[i])
        debitAcct = cust_acctList[i].split(' ')[0]
      } else {
        newList.push(cust_acctList[i])
      }
    }
    for (let i = 0; i < drList.length; i++) {
      if (drList[i].split('-')[0].split(';')[0] === curCustName) {
        if (drList[i].split('-')[0].split(';')[1] === curSmIdVal) {
          debitAcct = drList[i].split('-')[1].split(' ')[0]
        } else {
          debitAcct = ''
        }
      }
    }
    mainTitle.acct_10_code.value = debitAcct
  } else {
    for (let i = 0; i < cust_acctList.length; i++) {
      if (cust_acctList[i].split(' ')[1] === curCustName) {
        newList.push(cust_acctList[i])
        mainTitle.acct_10_code.value = cust_acctList[i].split(' ')[0]
      } else {
        newList.push(cust_acctList[i])
      }
    }
  }
  getOriginalCurrency(mainTitle.acct_10_code.value, mainTitle, 'sales', totalData) */
}

// 主表过滤借方科目规则
function filerDebitSub(curSmIdVal) {
  const indexData = store.getters.indexData
  const version = indexData.version
  let debitCode = []
  switch (curSmIdVal) {
    case '1': // 现金
      debitCode = ['1001']
      break
    case '2': // 银行存款
      debitCode = ['1002']
      break
    case '3': // 支付宝
      debitCode = version === versionValue.jjb ? ['1221', '1012'] : ['101209']
      break
    case '4': // 微信
      debitCode = version === versionValue.jjb ? ['1221', '1012'] : ['101210']
      break
    case '5': // 冲减预收款
      debitCode = ['1122', '2203', '2202']
      break
    case '6': // 冲减预付款
      debitCode = ['1123', '2202']
      break
    case '7': // 暂未收款
      debitCode = ['1122']
      break
    case '8': // 未付货款
      debitCode = ['2202']
      break
    case '9':
      debitCode = ['122101']
      break
    case '10': // 银行本票
    case '11': // 银行汇票
      debitCode = ['1002', '1121']
      break
    case '12': // 商业汇票
      debitCode = ['1121']
      break
  }
  return debitCode
}

// 新增过滤上级科目规则
export function filerSuperiorSub(curSmIdVal) {
  const indexData = store.getters.indexData
  const version = indexData.version
  let code = []
  switch (curSmIdVal) {
    case '1':
      code = ['1001']
      break
    case '2':
      code = ['1002']
      break
    case '3':
      code = version === versionValue.jjb ? ['1221', '1012'] : ['1221', '101209']
      break
    case '4':
      code = version === versionValue.jjb ? ['1221', '1012'] : ['1221', '101210']
      break
    case '5':
      code = ['1122', '2203', '2202']
      break
    case '6':
      code = ['1123', '2202']
      break
    case '7':
      code = ['1122']
      break
    case '8':
      code = ['2202']
      break
    case '9':
      code = ['122101']
      break
    case '10':
    case '11':
      code = ['1002', '1121']
      break
    case '12':
      code = ['1121']
      break
  }
  return code
}

// 记忆功能 客户_结算方式->借方科目
function getDebitByMemory(dex, mainTitle, editData, billResp, totalData, mainAssistSub) {
  const curCust = mainTitle.cust_name.value
  const curSmId = mainTitle.sm_id.value
  let codeVal = editData.debitSub[mainTitle.acct_10_code.value] ? mainTitle.acct_10_code.value : ''
  if (dex === 'sm_id') {
    // 结算方式改变，借方科目默认显示列表第一个
    codeVal = getObjFirstVal(editData.debitSub)
  }
  let flag = false
  if (curCust && curSmId && curSmId !== '2' && billResp.drList && billResp.drList.length) {
    const curVal = `${curCust};${curSmId}`
    billResp.drList.forEach((item, idx) => {
      if (curVal === item.split('-')[0]) {
        flag = true
        const code = item.split('-')[1].split(' ')[0]
        codeVal = editData.debitSub[code] ? code : ''
      }
    })
  }
  if (!flag || codeVal === '') {
    Object.keys(editData.debitSub).forEach((item) => {
      if (editData.debitSub[item].split(' ')[1] === curCust) {
        codeVal = editData.debitSub[item].split(' ')[0]
      }
    })
  }
  if (!codeVal) return
  if (codeVal === mainTitle.acct_10_code.value) return
  mainTitle.acct_10_code.value = codeVal
  changeAcct10Code('acct_10_code', mainTitle, totalData, mainAssistSub)
}

// 记忆功能  根据销售方式，商品或服务名称，和规格型号，获得从表贷方科目值
export function getSubForMemory(goods_name, specification, trans_type_id, list) {
  let acct_20 = ''
  if (goods_name !== '' && specification !== '' && trans_type_id !== '') {
    const con = `${goods_name};${specification};${trans_type_id}`
    list.forEach((item, idx) => {
      const curItem = item.split(';')
      const sfv = `${curItem[0]};${curItem[1]};${curItem[2]}`
      if (con === sfv) {
        acct_20 = curItem[3].replace('\t', ' ').split(' ')[0]
      }
    })
  }
  return acct_20
}
function changeAmountFor(dex, mainTitle, totalData) {
  if (+totalData.totalAmount > 0 && +mainTitle[dex].value > 0) {
    mainTitle.ccy_rate.value = (totalData.totalAmount / mainTitle[dex].value).toFixed(4)
  }
}

function changeAcct10Code(dex, mainTitle, totalData, mainAssistSub) {
  getOriginalCurrency(mainTitle[dex].value, mainTitle, 'sales', totalData)
  // judgeAssist(dex, mainTitle, editData)
  mainAssistSub.acct_10_ci_name = ''
}
