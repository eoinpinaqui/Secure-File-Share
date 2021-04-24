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
              <h1>{{ group_name }}</h1>
            </v-col>
            <v-col style="text-align: right">
              <v-btn
                  class="mx-2"
                  fab
                  dark
                  color=#ff59ac
                  @click="open_file_dialog()"
              >
                <v-icon dark>
                  mdi-cloud-upload
                </v-icon>
              </v-btn>
              <v-btn
                  class="mx-2"
                  fab
                  dark
                  color=#ff59ac
                  @click="open_members_dialog()"
              >
                <v-icon dark>
                  mdi-account-plus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-row>
      <v-row>
        <div class="mx-auto mb-3"
             style="width:75%">
          <h3>
            <v-btn
                elevation="2"
                color="#ff59ac"
                class="mr-10"
                style="width: 100px"
                @click="moveBack()"
            >Back
            </v-btn>
            {{ path_to_display }}
          </h3>
        </div>
      </v-row>
      <v-row v-for="_folder in this.folders" :key="_folder">
        <div
            class="mx-auto mb-3"
            style="width:75%">
          <v-card class="grey--text pt-4 pb-1" @click="goToFolder(_folder)" style="width:80%">
            <p>
              <v-icon class="mx-3">
                mdi-folder
              </v-icon>
              {{ _folder }}
            </p>
          </v-card>
        </div>
      </v-row>
      <v-row v-for="_file in this.files" :key="_file">
        <div
            class="mx-auto mb-3"
            style="width:75%; display: flex">
          <v-card class="grey--text pt-4 pb-1" @click="download(_file)" style="width:80%">
            <p>
              <v-icon class="mx-3">
                mdi-file
              </v-icon>
              {{ _file }}
            </p>
          </v-card>
          <v-icon class="mx-3" @click="delete_file(_file)">
            mdi-delete
          </v-icon>
        </div>
      </v-row>
    </v-container>
    <v-dialog
        v-model="file_dialog"
        max-width="600"
    >
      <v-card
          class="pt-10 pb-10 mx-auto text-center"
          elevation="24"
      >
        <v-container>
          <h1 class="mb-5">Upload File</h1>
          <v-file-input
              v-model="myFile"
              outlined
              placeholder="Click to upload file"
              :disabled="processing"
          >
            <template v-slot:append-outer>
              <v-progress-circular
                  v-if="processing"
                  color="grey"
                  indeterminate
                  small
              />
            </template>
          </v-file-input>
          <v-btn
              elevation="2"
              color="#ff59ac"
              style="width: 50%"
              @click="upload()"
          >upload
          </v-btn>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog
        v-model="members_dialog"
        max-width="600"
    >
      <v-card
          class="pt-10 pb-10 mx-auto text-center"
          elevation="24"
      >
        <v-container>
          <h1 class="mb-5">Members</h1>
          <v-container style="display: flex; align-items: stretch">
            <v-text-field
                placeholder="Add new member"
                filled
                v-model="newMember"
            ></v-text-field>
            <v-btn
                class="mx-5"
                fab
                dark
                color=#ff59ac
                @click="addUser()"
            >
              <h1 style="font-weight: 400">+</h1>
            </v-btn>
          </v-container>
          <div v-for="_member in this.members" :key="_member">
            <div
                class="mx-auto mb-3"
                style="width:75%; display: flex">
              <v-card class="pt-4 pb-1 text-left" style="width:80%">
                <p>
                  {{ _member }}
                </p>
              </v-card>
              <v-icon v-if="currentUser !== _member" class="mx-3" @click="deleteUser(_member)">
                mdi-account-remove
              </v-icon>
            </div>
          </div>
        </v-container>
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
import db from '../firebase-init';
import firebase from "firebase";
import {Crypt} from "hybrid-crypto-js";
import fileDownload from "js-file-download";
import CryptoJS from "crypto-js";

