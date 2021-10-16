import {Message, MessageBox} from 'element-ui'
import {filterAccount} from '@/utils/filterAccount'
import store from '@/store'

// 点击上一条
export function toUpOrNextPage(type, list, modalType, id) {
  return new Promise((resolve, reject) => {
    if (!list || list.length === 0) {
      Message({
        message: '无更多清单数据',
        type: 'warning'
      })
      return reject
    }
    if (modalType === 'create') {
      let item = list[list.length - 1]
      if (item.mergeList && item.mergeList.length > 0) {
        item = item.mergeList[item.mergeList.length - 1]
      }
      return resolve(item)
    }
    const newList = dealList(list)
    let i = 0
    newList.forEach((v, idx) => {
      if (String(v.id) === String(id)) {
        i = idx
      }
    })
    let hasItem = true
    if (type === 'up') {
      i = i - 1
      if (i < 0) {
        hasItem = false
      }
    } else {
      i = i + 1
      if (i > newList.length - 1) {
        hasItem = false
      }
    }
    if (hasItem) {
      return resolve(newList[i])
    }
    Message({
      message: '无更多清单数据',
      type: 'warning'
    })
    return reject
  })
}

// 点击上一条下一条对列表进行处理
export function dealList(list) {
  const newList = []
  list.forEach((items, idx) => {
    if (items.mergeList && items.mergeList.length > 0) {
      items.mergeList.forEach((item, index) => {
        newList.push(item)
      })
    } else {
      newList.push(items)
    }
  })
  return newList
}

// 查看凭证 点击上一条下一条对凭证id列表进行处理
export function dealListForVoucher(list) {
  const newList = []
  list.forEach((items, idx) => {
    if (items.vch_id_list) {
      items.vch_id_list.split(',').forEach((item, i) => {
        if (item) {
          newList.push(item)
        }
      })
    }
  })
  return newList
}

// 根据筛选条件获取当前列表
export function getCurrentList(type, allList) {
  let list = []
  if (type === '0') {
    list = allList
  } else {
    allList.forEach((item, idx) => {
      if (item.mergeList && item.mergeList.length) {
        item.mergeList.forEach((mItem, mIdx) => {
          if (String(mItem.vm_state) === type) {
            item.vm_state = type
          }
        })
        if (String(item.vm_state) === type) {
          list.push(item)
        }
      } else {
        if (String(item.vm_state) === type) {
          list.push(item)
        }
      }
    })
  }
  return list
}

// 删除凭证之前 校验
export function deleteVoucherBefore(rowData) {
  return new Promise((resolve, reject) => {
    if (!String(rowData.vch_id_list)) {
      Message({
        message: '凭证ID不能为空',
        type: 'warning',
        duration: 3 * 1000
      })
      return reject('凭证ID不能为空')
    }
    MessageBox.alert('确认要删除凭证？删除后数据无法恢复', '删除凭证', {
      confirmButtonText: '确定',
      type: 'warning',
      callback: action => {
        if (action === 'confirm') {
          return resolve(rowData.vch_id_list)
        } else {
          return reject('error')
        }
      }
    })
  })
}

/*
* 如果新增 点击生成凭证按钮 弹出新增页面
* 如是编辑 点击生成凭证按钮 相当于弹出双击下一条 下一条如果没有数据 则弹出新增页面
*/
export function createVoucherAfter(type, list, id, callBackAdd, callBackEdit) {
  if (type === 'edit') {
    const newList = dealList(list)
    let i = 0
    newList.forEach((v, idx) => {
      if (String(v.id) === String(id)) {
        i = idx
      }
    })
    i = i - 1
    if (i < 0) {
      return callBackAdd()
    } else {
      return callBackEdit(newList[i])
    }
  } else {
    return callBackAdd()
  }
}

export function getAccountList() {
  return new Promise((resolve, reject) => {
    const accountList = store.getters.accountList
    if (accountList && accountList.accounts && accountList.accounts.length > 0) {
      getMatchAccountList().then(resp => {
        return resolve(accountList)
      }).catch(error => {
        return reject(error)
      })
    } else {
      store.dispatch('GetAccountList').then(respA => {
        getMatchAccountList().then(resp => {
          return resolve(respA)
        }).catch(error => {
          return reject(error)
        })
      }).catch(error => {
        return reject(error)
      })
    }
  })
}

