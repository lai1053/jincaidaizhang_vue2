/**
 * 格式化数据
 */

/**
 * 把数组格式化成字符串
 * @param list {Array} 数组
 * @desc 规则： 将数组以逗号分割整合成字符串, 用于提交后台数据封装
 * @example ['a', 'b', 'c'] => 'a,b,c,'
 */
export function evalListToString (list) {
  let str = ''
  list.map(v => {
    str += `${v},`
    //console.log(str)
  })
  return str
}
