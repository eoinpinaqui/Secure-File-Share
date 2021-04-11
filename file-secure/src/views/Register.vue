<template>
  <v-container
      fill-height
      fluid
  >
    <v-row
        align="center"
        justify="center"
    >
      <v-card
          class="mx-auto mt-10 text-center"
          elevation="24"
          max-width="600"
          min-width="300"
          style="width: 40%"
      >
        <v-container>
          <v-row
              class="mx-auto mt-10 mb-10"
              align="center"
              justify="center"
          >
            <v-img
                lazy-src="https://static.thenounproject.com/png/1508350-200.png"
                src="https://static.thenounproject.com/png/1508350-200.png"
                max-width="25%"
            >
            </v-img>
            <h1>File <span class="font-weight-thin">Secure</span></h1>
          </v-row>
        </v-container>
        <v-text-field
            class="mx-auto"
            label="email"
            v-model="email"
            placeholder=""
            outlined
            dense
            color="#ff59ac"
            style="width: 80%"
        ></v-text-field>
        <v-text-field
            class="mx-auto"
            label="password"
            v-model="password"
            placeholder=""
            outlined
            dense
            color="#ff59ac"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
            style="width: 80%"
        ></v-text-field>
        <v-text-field
            class="mx-auto"
            label="confirm password"
            v-model="confirmPassword"
            placeholder=""
            outlined
            dense
            color="#ff59ac"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
            style="width: 80%"
        ></v-text-field>
        <v-btn
            elevation="2"
            color="#ff59ac"
            style="width: 50%"
            @click="register()"
        >sign up</v-btn>
        <p class="mb-10 mt-5">Have an account? <a><router-link to="/">Log in here!</router-link></a></p>
      </v-card>
    </v-row>
    <v-dialog
        v-model="error"
        max-width="600"
    >
      <v-card
          class="pt-10 pb-10 mx-auto text-center"
          elevation="24"
      >
        <h1 class="mb-5">Error!</h1>
        <p>{{errorMessage}}</p>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from 'firebase';
import db from '../firebase-init';
import RSA from 'node-rsa';
export default {
  name: 'Register',

  data: () => ({
    show: false,
    email: "",
    password: "",
    confirmPassword: "",
    error: false,
    errorMessage: ""
  }),

  methods: {
    register() {
      if(this.password !== this.confirmPassword) {
        this.errorMessage = "The passwords you enter do not match!"
        this.error = true;
      } else {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then(user => {
            alert("Account created for " + user.user.email);
            let key = new RSA().generateKeyPair();
            const new_user = {
              user_email: user.user.email,
              groups: [],
              private_key: key.exportKey("private"),
              public_key: key.exportKey("public")
            }
            db.collection('users').add(new_user).then(() => {
              this.$router.push('/home');
            })
          },
          err => {
            this.error = true;
            this.errorMessage = err.message;
          })
      }
    }
  }
}
</script>

<style>
a {
  text-decoration: none;
  color: #ff59ac !important
}

a:hover {
  text-decoration: underline;
}
</style>