<template>
  <v-flex>
    <Header
      :user="user"
      :cart="cart"
      :drawer="drawer"
      @show-snackbar="showSnackbar($event)"
      @change-drawer="drawer = !drawer;"
      @update-user="updateUser($event)"
    ></Header>
    <v-flex class="display-flex bg-white border-light" mt-5 justify-center px-5>
      <v-flex xs12 sm8 lg4 pa-3>
        <v-text-field
          outlined
          hide-details
          v-model="search"
          placeholder="Search for a product"
          label="Search"
        ></v-text-field>
      </v-flex>
    </v-flex>
    <v-flex pa-5 mt-5 class="bg-white border-light">
      <CartDrawer
        :drawer="drawer"
        :cart="cart"
        @update-cart="cart = $event"
        @show-snackbar="showSnackbar($event)"
        @change-drawer="drawer = $event"
      ></CartDrawer>
      <ProductList
        @add-product="addProduct($event)"
        :user="user"
        :noresults="noResults"
        :products="filteredProducts"
      ></ProductList>
    </v-flex>
    <v-flex pa-3 class="display-flex align-center justify-center" v-if="noResults">
      <h1>No results...</h1>
    </v-flex>
    <v-flex pa-3 mt-5 class="display-flex flex-wrap bg-white border-light" v-if="user">
      <v-flex px-3 xs12 v-if="!noFavorites">
        <h2>
          Favorites
          <v-icon color="red">favorites</v-icon>
        </h2>
      </v-flex>
      <v-flex pa-2>
        <ProductList @add-product="addProduct($event)" :user="user" :products="favorites"></ProductList>
      </v-flex>
    </v-flex>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      <span>{{ text }}</span>
    </v-snackbar>
  </v-flex>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import ProductList from "./ProductList";
import Header from "./Header";
import CartDrawer from "./CartDrawer";
import { mapState, mapActions } from "vuex";
import { getDiscountPriceIfExists } from "../helpers/producthelpers";

const API =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8081"
    : "http://localhost:8081";

export default Vue.component("Home", {
  name: "Home",
  components: {
    ProductList,
    CartDrawer,
    Header
  },
  data: () => ({
    products: [],
    drawer: null,
    search: "",
    timeout: 1500,
    snackbar: false,
    text: ""
  }),
  computed: {
    ...mapState(["user", "cart"]),
    filteredProducts() {
      return this.products.filter(p =>
        p.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    favorites() {
      return this.products.filter(
        p => this.user && this.user.favorites.includes(p._id)
      );
    },
    noResults() {
      return this.filteredProducts.length === 0;
    },
    noFavorites() {
      return this.favorites.length === 0;
    }
  },
  methods: {
    ...mapActions(["updateCart", "updateUser"]),
    addProduct(product) {
      let cartCopy = this.cart;

      let index = cartCopy.items.findIndex(
        item => item.product._id === product._id
      );
      if (index !== -1) {
        cartCopy.items[index].amount += 1;
      } else {
        cartCopy.items.push({
          product,
          amount: 1
        });
      }
      cartCopy.totalCost += this.getDiscountPriceIfExists(product);
      cartCopy.totalCost = parseFloat(
        parseFloat(cartCopy.totalCost).toFixed(2)
      );
      localStorage.setItem("cart", JSON.stringify(cartCopy));
      this.updateCart(cartCopy);
      this.showSnackbar("Product added to cart");
    },
    showSnackbar(text) {
      this.text = text;
      this.snackbar = true;
    },
    getDiscountPriceIfExists(product) {
      return getDiscountPriceIfExists(product);
    },
    getLastCartIfExists() {
      let cart = localStorage.getItem("cart");
      if (cart) {
        cart = JSON.parse(cart);
        cart.totalCost = parseFloat(parseFloat(cart.totalCost).toFixed(2));
        this.updateCart(cart);
      } else {
        this.updateCart({
          items: [],
          totalCost: 0
        });
      }
    }
  },
  mounted() {
    axios
      .get(`${API}/products/`)
      .then(res => (this.products = res.data))
      .catch(err => console.log(err));
    this.getLastCartIfExists();
  }
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
.bg-white {
  background-color: white;
}
.border-light {
  border: 1px solid #dedede !important;
}
</style>