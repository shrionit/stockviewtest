import firebase from "firebase/app";
import "firebase/auth";
import api from "./api";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASURMENT_ID
};

firebase.initializeApp(firebaseConfig);
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');
export const auth = firebase.auth();
provider.setCustomParameters({ prompt: 'select_account' });

const handleSignIn = (id_token) => {
    var credential = firebase.auth.GoogleAuthProvider.credential(id_token);
    console.log("cred: ", credential);
    // Sign in with credential from the Google user.
    var login = firebase.auth().signInWithCredential(credential).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

export const signInWithGoogle = () => {
    auth.signInWithPopup(provider).then(function (result: any) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        api.post("user/login", { user: user.providerData[0] }).then(d => d.data).then(d => console.log(d));

    }).catch(function (error: any) {

        console.log(error);

    });
};

export default firebase;
