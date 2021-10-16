// 减法
export function subtraction (arg1, arg2) {
  const arg_1 = arg1.toString()
  const arg_2 = arg2.toString()
  const num22 = arg_1.indexOf('+')
  if (arg_1.indexOf('.') != -1 && arg_2.indexOf('.') != -1) {
    let r1, r2, m, n
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    // 动态控制精度长度
    n = (r1 >= r2) ? r1 : r2
    const num = (arg1 * m - arg2 * m) / m
    return  getFloat(num, 2)
  } else {
    const num = arg1 - arg2
    return getFloat(num, 2)
  }
}

// 加法
export function addition (arg1, arg2) {
  if (arg1.toString().indexOf('.') != -1 || arg2.toString().indexOf('.') != -1) {
    let r1, r2, m
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    const num = (arg1 * m + arg2 * m) / m
    return getFloat(num, 2)
  } else {
    const num = arg1 + arg2
    return getFloat(num, 2)
  }
}

// 乘法
export function multiplication (arg1, arg2) {
  if (arg1.toString().indexOf('.') != -1 && arg2.toString().indexOf('.') != -1) {
    let m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString()
    try {
      m += s1.split('.')[1].length
    } catch (e) {}
    try {
      m += s2.split('.')[1].length
    } catch (e) {}
    const num = Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
    return getFloat(num, 2)
  } else {
    const num = arg1 * arg2
    return getFloat(num, 2)
  }
}

// 除法
export function division_method (arg1, arg2) {
  if (arg1.toString().indexOf('.') != -1 && arg2.toString().indexOf('.') != -1) {
    let t1 = 0,
      t2 = 0,
      r1, r2
    try {
      t1 = arg1.toString().split('.')[1].length
    } catch (e) {}
    try {
      t2 = arg2.toString().split('.')[1].length
    } catch (e) {}

    r1 = Number(arg1.toString().replace('.', ''))
    r2 = Number(arg2.toString().replace('.', ''))
    const num1 = r1 / r2
    const num2 = Math.pow(10, t2 - t1)
    const num3 = num1 * num2
    return getFloat(num3, 2)
  } else {
    const num = arg1 / arg2
    return getFloat(num, 2)
  }
}

// 金额转float
export function rmoney (str) {
  return parseFloat(str.replace(/[^\d\.-]/g, ''))
}

// 数字四舍五入（保留n位小数）
export function getFloat (number, n) {
  n = n ? parseInt(n) : 0
  if (n <= 0) return Math.round(number)
  const numbers = Math.round(number * Math.pow(10, n)) / Math.pow(10, n)
  return numbers
}

// 混合运算
export function parse (content) {
  let index = content.indexOf('+')
  if (index > -1) {
    return addition(parse(content.substring(0, index)), parse(content.substring(index + 1)))
  }
  index = content.lastIndexOf('-')
  if (index > -1) {
    return subtraction(parse(content.substring(0, index)), parse(content.substring(index + 1)))
  }
  index = content.lastIndexOf('/')
  if (index > -1) {
    return division_method(parse(content.substring(0, index)), parse(content.substring(index + 1)))
  }
  index = content.lastIndexOf('*')
  if (index > -1) {
    return multiplication(parse(content.substring(0, index)), parse(content.substring(index + 1)))
  }
  index = content.lastIndexOf('=')
  if (index > -1) {
    return content.substring(0, index)
  }
  if (content == '') {
    return 0
  } else {
    return getFloat(content, 2)
  }
}