export function getMatchAccountList() {
  return new Promise((resolve, reject) => {
    const matchAccount = store.getters.matchAccount
    if (matchAccount) {
      return resolve(matchAccount)
    } else {
      store.dispatch('GetMatchAccountList').then(resp => {
        return resolve(resp)
      }).catch(error => {
        return reject(error)
      })
    }
  })
}

export function getCurrencyList() {
  return new Promise((resolve, reject) => {
    const currency = store.getters.currency
    if (currency && currency.length) {
      return resolve(currency)
    } else {
      store.dispatch('GetCurrencyList').then(resp => {
        return resolve(resp)
      }).catch(error => {
        return reject(error)
      })
    }
  })
}

// 检测主表从表必填字段是否为空
export function checkIsEmpty(mainTitle, detailList, billColumns) {
  let isEmpty = null
  Object.keys(mainTitle).forEach((item, index) => {
    const itemVals = mainTitle[item]
    if (isEmpty) return
    if (!itemVals.hide && itemVals.isMust && itemVals.value === '') {
      isEmpty = itemVals.name
    }
  })
  if (isEmpty) {
    return `${isEmpty}不能为空`
  }
  if (detailList) {
    // 检测从表必填字段是否为空
    let hasRow = false
    let idx = ''
    detailList.forEach((item, index) => {
      if (isEmpty) return
      let rawData = null
      Object.keys(item).forEach((val, i) => {
        if (item[val] !== '') {
          hasRow = true
          rawData = true
        }
      })
      if (rawData) {
        billColumns.forEach((billItem, billIdx) => {
          if (isEmpty) return
          if (!billItem.hide && billItem.isMust && item[billItem.prop] === '') {
            isEmpty = billItem.label
            idx = index + 1
          }
        })
      }
    })
    if (!hasRow) {
      return '请输入明细条目'
    }
    if (isEmpty) {
      return `第${idx}行的${isEmpty}不能为空`
    }
  }
  return false
}
const transVal = ['149', '150', '156', '157']
export function judgeOriginal(curTransVal, mainTitle, type, totalData) {
  // curTransVal 为 149出口销售收入 新增相关的币种，汇率，原币金额 【适用销售（普票/其他票据】
  // curTransVal 为 150境外采购 新增相关的币种，汇率，原币金额 【适用采购（已认证）】
  // curTransVal 156收境外往来款项 新增相关的币种，汇率，原币金额 【适用采购（已认证）】
  // curTransVal 为 157付境外往来款项 新增相关的币种，汇率，原币金额 【适用采购（已认证）】
  if (transVal.indexOf(curTransVal) > -1) {
    mainTitle.ccy_name.hide = false
    mainTitle.ccy_rate.hide = false
    mainTitle.amount_for.hide = false
  } else {
    /* if (type === 'purchase' && !mainTitle.amount_for.hide) {
      totalData.totalPrice = (totalData.oldPrice / mainTitle.ccy_rate.value).toFixed(2)
      totalData.totalTax = (totalData.oldTax / mainTitle.ccy_rate.value).toFixed(2)
      totalData.totalAmount = (totalData.oldAmount / mainTitle.ccy_rate.value).toFixed(2)
    } */
    mainTitle.ccy_name.hide = true
    mainTitle.ccy_rate.hide = true
    mainTitle.amount_for.hide = true
  }
  if (mainTitle.import_goods_price) {
    if (curTransVal === '150' && type === 'purchase') {
      mainTitle.import_goods_price.hide = false
      mainTitle.custom.hide = false
      mainTitle.other.hide = true
      mainTitle.inv_code.hide = true
      mainTitle.inv_no.name = '专用缴款书号码'
      mainTitle.inv_no.isMust = false
    } else {
      mainTitle.import_goods_price.hide = true
      mainTitle.custom.hide = true
      mainTitle.other.hide = false
      mainTitle.inv_code.hide = false
      mainTitle.inv_no.name = '发票号码'
      mainTitle.inv_no.isMust = true
    }
  }
}
export function addOriginalCurrency(curTransVal, mainTitle, acctType, type, totalData) {
  judgeOriginal(curTransVal, mainTitle, type, totalData)
  if (!mainTitle.ccy_name.hide) {
    const acctCode = mainTitle[acctType].value
    if (acctCode) {
      getOriginalCurrency(acctCode, mainTitle, type, totalData)
    }
  }
}
export function getOriginalCurrency(code, mainTitle, type, totalData) {
  if (!mainTitle.ccy_name) return
  mainTitle.ccy_name.value = ''
  mainTitle.ccy_name.id = ''
  mainTitle.ccy_rate.value = ''
  if (mainTitle.ccy_name.hide) return
  const acctCode = code.split(' ')[0]
  if (acctCode) {
    let account = []
    if (store.getters.accountList) {
      const allAccount = store.getters.accountList.accountDetail
      account = allAccount.filter(function (item, i) {
        return item._Code === acctCode
      })
    }
    if (account && account.length && account[0]._WBHS) {
      const currency = store.getters.currency
      if (currency && currency.length) {
        const idx = currency.filter(v => v._Code === account[0]._WBDW)
        if (idx && idx.length) {
          mainTitle.ccy_name.id = idx[0]._Code
          mainTitle.ccy_name.value = idx[0]._Name
          mainTitle.ccy_rate.value = idx[0]._Rate
        } else {
          mainTitle.ccy_name.id = 'CNY'
          mainTitle.ccy_name.value = '人民币'
          mainTitle.ccy_rate.value = 1
        }
        if (type === 'sales') {
          if (totalData) {
            mainTitle.amount_for.value = (+totalData.totalAmount / +mainTitle.ccy_rate.value).toFixed(2)
          }
        } else if (type === 'purchase') {
          mainTitle.amount_for.value = (+mainTitle.import_goods_price.value / +mainTitle.ccy_rate.value).toFixed(2)
        } else {
          if ((mainTitle.amount && mainTitle.amount.value !== '')) {
            mainTitle.amount_for.value = (+mainTitle.amount.value / +mainTitle.ccy_rate.value).toFixed(2)
          }
        }
      }
    }
  }
}
export function judgeWBHS(curTransVal) {
  if (curTransVal && transVal.indexOf(curTransVal) > -1) return false
  const indexData = store.getters.indexData
  return String(indexData.iae_mark) === '2'
}
export function checkNum(curVal) {
  if (typeof curVal === undefined || curVal === null || curVal === '') {
    return false
  } else {
    const pattern = new RegExp(/^-?[0-9]*\.?[0-9]{0,2}$/)
    return pattern.test(curVal)
  }
}
export function filerItem(vals, WBHS) {
  const result = {}
  if (WBHS) {
    const currencyAccount = store.getters.currencyAccount
    vals.forEach((item, idx) => {
      const id = item.split(' ')[0]
      if (currencyAccount.indexOf(id) > -1) return
      result[id] = item
    })
  } else {
    vals.forEach((item, idx) => {
      const id = item.split(' ')[0]
      result[id] = item
    })
  }
  return result
}
export function judgeAmountFor(checkData, type, params, callBack) {
  const {amount_for, ccy_rate, totalAmount} = checkData
  if (amount_for && ccy_rate && (+(amount_for * ccy_rate) > +(totalAmount) ||
      +(amount_for * ccy_rate) < +(totalAmount))
  ) {
    const types = {
      'voucher': '生成凭证',
      'add': '新增',
      'save': '保存'
    }
    const message = `本币金额（原币*汇率=本币）与原本币金额（本币/汇率=原币）不一致，是否继续${types[type]}?`
    return MessageBox.confirm(message, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      callBack(type, params)
    }).catch(() => {
    })
  }
  callBack(type, params)
}
export function judgeAssist(dex, mainTitle, editData) {
  const item = mainTitle[dex]
  const curCode = item.value
  const curVal = editData[item.options][curCode]
  if (curVal) {
    const curValArray = curVal.split(' ')
    if (curValArray[2]) {
      item.hasAssist = true
      return
    }
  }
  item.hasAssist = false
}

