import firebase from 'firebase/app';
import "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyCWNh0c9iuALkQkisMU8BViU5zaFtt9UbA",
    authDomain: "ecommerce-fb75d.firebaseapp.com",
    projectId: "ecommerce-fb75d",
    storageBucket: "ecommerce-fb75d.appspot.com",
    messagingSenderId: "279717168953",
    appId: "1:279717168953:web:86bdfcafb1c5fad7880ae8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth();
  export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();