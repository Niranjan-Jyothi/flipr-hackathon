import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyDqxfTwPB2EfKreNgJ7eaF4lbCgFE5M3gw",
        authDomain: "hackathon-project-niranjan.firebaseapp.com",
        databaseURL: "https://hackathon-project-niranjan.firebaseio.com",
        projectId: "hackathon-project-niranjan",
        storageBucket: "hackathon-project-niranjan.appspot.com",
        messagingSenderId: "725448769543",
        appId: "1:725448769543:web:ba07724865c343f38f2aa2",
        measurementId: "G-FDDLBFTGM0"

});

// const db = firebase.firestore();
const auth = firebase.auth();

export {auth};