import {Loading} from 'element-ui'
import {localParams} from '@/views/components/data/common'
import {getAssisi} from '@/api/common'
import store from '@/store'

export function showFuzhu (accountingData, type) {
  Loading.service(localParams)
  getAssisi({
    acctCiName: accountingData.acctCiName
  }).then(resp => {
    Loading.service().close()
    initAissisiData(resp, accountingData, type)
    accountingData.fuzhuModal = true
    accountingData.resData = resp
    accountingData.acct_all = accountingData.title
  }).catch(error => {
    Loading.service().close()
  })
}
export function initAissisiData (resp, accountingData, type) {
  const acxAccItem = store.getters.accountList.acxAccItem
  const code = accountingData.title.split(' ')[0]
  let currentItem
  const normalizeData = []
  for (let j = 0; j < acxAccItem.length; j++) {
    if (acxAccItem[j]._Code === code) {
      currentItem = acxAccItem[j]._AuxAccItem.split(',')
      break
    }
  }
  for (let n = 0; n < currentItem.length; n++) {
    for (let k = 0; k < resp.data.length; k++) {
      if (currentItem[n] === resp.data[k].name) {
        normalizeData.push(resp.data[k])
      }
    }
  }
  accountingData.showItem = currentItem
  const subArr = []
  const submitData = []
  const optionVal = []
  for (let i = 0; i < normalizeData.length; i++) {
    const fuzuData = accountingData.fuzuData
    normalizeData[i].modelVal = type === 'addAcct' ? fuzuData[i].modelVal : ''
    if (normalizeData[i].childrenOne.length > 0) {
      normalizeData[i].childrenOne[0].modelVal =  type === 'addAcct' ? fuzuData[i].childrenOne[0].modelVal : ''
      subArr.push(normalizeData[i].childrenOne[0])
    } else {
      subArr.push([])
    }
    submitData.push({})
    
    optionVal.push([])
  }
  // 设置二级联动初始数据
  for (let j = 0; j < subArr.length; j++) {
    subArr[j] = []
  }
  accountingData.fuzuData = normalizeData  // 所有数据
  accountingData.subData = subArr          // 所有二级下拉框数据
  accountingData.submitData = submitData   // 要提交的数据
  accountingData.optionVal = optionVal     // 当第一个下拉框有值时，第二个下拉框可选的下拉值
  accountingData.fuzuData.forEach((item, idx) => {
    if (item.editData &&  !item.modelVal) {
      item.modelVal = item.editData.oneChildName ? item.editData.oneChildName : ''
      if (item.modelVal) {
        changeAsisis(idx, item, accountingData)
        item.childrenOne[0].modelVal = item.editData.twoChildName ? item.editData.twoChildName : ''
        if (item.childrenOne[0].modelVal) {
          changeSub(idx, item.childrenOne[0].modelVal, accountingData)
        }
      }
    } else if (type === 'addAcct' && item.modelVal) {
      changeAsisis(idx, item, accountingData, true)
      const modelVal = item.childrenOne[0].modelVal
      if (modelVal) {
        changeSub(idx, modelVal, accountingData)
      }
    } else {
      if (item.name !== '部门') {
        item.modelVal = item.childrenOne[0].name
        changeAsisis(idx, item, accountingData)
        const tips = accountingData.tips
        if (accountingData.tips) {
          let subDefaultVal = accountingData.optionVal[idx].filter(v => {
            return v === tips
          })
          if (subDefaultVal.length === 0) {
            const tipsArray = tips.split('*').reverse()
            let matchWords = ''
            for (let i = 0; i < tipsArray.length; i++) {
              for (const item of accountingData.optionVal[idx]) {
                if (tipsArray[i] !== '') {
                  matchWords = tipsArray[i] === item || tipsArray[i].split('(')[0] === item ? item : ''
                }
                if (tipsArray[i] !== '' && (!matchWords && item.indexOf(tipsArray[i]) > -1) || (!matchWords && tipsArray[i].indexOf(item) > -1)) {
                  subDefaultVal.push(item)
                }
              }
              if (matchWords) {
                subDefaultVal = [matchWords]
                break
              }
            }
          }
          if (subDefaultVal && subDefaultVal.length) {
            item.childrenOne[0].modelVal = subDefaultVal.sort(function (a, b) {
              return b.length - a.length
            })[0]
            if (item.childrenOne[0].modelVal) {
              changeSub(idx, item.childrenOne[0].modelVal, accountingData)
            }
          }
        }
      }
    }
  })
}

export function changeAsisis (index, fuzhuItem, accountingData, type) {
  let subIndex = ''
  const selectedGroupData = fuzhuItem.chilldrenName // 第一个下拉框所有的下拉数据
  // 当前选中的值的下标
  for (let i = 0; i < selectedGroupData.length; i++) {
    if (selectedGroupData[i] === fuzhuItem.modelVal) {
      subIndex = i
      break
    }
  }
  // 清空第二个下拉框显示的值
  fuzhuItem.childrenOne[0].modelVal = type ? fuzhuItem.childrenOne[0].modelVal : ''
  // 设置当前下拉框要提交的的初始值
  accountingData.submitData[index] = {}
  // 是否有第二个下拉框
  const exp = fuzhuItem.childrenOne[subIndex].childrenTwo
  const classId = fuzhuItem.id
  // const pId = fuzhuItem.childrenOne[subIndex].pId
  if (fuzhuItem.name === '部门') {
    const obj = {}
    obj[classId] = fuzhuItem.childrenOne[subIndex].code
    accountingData.submitData[index] = obj
  }
  // 第二个下拉框数据线
  if (exp === null) {
    accountingData.subData[index] = []
  } else {
    accountingData.subData[index] = exp
  }
  // 当前选中数据对应的第二个下拉框的值
  const currentSubData = accountingData.subData[index]
  const currentSubValue = []
  // 把当前选中的值对应到第二下拉框所有可选择的值压入数组，以便知道当第二个下拉框被选中时的下标
  for (let n = 0; n < currentSubData.length; n++) {
    currentSubValue.push(currentSubData[n].name)
  }
  // 初始化是所选中行第二个下拉框可选的值
  accountingData.optionVal[index] = currentSubValue
}
export function changeSub(idx, value, accountingData) {
  const selectedSubData = accountingData.optionVal[idx]
  let subIndex = ''
  // 获取当前change的下拉框的下标
  for (let i = 0; i < selectedSubData.length; i++) {
    if (selectedSubData[i] === value) {
      subIndex = i
      break
    }
  }
  const selectedId = accountingData.fuzuData[idx].id
  const obj = {}
  obj[selectedId] = accountingData.subData[idx][subIndex] ? accountingData.subData[idx][subIndex].code : ''
  accountingData.submitData[idx] = obj
}

export function isAssist(acct) {
  let flag = false
  if (acct) {
    let acctArray = ''
    if (typeof (acct) === 'object') {
      acctArray = acct.account.split(' ')
    } else {
      acctArray = acct.split(' ')
    }
    if (acctArray.length > 2 && acctArray[acctArray.length - 1] === '辅') {
      flag = true
    }
  }
  return flag
}
