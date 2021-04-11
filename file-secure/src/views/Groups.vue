<template>
  <div class="groups">
    <Nav></Nav>
    <v-container>
      <v-row class="mt-10">
        <div
            class="mx-auto"
            style="width:75%">
          <v-row>
            <v-col>
              <h1>Your Groups</h1>
            </v-col>
            <v-col style="text-align: right">
              <v-btn
                  class="mx-2"
                  fab
                  dark
                  color=#ff59ac
              >
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Nav from "../components/navbar.vue"

export default {
  name: 'Home',
  components: {
    Nav
  },

  data: () => ({

  }),


}
</script>
