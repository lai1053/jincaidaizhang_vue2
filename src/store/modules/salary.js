/*
*  工资表
* */
// import { createVice } from '@/views/salary/data/common'

import {
  getSalaryBill
} from '@/api/salary'

const salary = {
  state: {
    billData: null
  },

  mutations: {
    SET_Bill_DATA: (state, billData) => {
      state.billData = billData
    },
  },

  actions: {
    // 获取 从档数据
    GetBillData ({commit, state}, list) {
      commit('SET_Bill_DATA', list)
    },
  }
}

export default salary
