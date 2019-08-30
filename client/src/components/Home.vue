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
        <v-btn color="primary" fab>
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
      <ProductList :user="user" :noresults="noResults" :products="filteredProducts"></ProductList>
    </v-flex>
    <v-flex pa-3 class="display-flex align-center justify-center" v-if="noResults">
      <h1>No results...</h1>
    </v-flex>
    <v-flex pa-3 mt-5 class="display-flex flex-wrap bg-white border-light" v-if="user">
      <v-flex px-3 xs12 v-if="!noFavorites">
        <h2>Your favorites</h2>
      </v-flex>
      <v-flex pa-2>
        <ProductList :user="user" :products="favorites"></ProductList>
      </v-flex>
    </v-flex>
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
    search: "",
    showProfileDialog: false,
    user: undefined
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
    }
  },
  mounted() {
    this.renderGoogleSignIn();
    axios
      .get(`${API}/products/`)
      .then(res => (this.products = res.data))
      .catch(err => console.log(err));
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
  text-align: center;
  border-bottom: 3px solid #666;
}
.bg-white {
  background-color: white;
}
.border-light {
  border: 1px solid #dedede !important;
}
</style>