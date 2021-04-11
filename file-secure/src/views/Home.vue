<template>
  <div class="home">
    <Nav></Nav>
    <v-container>
      <div class="mx-auto mt-lg-10" style="text-align: center">
        <v-row
            class="mx-auto mt-10 mb-10"
            align="center"
            justify="center"
        >
          <h1>Welcome to</h1>
        </v-row>
        <v-row
            class="mx-auto mt-10 mb-10"
            align="center"
            justify="center"
        >
          <v-img
              lazy-src="https://static.thenounproject.com/png/1508350-200.png"
              src="https://static.thenounproject.com/png/1508350-200.png"
              max-width="10%"
          >
          </v-img>
          <h1>File <span class="font-weight-thin">Secure</span></h1>

        </v-row>
        <v-row>
          <p class="mx-auto" style="max-width: 50%">The aim of this project is provide users with a secure cloud storage
            application like Dropbox, Box, Google Drive, Office365 etc. For example, this application will secure all
            files that are uploaded to the cloud, such that only  people  that  are  part  of  your  “Secure  Cloud
            Storage Group”  will  be  able  to  decrypt uploaded files. Any member of the group is able to
            upload encrypted files to the cloud service. To all other users the files will be encrypted. This service
            uses a suitable key management system which employs public-key certificates that allows users of the system to share
            files securely, and also allows one to add or remove users from the group.</p>
        </v-row>
      </div>
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
}
</script>
