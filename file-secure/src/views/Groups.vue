<template>
  <div class="groups">
    <Nav></Nav>
    <v-container>
      <v-row class="mt-10">
        <div
            class="mx-auto"
            style="width:75%">
          <v-row class="mb-10">
            <v-col>
              <h1>Your Groups</h1>
            </v-col>
            <v-col style="text-align: right">
              <v-btn
                  class="mx-2"
                  fab
                  dark
                  color=#ff59ac
                  @click="showDialog()"
              >
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-row>
      <v-row v-for="name in this.group_names" :key="name">
        <div
            class="mx-auto mb-3"
            style="width:75%">
          <v-card class="pa-5">
            <h4>{{ name }}</h4>
          </v-card>
        </div>
      </v-row>
    </v-container>
    <v-dialog
        v-model="open"
        max-width="600"
    >
      <v-card
          class="pt-10 pb-10 mx-auto text-center"
          elevation="24"
      >
        <h1 class="mb-5">Add Group</h1>
        <v-text-field
            class="mx-auto"
            label="Group name"
            v-model="group"
            placeholder=""
            outlined
            dense
            color="#ff59ac"
            style="width: 80%"
        ></v-text-field>
        <v-btn
            elevation="2"
            color="#ff59ac"
            style="width: 50%"
            @click="createGroup()"
        >Create Group
        </v-btn>
      </v-card>
    </v-dialog>
    <v-dialog
        v-model="error"
        max-width="600"
    >
      <v-card
          class="pt-10 pb-10 mx-auto text-center"
          elevation="24"
      >
        <h1 class="mb-5">Error!</h1>
        <p>{{ errorMessage }}</p>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Nav from "../components/navbar.vue";
import firebase from 'firebase';
import db from '../firebase-init'

export default {
  name: 'Home',
  components: {
    Nav
  },

  data: () => ({
    error: false,
    errorMessage: "",
    open: false,
    group: "",
    group_names: []
  }),

  mounted() {
    this.fetchGroups();
    console.log(this.group_names);
  },

  methods: {
    showDialog() {
      this.open = true;
    },

    fetchGroups() {
      this.group_names = [];
      let user = firebase.auth().currentUser;
      db.collection("groups").where("members", "array-contains", user.email)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.group_names.push(doc.data().group_name);
            })
          })
    },

    createGroup() {
      if (this.group === "") {
        this.error = true;
        this.errorMessage = "The Group name cannot be blank!";
      } else {
        let user = firebase.auth().currentUser;

        const new_group = {
          group_name: String(this.group),
          files: [],
          members: [user.email]
        }

        db.collection("users").where("user_email", "==", user.email)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                let groups = doc.data().groups;
                groups.push(String(this.group));
                db.collection("users").doc(doc.id).update({
                  "groups": groups
                })
              });
            })
            .catch((error) => {
              alert(error);
            })

        db.collection('groups').add(new_group).then(() => {
          this.open = false;
          this.fetchGroups();
        })
      }
    }
  }
}
</script>
