import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDOS1xtkGkU7bCgcBG9vhsW855Tmbjw0w0",
    authDomain: "pedrofreitaas-8bc7c.firebaseapp.com",
    projectId: "pedrofreitaas-8bc7c",
    storageBucket: "pedrofreitaas-8bc7c.appspot.com",
    messagingSenderId: "767131413789",
    appId: "1:767131413789:web:21fafeef6513dcfdd0c5f4"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export {collection, addDoc, getDocs};