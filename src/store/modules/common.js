/*
*  公共
* */
const common = {
  state: {
    // 底部 合计
    amountList: {
      amountCountTitle: '',  // 只有->查看数据 显示
      totalSpecial: 0,       // 总计 只有->查看数据 显示
      total: 0,    // 明细条数
      sum: 0,      // 金额
      tax: 0,      // 税额
      amount: 0    // 价税合计
    },
    // 科目匹配
    subject: {}
  },

  mutations: {
    // 底部总计
    SET_AMOUNT_LIST: (state, amountList) => {
      state.amountList = amountList
    },
    // 科目匹配
    SET_SUBJECT: (state, subject) => {
      state.subject = subject
    }
  },

  actions: {
    // 获取底部总计
    GetAmountList ({commit, state}, amountList) {
      if (amountList) {
        commit('SET_AMOUNT_LIST', amountList)
      } else {
        commit('SET_AMOUNT_LIST', state.amountList)
      }
    },
    // 科目匹配
    GetSubject ({commit, state}, subject) {
      commit('SET_SUBJECT', subject)
    }
  }
}

export default common
