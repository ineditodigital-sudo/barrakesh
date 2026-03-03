import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDLDSdWuqK4BZEC1ki0PDbJbEzlnZxNDvk",
    authDomain: "barrakesh-61859.firebaseapp.com",
    databaseURL: "https://barrakesh-61859-default-rtdb.firebaseio.com",
    projectId: "barrakesh-61859",
    storageBucket: "barrakesh-61859.firebasestorage.app",
    messagingSenderId: "863847855843",
    appId: "1:863847855843:web:1e81e7136d3f01385337d6",
    measurementId: "G-Z7YTRD32KJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, analytics, auth, database, storage };