export function getObjFirstVal(obj) {
  let code = ''
  Object.keys(obj).forEach((item, idx) => {
    if (!code && item && obj[item]) {
      code = item
    }
  })
  return code
}

export function getBankList(mainTitle) {
  const newList = {}
  if (store.getters.accountList) {
    const accounts = store.getters.accountList.accounts
    const bankCode = filterAccount(accounts, ['1002'])
    if (mainTitle.trans_type_id && judgeWBHS(mainTitle.trans_type_id.value)) {
      const currencyAccount = store.getters.currencyAccount
      for (let i = 0; i < bankCode.length; i++) {
        const itemId = bankCode[i].split(' ')[0]
        const itemVal = bankCode[i].split(' ')[1]
        if (currencyAccount.indexOf(itemId) === -1) {
          newList[itemId] = itemVal
        }
      }
    } else {
      for (let i = 0; i < bankCode.length; i++) {
        const itemId = bankCode[i].split(' ')[0]
        newList[itemId] = bankCode[i].split(' ')[1]
      }
    }
  }
  return newList
}

export function sortChange(list, e) {
  if (e.prop === 'strAmount' || e.prop === 'amountStr') {
    e.prop = 'amount'
  } else if (e.prop === 'billDate') {
    e.prop = 'bill_date'
  } else if (e.prop === 'vm_state') {
    e.prop = 'vmState'
  } else if (e.prop === 'sm_name') {
    e.prop = 'sm_id'
  } else if (e.prop === 'collectionTotal') {
    e.prop = 'collectNum'
  } else if (e.prop === 'paymentTotal') {
    e.prop = 'paymentNum'
  } else if (e.prop === 'jshjStr') {
    e.prop = 'jshj'
  }
  const numType = ['paymentNum', 'collectNum', 'amount', 'bill_date', 'ex_tax_amount', 'tax_amount', 'vmState', 'sm_id', 'jshj']
  if (numType.indexOf(e.prop) > -1) {
    if (e.order === 'ascending') {
      return list.sort(function (a, b) {
        return a[e.prop] - b[e.prop]
      })
    }
    return list.sort(function (a, b) {
      return b[e.prop] - a[e.prop]
    })
  } else {
    if (e.order === 'ascending') {
      return list.sort(function (a, b) {
        return a[e.prop].localeCompare(b[e.prop], 'zh')
      })
    }
    return list.sort(function (a, b) {
      return b[e.prop].localeCompare(a[e.prop], 'zh')
    })
  }
}

