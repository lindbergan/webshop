<template>
  <v-flex class="display-flex flex-wrap product-list" v-if="!noresults">
    <v-flex
      xs6
      sm4
      md3
      lg2
      xl1
      pa-2
      v-for="product in products"
      :key="product._id"
      class="display-flex"
    >
      <v-flex pa-3 class="product display-flex flex-column">
        <v-flex class="display-flex align-center">
          <v-flex>
            <h3 class="product-name">{{ product.name }}</h3>
          </v-flex>
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
        <v-flex class="display-flex align-center justify-self-end" mt-3>
          <span v-if="product.discountPrice" class="price-container-discount">
            <span>{{ product.discountPrice }} kr</span>
          </span>
          <span v-if="product.discountPrice" class="old-price">{{ product.price }} kr</span>
          <span v-else class="price-container">
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
.price-container-discount {
  background-color: #ff5252;
  padding: 5px 10px;
  border-radius: 7px;
  color: white;
  font-weight: 700;
}
.old-price {
  margin-left: 15px;
  position: relative;
}
.old-price:before {
  position: absolute;
  content: "";
  left: -10%;
  top: 45%;
  right: -10%;
  border-top: 3px solid #ff5252;
  border-color: #ff5252;
  -webkit-transform: rotate(-16deg);
  -moz-transform: rotate(-16deg);
  -ms-transform: rotate(-16deg);
  -o-transform: rotate(-16deg);
  transform: rotate(-16deg);
}
</style>