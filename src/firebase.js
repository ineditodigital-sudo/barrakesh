import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBtdiKDgPosdYPL_aPbV7ftjPUMGECFBa8",
    authDomain: "barrakesh-nuevo.firebaseapp.com",
    databaseURL: "https://barrakesh-nuevo-default-rtdb.firebaseio.com",
    projectId: "barrakesh-nuevo",
    storageBucket: "barrakesh-nuevo.firebasestorage.app",
    messagingSenderId: "332015145873",
    appId: "1:332015145873:web:26f4ce1e7b078cb16c0030"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, auth, database, storage };
