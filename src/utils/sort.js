// 针对费用,代用区表格排序方法
export function sortTables (tableData, e) {
  if (!e.prop) {
    return tableData
  }
  if (e.prop === 'vm_state') {
    e.prop = 'vmState'
  } else if (e.prop === 'resetAmount') {
    e.prop = 'amount'
  } else if (e.prop === 'resetTaxAmount') {
    e.prop = 'tax_amount'
  }
  if (e.column.sortable === 'letter') {
    if (e.order === 'ascending') {
      return tableData.sort(
        function compareFunction (param1, param2) {
          const a = param1[e.prop] !== null ?  param1[e.prop] : ''
          const b = param2[e.prop] !== null ? param2[e.prop] : ''
          return a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'accent'})
        }
      )
    } else {
      return tableData.sort(
        function compareFunction(param1, param2) {
          const a = param1[e.prop] !== null ?  param1[e.prop] : ''
          const b = param2[e.prop] !== null ? param2[e.prop] : ''
          return b.localeCompare(a, 'zh-Hans-CN', {sensitivity: 'accent'})
        }
      )
    }
  } else {
    if (e.order === 'ascending') {
      return tableData.sort(
        function compareFunction (param1, param2) {
          const a = param1[e.prop] !== null ?  param1[e.prop] : ''
          const b = param2[e.prop] !== null ? param2[e.prop] : ''
          return a - b
        }
      )
    } else {
      return tableData.sort(
        function compareFunction (param1, param2) {
          const a = param1[e.prop] !== null ?  param1[e.prop] : ''
          const b = param2[e.prop] !== null ? param2[e.prop] : ''
          return b - a
        }
      )
    }
  }
}
