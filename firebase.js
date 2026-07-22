//==================================================
// Lesson Payment Management System
// Firebase Realtime Database
//==================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    update,
    remove,
    get,
    child,
    onValue
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

//==================================================
// FIREBASE CONFIG
//==================================================
const firebaseConfig = {
  apiKey: "AIzaSyAFmjUrzrcobKebkCGDriJs0UjhyAvj818",
  authDomain: "bytetech-80c89.firebaseapp.com",
  projectId: "bytetech-80c89",
  storageBucket: "bytetech-80c89.firebasestorage.app",
  messagingSenderId: "856070515143",
  appId: "1:856070515143:web:e0e109ff4366c605b051e2"
};

//==================================================
// INITIALIZE FIREBASE
//==================================================

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

//==================================================
// DATABASE REFERENCES
//==================================================

export const teachersRef = ref(db, "lessonPayment/teachers");
export const studentsRef = ref(db, "lessonPayment/students");
export const paymentsRef = ref(db, "lessonPayment/teacherPayments");

//==================================================
// EXPORT FIREBASE FUNCTIONS
//==================================================

export {
    db,
    ref,
    push,
    set,
    update,
    remove,
    get,
    child,
    onValue
};
