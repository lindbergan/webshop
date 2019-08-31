<template>
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
      <v-btn color="primary" fab @click="openDrawer" v-if="!hideCart">
        <v-icon>shopping_cart</v-icon>
      </v-btn>
    </v-flex>
  </v-app-bar>
</template>
<script>
import Vue from "vue";
import axios from "axios";

const API =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8081"
    : "http://localhost:8081";

export default Vue.component("Header", {
  name: "Header",
  props: {
    user: { type: Object },
    cart: { type: Object },
    drawer: { type: Boolean },
    hideCart: { type: Boolean }
  },
  data: () => ({
    showProfileDialog: false
  }),
  methods: {
    onSignIn(googleUser) {
      const id_token = googleUser.getAuthResponse().id_token;
      axios
        .post(`${API}/tokensignin`, {
          token: id_token
        })
        .then(res => {
          this.$emit("update-user", res.data);
        })
        .catch(err => console.log(err));
    },
    logout() {
      const authInstance = gapi.auth2.getAuthInstance();
      authInstance.signOut().then(() => {
        authInstance.disconnect();
        this.$emit("update-user", undefined);
        document.location = "http://localhost:8080";
      });
    },
    renderGoogleSignIn() {
      gapi.signin2.render("google-signin-button", {
        onsuccess: this.onSignIn
      });
    },
    openDrawer() {
      if (this.cart.items.length > 0) {
        this.$emit("change-drawer", !this.drawer);
      } else {
        this.$emit("show-snackbar", "Cart is empty");
      }
    }
  },
  mounted() {
    this.renderGoogleSignIn();
  }
});
</script>
<style>
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
</style>