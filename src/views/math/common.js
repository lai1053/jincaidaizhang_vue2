/**
 * 创建科目类
 */
export class Subject {
  constructor ({acctCodeName, ent_id, acct_catalog, acct_code, acct_name, is_matched, is_auto, dest_acct_code, dest_acct_name, acct_val, acct_list, isEdit, showIcon}) {
    this.acctCodeName = acctCodeName
    this.ent_id = ent_id
    this.acct_catalog = acct_catalog
    this.acct_code = acct_code              // 内置科目code
    this.acct_name = acct_name              // 内置科目
    this.is_matched = is_matched            // 匹配状态
    this.is_auto = is_auto                  // 是否自动
    this.dest_acct_code = dest_acct_code                  // 本账科目
    this.dest_acct_name = dest_acct_name                  // 本账科目
    this.acct_val = acct_val || evalAccountValue(dest_acct_code, dest_acct_name)                 // 本账科目
    this.acct_list = acct_list || []
    this.isEdit = isEdit
    this.showIcon = showIcon
  }
}

/**
 * 创建工厂方法
 * @param subject {Object} 数据
 * @returns {Subject}
 */
export function createSubject (obj) {
  return new Subject({
    ent_id: obj.ent_id,
    acct_catalog: obj.acct_catalog,
    acct_code: obj.acct_code,              // 内置科目code
    acct_name: obj.acct_name,              // 内置科目
    is_matched: obj.is_matched,            // 匹配状态
    is_auto: obj.is_auto,                  // 是否自动
    dest_acct_code: obj.dest_acct_code,    // 本账科目
    dest_acct_name: obj.dest_acct_name,    // 本账科目
    acct_val: evalAccountValue(obj.dest_acct_code, obj.dest_acct_name),    // 本账科目
    acct_list: obj.acct_list || [],
    isEdit: obj.isEdit,
    showIcon: obj.showIcon,
    acctCodeName: obj.acctCodeName,
  })
}

export class ParamObj {
  constructor ({ent_id, acct_catalog, acct_code, acct_name, dest_acct_code, dest_acct_name, is_matched, is_auto}) {
    this.ent_id = ent_id
    this.acct_catalog = acct_catalog
    this.acct_code = acct_code
    this.acct_name = acct_name
    this.dest_acct_code = dest_acct_code
    this.dest_acct_name = dest_acct_name
    this.is_matched = is_matched
    this.is_auto = is_auto
  }
}

export function createParamObj (rowData) {
  const acct_val =  rowData.acct_val
  const code = acct_val ? acct_val.split(' ')[0] : ''
  const name = acct_val ? acct_val.split(' ')[1] : ''
  return new ParamObj({
    ent_id: rowData.ent_id,
    acct_catalog: rowData.acct_catalog,
    acct_code: rowData.acct_code,
    acct_name: rowData.acct_name,
    acct_list: rowData.acct_list,
    dest_acct_code: code,
    dest_acct_name: name,
    is_matched: code && name ? 1 : 0,
    is_auto: rowData.is_auto
  })
}

// 排序
export function sortTit (arr) {
  var len = arr.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (parseInt(arr[j]) > parseInt(arr[j + 1])) { // 相邻元素两两对比
        const temp = arr[j + 1] // 元素交换
        arr[j + 1] = arr[j]
        arr[j] = temp
      }
    }
  }
  return arr;
}

function evalAccountValue (code, name) {
  return (code || name) ? (code + ' ' + name) : undefined
}
