import firebase from 'firebase'
import 'firebase/firestore'
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAXQ-4wcRZeWX-ky0wX2mjdibDLnCns6S8",
    authDomain: "file-55523.firebaseapp.com",
    databaseURL: "https://file-55523-default-rtdb.firebaseio.com",
    projectId: "file-55523",
    storageBucket: "file-55523.appspot.com",
    messagingSenderId: "526019096114",
    appId: "1:526019096114:web:cd3eca10e84fa06163962b"
})

export const st = firebase.storage();
export default firebaseApp.firestore();