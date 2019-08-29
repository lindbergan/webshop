<template>
  <v-flex pa-3 class="display-flex flex-wrap" v-if="!noresults">
    <v-flex xs4 sm3 lg2 pa-2 v-for="product in products" :key="product._id">
      <v-flex pa-3 class="product">
        <v-flex class="display-flex align-center">
          <h3 class="product-name">{{ product.name }}</h3>
          <v-spacer></v-spacer>
          <v-btn
            v-if="isAFavorite(product._id)"
            color="white"
            fab
            small
            @click="unFavoriteProduct(product._id)"
          >
            <v-icon color="red">favorite</v-icon>
          </v-btn>
          <v-btn v-else color="white" fab small @click="favoriteProduct(product._id)">
            <v-icon color="red">favorite_border</v-icon>
          </v-btn>
        </v-flex>
        <v-flex pa-3 mt-3>
          <v-img src="https://rootzwiki.com/public/style_images/RootzNew/nexus/default_product.png"></v-img>
        </v-flex>
        <v-flex class="display-flex align-center" mt-3>
          <span class="price-container">
            <span>{{ product.price }} kr</span>
          </span>
          <v-spacer></v-spacer>
          <v-btn color="primary" fab small>
            <v-icon>add</v-icon>
          </v-btn>
        </v-flex>
      </v-flex>
    </v-flex>
  </v-flex>
</template>
<script>
import Vue from "vue";
import axios from "axios";

const API =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8081"
    : "http://localhost:8081";

export default Vue.component("ProductList", {
  name: "ProductList",

  props: {
    products: { type: Array },
    noresults: { type: Boolean },
    user: { type: Object }
  },
  methods: {
    isAFavorite(id) {
      if (!this.user) return false;
      return this.user.favorites.includes(id);
    },
    favoriteProduct(id) {
      if (this.user && !this.user.favorites.includes(id)) {
        this.user.favorites.push(id);
      }
      this.updateFavorites();
    },
    unFavoriteProduct(id) {
      if (this.user) {
        this.user.favorites = this.user.favorites.filter(i => i !== id);
      }
    },
    updateFavorites() {
      axios.put(`${API}/users/${this.user.id}`, {
        favorites: this.user.favorites
      });
    }
  }
});
</script>
<style>
.product {
  background-color: #f5f5f5;
  border: 1px solid #dedede;
  border-radius: 7px;
}
.product-name {
  color: #5f5f5f;
  font-weight: 700;
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
}
.price-container {
  background-color: rgb(117, 180, 117);
  padding: 5px 10px;
  border-radius: 7px;
  color: white;
  font-weight: 700;
}
</style>