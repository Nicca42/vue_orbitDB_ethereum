import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0
  },
  // The only way you modify state is through a mutation
  mutations: {
    setCount(state, n) {
      state.count = n;
    }
  },
  // You only call a mutation through an action
  actions: {
    incrementCount({commit, rootState}) {
      console.log("root state: ", rootState)
      commit('setCount', rootState.count + 1)
    }
  }
});
