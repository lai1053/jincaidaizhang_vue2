/*
*  费用
* */
const expense = {
  state: {
    viceData: [], // 从档数据
    mainData: {}, // 主档数据
    viceMust: {}, // 从档验证
    mainMust: {}, // 主档验证
  },

  mutations: {
    // 从档
    SET_VICE_DATA: (state, viceData) => {
      state.viceData = viceData
    },
    // 主档
    SET_MAIN_DATA: (state, mainData) => {
      state.mainData = mainData
    },
    // validate 从档
    SET_MAIN_MUST: (state, mainMust) => {
      state.mainMust = mainMust
    },
    // validate 主档
    SET_VICE_MUST: (state, viceMust) => {
      state.viceMust = viceMust
    },
  },

  actions: {
    // 获取 从档数据
    GetViceData ({commit, state}, viceData) {
      if (viceData) {
        commit('SET_VICE_DATA', viceData)
      } else {
        commit('SET_VICE_DATA', state.viceData)
      }
    },
    // 获取 主档数据
    GetMainData ({commit, state}, mainData) {
      if (mainData) {
        commit('SET_MAIN_DATA', mainData)
      } else {
        commit('SET_MAIN_DATA', state.mainData)
      }
    },
    GetMainMust ({commit, state}, mainMust) {
      if (mainMust) {
        commit('SET_MAIN_MUST', mainMust)
      } else {
        commit('SET_MAIN_MUST', state.mainMust)
      }
    },
    GetViceMust ({commit, state}, viceMust) {
      if (viceMust) {
        commit('SET_VICE_MUST', viceMust)
      } else {
        commit('SET_VICE_MUST', state.viceMust)
      }
    },
  }
}

export default expense
