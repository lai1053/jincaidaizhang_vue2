import Cookies from 'js-cookie'

const expenseTip = 'expenseTip'

export function getToken () {
  return Cookies.get(expenseTip)
}

export function setToken (token) {
  return Cookies.set(expenseTip, token)
}

export function removeToken () {
  return Cookies.remove(expenseTip)
}
