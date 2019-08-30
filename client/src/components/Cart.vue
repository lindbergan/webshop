<template></template>
<script>
import Vue from "vue";
import axios from "axios";
import ProductList from "./ProductList";

const API =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8081"
    : "http://localhost:8081";

export default Vue.component("Cart", {
  name: "Cart",
  components: {},
  data: () => ({})
});
</script>
<style>
.display-flex {
  display: flex;
}
.flex-wrap {
  flex-wrap: wrap;
}
.flex-column {
  flex-direction: column;
}
.profile-card {
  min-height: 500px;
}
</style>