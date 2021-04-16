<template>
  <div class="nav">
    <v-app-bar
      color=#ff59ac
      dark
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <h2 class="ml-10">File <span class="font-weight-thin">Secure</span></h2>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
    >
      <v-list
          nav
          dense
      >
        <v-list-item-group
            active-class="text--accent-4"
        >
          <v-list-item @click="changePage('/home')">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item @click="changePage('/groups')">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Groups</v-list-item-title>
          </v-list-item>

          <v-list-item @click="logout()">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Log out</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import firebase from 'firebase';
export default {
  name: 'Nav',
  data: () => ({
    drawer: false
  }),

  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
            this.$router.push('/');
      });
    },

    changePage(page) {
      this.$router.push(page);
    }
  }
}
</script>
