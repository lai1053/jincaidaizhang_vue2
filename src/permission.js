import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式

router.beforeEach((to, from, next) => {
  NProgress.start(store.getters.accountList)
  if (store.getters.urlInfo.qyid) {
    next()
    if (!store.getters.accountList && to.fullPath !== '/math/index') {
      store.dispatch('GetAccountList')
    }
    if (!store.getters.subjectMatch && to.fullPath !== '/math/index') {
      store.dispatch('subjectMatch')
    }
    if (!store.getters.currency) {
      store.dispatch('GetCurrencyList')
    }
  } else {
    const url = window.location.search
    if (url) {
      store.dispatch('SetUrlInfo').then(resp => { //
        switch (resp.qdtype) {
          case 'xs': // 销售sales
            next('/sales')
            switchRoute(to)
            break
          case 'cg': // 采购purchase
            next('/purchase')
            switchRoute(to)
            break
          case 'fy': // 费用expense
            next('/expense')
            switchRoute(to)
            break
          case 'zj': // 资金fund
            next('/fund')
            switchRoute(to)
            break
          case 'gzb': // 工资表salary
            next('/salary')
            switchRoute(to)
            break
          case 'pend':
            next('/pending')
            switchRoute(to)
            break
          case 'math':
            next('/math')
            switchRoute(to)
            break
          case 'psb':
            next('/psb')
            switchRoute(to)
            break
          case 'simpleTally':
            next('/simpleTally')
            switchRoute(to)
            break
          default:
            next('/404')
            switchRoute(to)
        }
      }).catch(error => {
        NProgress.done()
        // Message.error(error)
      })
    } else {
      next()
      switchRoute(to)
    }
  }
})

function switchRoute(to){
  let allowBack = true
  if (to.meta.allowBack !== undefined){
    allowBack = to.meta.allowBack
  }

  if (!allowBack) {
    history.pushState(null, null, location.href)
  }

  // store.dispatch('updateAppSetting',{
  //   allowBack: allowBack
  // })
}

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
