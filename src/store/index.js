import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import user from './modules/user'
import info from './modules/info'
import common from './modules/common'     // 公共
import expense from './modules/expense'   // 费用
import salary from './modules/salary'     // 工资表
import img from './modules/img'     // 工资表

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    info,
    common,
    expense,
    salary,
    img
  },
  getters
})

export default store
