
var countDecimals = function (num) {
  var len = 0
  try {
    num = Number(num)
    var str = num.toString().toUpperCase()
    if (str.split('E').length === 2) { // scientific notation
      var isDecimal = false
      if (str.split('.').length === 2) {
        str = str.split('.')[1]
        if (parseInt(str.split('E')[0]) !== 0) {
          isDecimal = true
        }
      }
      let x = str.split('E')
      if (isDecimal) {
        len = x[0].length
      }
      len -= parseInt(x[1])
    } else if (str.split('.').length === 2) { // decimal
      if (parseInt(str.split('.')[1]) !== 0) {
        len = str.split('.')[1].length
      }
    }
    return len
  } catch (e) {
    throw e
  } finally {
    if (isNaN(len) || len < 0) {
      len = 0
    }
  }
}

var convertToInt = function (num) {
  num = Number(num)
  var newNum = num
  var times = countDecimals(num)
  var tempNum = num.toString().toUpperCase()
  if (tempNum.split('E').length === 2) {
    newNum = Math.round(num * Math.pow(10, times))
  } else {
    newNum = Number(tempNum.replace('.', ''))
  }
  return newNum
}

var getCorrectResult = function (type, num1, num2, result) {
  var tempResult = 0
  switch (type) {
    case 'add':
      tempResult = num1 + num2
      break
    case 'sub':
      tempResult = num1 - num2
      break
    case 'div':
      tempResult = num1 / num2
      break
    case 'mul':
      tempResult = num1 * num2
      break
  }
  if (Math.abs(result - tempResult) > 1) {
    return tempResult
  }
  return result
}
  // 加法
export const accAdd = function (num1, num2) {
  num1 = Number(num1)
  num2 = Number(num2)
  var dec1, dec2, times
  try { dec1 = countDecimals(num1) + 1 } catch (e) { dec1 = 0 }
  try { dec2 = countDecimals(num2) + 1 } catch (e) { dec2 = 0 }
  times = Math.pow(10, Math.max(dec1, dec2))
  var result = (accMul(num1, times) + accMul(num2, times)) / times
  return getCorrectResult('add', num1, num2, result)
}

  // 减法
export const accSub = function (num1, num2) {
  num1 = Number(num1)
  num2 = Number(num2)
  var dec1, dec2, times
  try { dec1 = countDecimals(num1) + 1 } catch (e) { dec1 = 0 }
  try { dec2 = countDecimals(num2) + 1 } catch (e) { dec2 = 0 }
  times = Math.pow(10, Math.max(dec1, dec2))
  var result = Number((accMul(num1, times) - accMul(num2, times)) / times)
  return getCorrectResult('sub', num1, num2, result)
}

  // 除法
export const accDiv = function (num1, num2) {
  num1 = Number(num1)
  num2 = Number(num2)
  var t1 = 0
  var t2 = 0
  try { t1 = countDecimals(num1) } catch (e) { }
  try { t2 = countDecimals(num2) } catch (e) { }
  var dec1 = convertToInt(num1)
  var dec2 = convertToInt(num2)
  var result = accMul((dec1 / dec2), Math.pow(10, t2 - t1))
  return getCorrectResult('div', num1, num2, result)
}

  // 乘法
export const accMul = function (num1, num2) {
  num1 = Number(num1)
  num2 = Number(num2)
  var times = 0
  var s1 = num1.toString()
  var s2 = num2.toString()
  try { times += countDecimals(s1) } catch (e) { }
  try { times += countDecimals(s2) } catch (e) { }
  var result = convertToInt(s1) * convertToInt(s2) / Math.pow(10, times)
  return getCorrectResult('mul', num1, num2, result)
}
