import api from '@/api'

export default {
  state: {
    userInfo: {}
  },
  actions: {
    async getUser ({ commit }, params) {
      try {
          const data = await api.getUserInfo(params)
          commit('setUserInfo', data)
      } catch (error) {
          handleError(error)
      }
    }
  },
  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data
    }
  }
}
