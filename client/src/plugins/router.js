import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../components/Home";
import Checkout from "../components/Checkout";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: "/", component: Home },
    { path: "/checkout", component: Checkout },
  ],
});
