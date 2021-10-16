import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en'  // 语言英文
import App from './App'
import router from './router'
import store from './store'

import '@/permission' // 权限
import axios from 'axios'

import 'babel-polyfill' //ES6垫片

// Vue.use(ElementUI, { locale })
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.directive('loadmore', {
  bind(el, binding) {
    const selectDom = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
    selectDom.addEventListener('scroll', function () {
      const isLoad = this.scrollHeight - this.scrollTop <= this.clientHeight
      if (isLoad) {
        binding.value()
      }
    })
  }
})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  created() {
    window.addEventListener('message', function(evt) {
      if (evt.data === '100') {
        window.closeKeepAccountsModal()
      } else if (evt.data === 'expense') {
        window.closeExpense()
      } else if (evt.data === 'fund') {
        window.closeFund()
      }
    })
  },
  components: { App }
})
