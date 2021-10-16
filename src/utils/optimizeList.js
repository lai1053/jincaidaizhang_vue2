
export function remoteMethod (val, codeList, options) {
  let list = []
  if (val) {
    options.isLoadMore = false
    list = codeList.filter(item => {
      if (typeof (item) === 'object') {
        return item.account.indexOf(val) > -1
      } else {
        return item.indexOf(val) > -1
      }
    })
  } else {
    options.isLoadMore = true
    list = codeList.slice(0, options.listSize)
  }
  return list
}
export function selectVisibleChange (model, codeList, options) {
  options.isLoadMore = true
  const list  = codeList.slice(0, options.listSize)
  // if (model && model !== '已确认了多个科目') {list.splice(4, 0, model)}
  return list.length > 0 ? list : ['']
}
export function loadMore (accountList, codeList, options) {
  if (!accountList) {
    return
  }
  const length = accountList.length ? accountList.length : 0
  const list =  codeList.slice(length, length + options.listSize)
  return accountList.concat(list)
}
