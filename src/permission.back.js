import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import {Message} from 'element-ui'
import {getToken} from '@/utils/auth' // 验权
import { getUrlData } from '@/utils/validate'

const navs = {
  xs: 'sales',
  cg: 'purchase',
  fy: 'expense',
  zj: 'funds',
  gzb: 'payroll'
}
const whiteList = ['/login'] // 不重定向白名单
let flag = false
router.beforeEach((to, from, next) => {
  /* if (to.path === '/img') {
    next()
    const url = to.fullPath.split('?')[1]
    const imgInfo = getUrlData(url)
    sessionStorage.setItem('imgInfo', JSON.stringify(imgInfo))
  } else {} */
  NProgress.start(store.getters.currency)
  // sessionStorage.setItem('url', window.location.href)
  const hash = window.location.hash
  const urlHash = hash.slice(2, hash.length)
  if (!flag && !urlHash) {
    flag = true
    sessionStorage.removeItem('urlInfo')
    sessionStorage.removeItem('indexData')
  }
  if (sessionStorage.getItem('indexData')) {
    next()
    if (!store.getters.accountList) {
      store.dispatch('GetAccountList')
    }
    if (!store.getters.matchAccount) {
      store.dispatch('GetMatchAccountList')
    }
    if (!store.getters.currency) {
      store.dispatch('GetCurrencyList')
    }
    flag = false
  } else {
    const url = window.location.search
    if (url) {
      store.dispatch('SetUrlInfo').then(resp => { //
        switch (resp.qdtype) {
          case 'xs': // 销售sales
            next('/sales')
            break
          case 'cg': // 采购purchase
            next('/purchase')
            break
          case 'fy': // 费用expense
            next('/expense')
            break
          case 'zj': // 资金fund
            next('/fund')
            break
          case 'gzb': // 工资表salary
            next('/salary')
            break
          default:
            next('/pending')
            break
        }
      }).catch((error) => {
        NProgress.done()
        // Message.error(error)
      })
    } else {
      next()
    }
  }
  /* if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          next()
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录')
            next({ path: '/login' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  } */
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