// 费用,待用区动态统计方法
export function selectAmount(val, tableData) {
  const selectAmount = {
    attachmentNum: 0,
    sum: 0,
    tax: 0,
    amount: 0,
    negativeSum: 0,
    negativeTax: 0,
    negativeAmount: 0
  }
  val.forEach(item => {
    tableData.forEach(v => {
      if (String(v.id) === String(item.id) && String(v.ids) === String(item.ids)) {
        if (item.ex_tax_amount > 0) {
          selectAmount.sum = parseFloat((+selectAmount.sum) + item.ex_tax_amount).toFixed(2)
        } else {
          selectAmount.negativeSum = parseFloat((+selectAmount.negativeSum) + item.ex_tax_amount).toFixed(2)
        }
        if (item.tax_amount > 0) {
          selectAmount.tax = parseFloat((+selectAmount.tax) + item.tax_amount).toFixed(2)
        } else {
          selectAmount.negativeTax = parseFloat((+selectAmount.negativeTax) + item.tax_amount).toFixed(2)
        }
        if (item.amount > 0) {
          selectAmount.amount = parseFloat((+selectAmount.amount) + item.amount).toFixed(2)
        } else {
          selectAmount.negativeAmount = parseFloat((+selectAmount.negativeAmount) + item.amount).toFixed(2)
        }
        if (item.detailList) {
          selectAmount.attachmentNum += item.detailList.length
        } else {
          selectAmount.attachmentNum++
        }
      }
    })
  })

  return selectAmount
}

// 将数字转换成金额显示
// 将数字转换成金额显示
export function toMoney(num) {
  let newNum = ''
  if (num) {
    const numArray = String(num).split('.')
    const numArray0 = numArray[0]
    if (numArray0.length > 3) {
      let count = 0
      const length = numArray0.length - 1
      const k = num < 0 ? 1 : 0
      for (let i = length; i >= k; i--) {
        if (count % 3 === 0 && count !== 0) {
          newNum = numArray0.charAt(i) + ',' + newNum
        } else {
          newNum = numArray0.charAt(i) + newNum
        }
        count++
      }
      if (numArray[1]) {
        newNum = `${newNum}.${numArray[1]}` // 补小数点后位数
      }
      if (num < 0) {
        newNum = `-${newNum}`
      }
    } else {
      newNum = num
    }
  } else {
    newNum = '0'
  }
  return newNum // 字符串23,245.12形式
}
