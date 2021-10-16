'use strict'
import Vue from 'vue'

export default function treeToArray (data, expandedAll, parent = null, level = null) {
  let tmp = []
  Array.from(data).forEach(function (record) {
    if (record) {
      if (record._expanded === undefined) {
        Vue.set(record, '_expanded', expandedAll)
      }
      let _level = 1
      if (level !== undefined && level !== null) {
        _level = level + 1
      }
      Vue.set(record, '_level', _level)
      // 如果有父元素
      if (parent) {
        Vue.set(record, 'parent', parent)
      }
      tmp.push(record)
      if (record.mergeList && record.mergeList.length > 0) {
        const mergeList = treeToArray(record.mergeList, expandedAll, record, _level)
        tmp = tmp.concat(mergeList)
      }
    }
  })
  return tmp
}
