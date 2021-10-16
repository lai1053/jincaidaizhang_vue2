import Cookies from 'js-cookie'

export function getMainType(mainMenu) {
  return Cookies.get(mainMenu)
}

export function setMainType(mainMenu, list) {
  return Cookies.set(mainMenu, list)
}

export function removeMainType(mainMenu) {
  return Cookies.remove(mainMenu)
}
