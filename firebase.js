import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyCpR7QcJMWr9dO3XKAE_r9rNRUWX8gfgkM",
    authDomain: "app-mobile-fe2b6.firebaseapp.com",
    databaseURL: "https://app-mobile-fe2b6-default-rtdb.firebaseio.com",
    projectId: "app-mobile-fe2b6",
    storageBucket: "app-mobile-fe2b6.appspot.com",
    messagingSenderId: "916377789890",
    appId: "1:916377789890:web:2a532aa58955a34acca25b",
    measurementId: "G-13DGWN1Q2T"
};

let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
export { db, auth };