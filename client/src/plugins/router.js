import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home";
import Cart from "../components/Cart";

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: "/", component: Home },
    { path: "/cart", component: Cart }
  ],
});
