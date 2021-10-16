/*
*  费用
* */
const img = {
  state: {
    imgModal: {
      modal: false,
      imgList: []
    }
  },

  mutations: {
    // 从档
    SET_IMG_MODAL: (state, imgModal) => {
      state.imgModal = imgModal
    }
  },

  actions: {
    // 获取 从档数据
    setImgInfo ({commit, state}, imgModal) {
      commit('SET_IMG_MODAL', imgModal)
    }
  }
}

export default img
