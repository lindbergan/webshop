<template>
  <v-navigation-drawer v-model="showDrawer" app temporary right class="cart-drawer">
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
          <v-img src="https://rootzwiki.com/public/style_images/RootzNew/nexus/default_product.png"></v-img>
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
          <v-btn block primary outlined depressed x-large to="/checkout">Checkout</v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import Vue from "vue";
import { getDiscountPriceIfExists } from "../helpers/producthelpers";

export default Vue.component("CartDrawer", {
  name: "CartDrawer",
  props: {
    cart: { type: Object },
    drawer: { type: Boolean }
  },
  computed: {
    showDrawer: {
      get() {
        return this.drawer;
      },
      set(newValue) {
        this.$emit("change-drawer", newValue);
      }
    },
    cartCopy: {
      get() {
        return this.cart;
      },
      set(newValue) {
        this.$emit("update-cart", newValue);
      }
    }
  },
  methods: {
    removeProduct(product) {
      let index = this.cartCopy.items.findIndex(
        item => item.product._id === product._id
      );
      if (index !== -1 && this.cartCopy.items[index].amount > 1) {
        this.cartCopy.items[index].amount -= 1;
      } else if (index !== -1) {
        this.cartCopy.items = this.cart.items.filter(
          item => item.product._id !== product._id
        );
      }
      this.cartCopy.totalCost -= this.getDiscountPriceIfExists(product);
      this.cartCopy.totalCost = parseFloat(
        parseFloat(this.cart.totalCost).toFixed(2)
      );
      localStorage.setItem("cart", JSON.stringify(this.cartCopy));
      this.$emit("show-snackbar", "Product removed from cart");
    },
    getDiscountPriceIfExists(product) {
      return getDiscountPriceIfExists(product);
    }
  }
});
</script>
<style>
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