export default {
  name: 'Group',
  components: {
    Nav
  },
  data: () => ({
    group_id: "",
    group_name: "",
    file_dialog: false,
    processing: false,
    myFile: null,
    error: false,
    errorMessage: "",
    folders: [],
    files: [],
    current_path: "",
    path_to_display: "",
    members_dialog: false,
    members: [],
    currentUser: "",
    newMember: ""
  }),

  created() {
    this.group_id = this.$route.params.group_id;
    db.collection("groups").doc(this.group_id).get().then((doc) => {
      if (doc.exists) {
        let data = doc.data();
        if (!data.members.includes(firebase.auth().currentUser.email)) {
          this.$router.push("/403");
        } else {
          this.group_name = data.group_name;
          this.current_path = this.group_id;
          this.members = data.members;
          this.path_to_display = "/";
          this.currentUser = firebase.auth().currentUser.email;
          this.fetchFiles(this.current_path);
        }
      } else {
        this.$router.push("*");
      }
    })
  },
  methods: {
    open_file_dialog() {
      this.file_dialog = true;
    },

    open_members_dialog() {
      this.members_dialog = true;
    },

    fetchFiles(path) {
      this.files = [];
      this.folders = [];
      firebase.storage().ref().child(path).listAll().then((res) => {
        res.prefixes.forEach((folderRef) => {
          this.folders.push(folderRef.name);
        });
        res.items.forEach((itemRef) => {
          this.files.push(itemRef.name);
        });
      }).catch(error => {
        this.error = true;
        this.errorMessage = error.message;
      });
    },

    addUser() {
      // Get the current user
      let user = firebase.auth().currentUser;
      let found = false;
      db.collection("users").where("user_email", "==", this.newMember)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((newUser) => {
                  found = true;
                  db.collection("users").where("user_email", "==", user.email).get().then(
                      (querySnapshot1) => {
                        querySnapshot1.forEach((doc) => {
                          let data = doc.data();
                          // Extract the users private key
                          let privateKey = data.private_key;
                          let password = sessionStorage.getItem("password");

                          // Decrypt the users private key using their password
                          let bytes = CryptoJS.AES.decrypt(privateKey, password);
                          let users_private_key = bytes.toString(CryptoJS.enc.Utf8);
                          let groupPrivateKey = data[this.group_id];

                          // Decrypt the groups private key using the users private key and rencrypt it using the new users
                          // public key
                          const crypt = new Crypt();
                          let unencryptedKey = crypt.decrypt(users_private_key, groupPrivateKey);
                          let decryptedKey = crypt.encrypt(newUser.data().public_key, unencryptedKey.message);

                          // Add the encrypted group private key to the new users document
                          db.collection("users").doc(newUser.id).update({
                            [this.group_id]: String(decryptedKey),
                          })
                        });
                      })
                  if (!found) {
                    this.error = true;
                    this.errorMessage = "A user with this email does not exist.";
                  } else {
                    db.collection("groups").doc(this.group_id).get().then((doc) => {
                      let data = doc.data();
                      if (!data.members.includes(this.newMember)) {
                        let oldMembers = data.members;
                        oldMembers.push(this.newMember);
                        db.collection("groups").doc(this.group_id).set({
                          members: oldMembers
                        }, {merge: true});
                        this.members = oldMembers;
                      } else {
                        this.error = true;
                        this.errorMessage = "This user is in the group already!";
                      }
                    })
                  }
                }
            )
          })
          .catch((error) => {
            this.error = true;
            this.errorMessage = error.message;
          });
    },

    deleteUser(member) {
      db.collection("users").where("user_email", "==", member)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // Delete the groups private key from the users document
              doc.ref.update({
                [this.group_id]: firebase.firestore.FieldValue.delete()
              })
            })
          })
      db.collection("groups").doc(this.group_id).get().then((doc) => {
        // Remove the user from the groups document
        if (doc.exists) {
          let data = doc.data();
          let filtered = data.members.filter(function (value) {
            return value !== member;
          });
          db.collection("groups").doc(this.group_id).set({
            group_name: this.group_name,
            members: filtered
          }, {merge: true});
          this.members = filtered;
        }
      }).catch(error => {
        this.error = true;
        this.errorMessage = error.message;
      });
    },

    goToFolder(folder) {
      if (this.path_to_display === "/") {
        this.path_to_display = this.path_to_display + folder;
      } else {
        this.path_to_display = this.path_to_display + "/" + folder;
      }
      this.current_path = this.group_id + this.path_to_display;
      this.fetchFiles(this.current_path);
    },

    moveBack() {
      if (this.path_to_display === "/") {
        this.$router.push("/groups");
      } else {
        let idx = this.path_to_display.lastIndexOf("/");
        this.path_to_display = this.path_to_display.substr(0, idx);
        if (this.path_to_display === "") {
          this.path_to_display = "/";
        }
        this.current_path = this.group_id + "/" + this.path_to_display;
        this.fetchFiles(this.current_path);
      }
    },

    upload() {
      let user = firebase.auth().currentUser;
      if (this.myFile && this.myFile.name) {
        this.processing = true;
        db.collection("groups").doc(this.group_id).get().then((doc) => {
          let data = doc.data();
          let public_key = data.public_key;
          db.collection("users").where("user_email", "==", user.email)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  // Get the current users encrypted private key
                  let data = doc.data();
                  let privateKey = data.private_key;

                  // Decrypt the users private key using their password
                  let password = sessionStorage.getItem("password");
                  let bytes = CryptoJS.AES.decrypt(privateKey, password);
                  let users_private_key = bytes.toString(CryptoJS.enc.Utf8);

                  // Decrypt the group private key and use it to sign the encryption of the file
                  let groupPrivateKey = data[this.group_id];
                  const crypt = new Crypt();
                  let unencryptedKey = crypt.decrypt(users_private_key, groupPrivateKey);
                  const filePath = `${this.current_path}/${this.myFile.name}`;
                  const fr = new FileReader();

                  // Encrypt the file with a signature and upload it
                  fr.onload = function (event) {
                    let contents = event.target.result;
                    const crypt = new Crypt();
                    let signature = crypt.signature(unencryptedKey.message, contents);
                    let encrypted = crypt.encrypt(public_key, contents, signature);
                    console.log(encrypted);
                    firebase.storage().ref()
                        .child(filePath)
                        .putString(String(encrypted)).then(() => {
                    });
                  }
                  fr.readAsDataURL(this.myFile);
                  setTimeout(this.fetch, 3000);
                })
              })
        })
      }
    },

    fetch() {
      this.processing = false;
      this.fetchFiles(this.current_path);
    },

    delete_file(file) {
      firebase.storage().ref().child((this.current_path + "/" + file)).delete()
          .then(() => {
            this.fetchFiles(this.current_path);
          })
          .catch((error) => {
            this.error = true;
            this.errorMessage = error.message;
          });
    },

    download(file) {
      let user = firebase.auth().currentUser;
      let public_key = "";
      db.collection("groups").doc(this.group_id).get().then((doc) => {
        let data = doc.data();
        public_key = data.public_key;
      })
      db.collection("users").where("user_email", "==", user.email)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // Get the users private key
              let data = doc.data();
              let privateKey = data.private_key;

              // Decrypt the users private key using their password
              let password = sessionStorage.getItem("password");
              let bytes = CryptoJS.AES.decrypt(privateKey, password);
              let users_private_key = bytes.toString(CryptoJS.enc.Utf8);

              // Decrypt the groups private key
              let groupPrivateKey = data[this.group_id];
              const crypt = new Crypt();
              let unencryptedKey = crypt.decrypt(users_private_key, groupPrivateKey);
              firebase.storage().ref().child((this.current_path + "/" + file)).getDownloadURL()
                  .then((url) => {
                    // Download the encrypted file
                    let xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = () => {
                      let blob = xhr.response;
                      const fr = new FileReader();
                      fr.onload = function (event) {
                        // Decrypt the file
                        const text = event.target.result;
                        const crypt = new Crypt();
                        let decrypted = crypt.decrypt(unencryptedKey.message, atob(text.split(",")[1]));

                        // Verify the signature
                        let verified = crypt.verify(
                            public_key,
                            decrypted.signature,
                            decrypted.message,
                        );
                        if(!verified) {
                          alert("The signature was wrong");
                        } else {
                          let stringResponse = atob(decrypted.message.split(",")[1]);
                          fileDownload(stringResponse, file);
                        }
                      };
                      fr.readAsDataURL(blob);
                    };
                    xhr.open('GET', url);
                    xhr.send();
                  })
            })
          })
    }
  }
}
</script>
