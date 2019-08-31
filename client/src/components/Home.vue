<template>
  <v-flex>
    <v-app-bar app fixed flat class="bg-white border-light">
      <v-dialog v-if="user" v-model="showProfileDialog" width="800">
        <template v-slot:activator="{ on }">
          <v-flex xs3 class="display-flex" align-center>
            <v-btn color="primary" fab v-on="on">
              <v-icon>account_circle</v-icon>
            </v-btn>
            <v-flex ml-3>
              <h3 class="profile-name">{{ user.name }}</h3>
            </v-flex>
          </v-flex>
        </template>
        <v-card>
          <v-flex pa-3 align-center class="display-flex flex-column profile-card">
            <h1>{{ user.name }}</h1>
            <h3>{{ user.email }}</h3>
            <v-flex mt-5>
              <v-img
                max-height="240"
                max-width="240"
                src="https://image.flaticon.com/icons/png/512/149/149071.png"
              ></v-img>
            </v-flex>
            <v-flex align-end justify-center class="display-flex">
              <v-btn @click="logout" x-large color="primary">Logout</v-btn>
            </v-flex>
          </v-flex>
        </v-card>
      </v-dialog>
      <v-flex xs3 v-if="!user">
        <div id="google-signin-button"></div>
      </v-flex>
      <v-flex class="display-flex justify-center align-center">
        <span class="web-name-container">
          <h1>Webshop</h1>
        </span>
      </v-flex>
      <v-flex xs3 class="display-flex justify-end">
        <v-btn color="primary" fab @click="openDrawer">
          <v-icon>shopping_cart</v-icon>
        </v-btn>
      </v-flex>
    </v-app-bar>
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
      <v-navigation-drawer v-model="drawer" app temporary right class="cart-drawer">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <h1>Cart</h1>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list two-line subheader v-if="cart.items.length > 0">
          <v-subheader inset>Items</v-subheader>
          <v-list-item v-for="item in cart.items" :key="item.title">
            <v-list-item-avatar>
              <v-img
                src="https://rootzwiki.com/public/style_images/RootzNew/nexus/default_product.png"
              ></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ item.product.name }}</v-list-item-title>
              <v-list-item-subtitle>
                x{{ item.amount }}
                {{ getDiscountPriceIfExists(item.product) }} kr
                <span
                  v-if="item.product.discountPrice"
                  class="overcrossed"
                >{{ item.product.price}} kr</span>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="removeProduct(item.product)">
                <v-icon color="red">remove_circle_outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider inset class="cart-divier"></v-divider>
          <v-subheader inset>Total cost</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-flex class="display-flex" align-center justify-center>
                  <span class="total-cost">{{ cart.totalCost }} kr</span>
                </v-flex>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-btn block primary outlined depressed x-large>Checkout</v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
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

const API =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8081"
    : "http://localhost:8081";

export default Vue.component("Home", {
  name: "Home",
  components: {
    ProductList
  },
  data: () => ({
    products: [],
    cart: {
      items: [],
      totalCost: 0
    },
    search: "",
    showProfileDialog: false,
    user: undefined,
    drawer: null,
    timeout: 1500,
    snackbar: false,
    text: ""
  }),
  computed: {
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
    onSignIn(googleUser) {
      const id_token = googleUser.getAuthResponse().id_token;
      axios
        .post(`${API}/tokensignin`, {
          token: id_token
        })
        .then(res => {
          this.user = res.data;
        })
        .catch(err => console.log(err));
    },
    logout() {
      const authInstance = gapi.auth2.getAuthInstance();
      authInstance.signOut().then(() => {
        authInstance.disconnect();
        this.user = undefined;
        document.location = "http://localhost:8080";
      });
    },
    renderGoogleSignIn() {
      gapi.signin2.render("google-signin-button", {
        onsuccess: this.onSignIn
      });
    },
    addProduct(product) {
      let index = this.cart.items.findIndex(
        item => item.product._id === product._id
      );
      if (index !== -1) {
        this.cart.items[index].amount += 1;
      } else {
        this.cart.items.push({
          product,
          amount: 1
        });
      }
      this.cart.totalCost += this.getDiscountPriceIfExists(product);
      this.cart.totalCost = parseFloat(
        parseFloat(this.cart.totalCost).toFixed(2)
      );
      localStorage.setItem("cart", JSON.stringify(this.cart));
      this.showSnackbar("Product added to cart");
    },
    removeProduct(product) {
      let index = this.cart.items.findIndex(
        item => item.product._id === product._id
      );
      if (index !== -1 && this.cart.items[index].amount > 1) {
        this.cart.items[index].amount += 1;
      } else if (index !== -1) {
        this.cart.items = this.cart.items.filter(
          item => item.product._id !== product._id
        );
      }
      this.cart.totalCost -= this.getDiscountPriceIfExists(product);
      this.cart.totalCost = parseFloat(
        parseFloat(this.cart.totalCost).toFixed(2)
      );
      localStorage.setItem("cart", JSON.stringify(this.cart));
      this.showSnackbar("Product removed from cart");
    },
    showSnackbar(text) {
      this.text = text;
      this.snackbar = true;
    },
    getDiscountPriceIfExists(product) {
      return product.discountPrice !== undefined
        ? parseFloat(parseFloat(product.discountPrice).toFixed(2))
        : parseFloat(parseFloat(product.price).toFixed(2));
    },
    getLastCartIfExists() {
      let cart = localStorage.getItem("cart");
      if (cart) {
        this.cart = JSON.parse(cart);
        this.cart.totalCost = parseFloat(
          parseFloat(this.cart.totalCost).toFixed(2)
        );
      } else {
        this.cart = {
          items: [],
          totalCost: 0
        };
      }
    },
    openDrawer() {
      if (this.cart.items.length > 0) {
        this.drawer = !this.drawer;
      } else {
        this.showSnackbar("Cart is empty");
      }
    }
  },
  mounted() {
    this.renderGoogleSignIn();
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
.profile-card {
  min-height: 500px;
}
.web-name-container {
  background-color: #1976d2;
  color: white;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: 15px;
  font-family: "Righteous", cursive;
  letter-spacing: 5px;
}
.profile-name {
  font-family: "Roboto";
  font-size: 22px;
  font-weight: 700;
  color: #333;
  text-align: flex-start;
}
.bg-white {
  background-color: white;
}
.border-light {
  border: 1px solid #dedede !important;
}
.cart-drawer {
  top: 66px !important;
  width: 300px !important;
}
.cart-divier {
  margin-left: 0 !important;
  max-width: 100% !important;
}
.overcrossed {
  text-decoration: line-through solid rgb(68, 68, 68);
}
.total-cost {
  color: white;
  background-color: lightblue;
  border-radius: 4px;
  height: 50px;
  width: 100%;
  text-align: center;
  padding-top: 15px;
  font-weight: 700;
  font-size: 18px;
}
</style>