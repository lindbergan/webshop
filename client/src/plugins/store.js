import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    user: undefined,
    cart: {
      items: [],
      totalCost: 0,
    },
  },
  actions: {
    updateCart({ commit }, cart) {
      commit("changeCart", cart);
    },
    updateUser({ commit }, user) {
      commit("changeUser", user);
    },
  },
  mutations: {
    changeCart(state, cart) {
      state.cart = cart;
    },
    changeUser(state, user) {
      state.user = user;
    },
  },
});
