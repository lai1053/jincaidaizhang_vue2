import store from '@/store'

export function filterAccount (accountList, ids) {
  const indexData = store.getters.indexData
  let result = accountList
  const strArr = indexData.acct_level_length.split('-')
  const levelLength = []
  for (let i = 0; i < strArr.length; i++) {
    levelLength.push(parseInt(strArr[i]))
  }
  if (ids && ids.length) {
    const pattern = new RegExp('^(' + ids.map(function (v) {
      return '(' + formatKmdm(v, levelLength) + ')'
    }).join('|') + ')')
    result = result.filter(function (v) {
      const account = typeof (v) === 'object' ? v.account : v
      return pattern.test(account.split(' ')[0])
    })
  }
  return result
}

const chunkLens = [4, 2, 2, 2, 2]

/**
 * 格式化科目代码
 * @param string 源科目代码
 * @param levels 科目代码各层级长度，如: [4,2,2,2]
 * @returns {string} 格式
 */
export function formatKmdm (string, levels) {
  const matchDm = getMatchKmdm(string)
  // console.info('匹配到的科目编码:' + matchDm)
  if (matchDm === string) {
    let index = 0
    const chunks = []
    let chunk
    let len
    while (true) {
      len = chunkLens[chunks.length]
      chunk = string.substr(index, len)
      if (len < levels[chunks.length]) {
        chunks.push(paddingLeft(chunk, new Array(levels[chunks.length] + 1).join('0')))
      } else {
        chunks.push(chunk)
      }
      index += len
      if (chunks.length === chunkLens.length || index === string.length) {
        break
      }
    }
    return chunks.join('')
  } else {
    return matchDm
  }
}

function getMatchKmdm (dm) {
  return dm
  // console.info('原来科目编码:' + dm)
  const {matchAccount} = store.getters
  const mbkm = matchAccount
  // console.log(matchAccount)
  if (mbkm === undefined || mbkm.length === 0) {
    return dm
  }
  let ysCode = dm
  const temp = dm
  for (let i = mbkm.length - 1; i >= 0; i--) {
    if (temp.substring(0, 4) === (mbkm[i].acct_code).substring(0, 4) && temp.indexOf(mbkm[i].acct_code) !== -1) {
      // console.info('科目匹配表对应的模板科目编码:' + ysCode)
      if (mbkm[i].dest_acct_code !== '') {
        ysCode = mbkm[i].dest_acct_code
        // console.info('科目匹配表对应的科目编码:' + ysCode)
        break
      }
    }
  }
  return ysCode
}
function paddingLeft (chunk, paddingValue) {
  return String(paddingValue + chunk).slice(-paddingValue.length)
}
