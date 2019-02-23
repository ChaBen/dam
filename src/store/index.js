import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    drawer: false
  },
  getters: {
    getDrawer: state => {
      return state.drawer
    }
  },
  mutations: {
    TOGGLE_DRAWER(state) {
      state.drawer = !state.drawer
    }
  },
  actions: {
    ToggleDrawer({ commit }, isDrawer) {
      commit('TOGGLE_DRAWER', isDrawer)
    }
  }
})
