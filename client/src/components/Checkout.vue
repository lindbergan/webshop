<template>
  <v-flex fill-height>
    <Header hideCart :user="user" :cart="cart"></Header>
    <v-flex style="min-height: 200px;" align-center justify-center class="display-flex">
      <v-flex justify-center align-center class="display-flex" mt-5>
        <v-flex xs2>
          <v-btn to="/" x-large depressed outlined block>Back to Store</v-btn>
        </v-flex>
      </v-flex>
    </v-flex>
    <v-flex justify-center class="display-flex">
      <v-flex xs6 class="bg-white border-light" style="min-height: 300px">
        <v-flex style="min-height: 200px">
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-right">Amount</th>
                <th class="text-right">Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart.items" :key="item.name">
                <td class="text-left">{{ item.product.name }}</td>
                <td class="text-right">{{ item.amount }}</td>
                <td class="text-right">{{ item.product.price }} kr</td>
                <td class="text-right">
                  <v-btn icon>
                    <v-icon color="red">remove_circle_outline</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr>
                <td class="text-left">
                  <h2>Total</h2>
                </td>
                <td></td>
                <td class="text-right">
                  <h2>{{ cart.totalCost }} kr</h2>
                </td>
                <td></td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-flex>
        <v-flex justify-center class="display-flex" mt-5>
          <v-flex xs2>
            <v-btn x-large depressed outlined block>BUY</v-btn>
          </v-flex>
        </v-flex>
      </v-flex>
    </v-flex>
  </v-flex>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import { mapState } from "vuex";

import Header from "./Header";

const API =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8081"
    : "http://localhost:8081";

export default Vue.component("Checkout", {
  name: "Checkout",
  components: {
    Header
  },
  data: () => ({}),
  computed: {
    ...mapState(["user", "cart"])
  }
});
</script>
<style scoped>
</style>