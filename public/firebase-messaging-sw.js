importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

firebase.initializeApp({
        apiKey: "AIzaSyCWJA-YL4wQ4RV3IjB6rZbL8cmuMeMv_l8",
        authDomain: "capstone-c9fe1.firebaseapp.com",
        databaseURL: "https://capstone-c9fe1.firebaseio.com",
        projectId: "capstone-c9fe1.firebaseapp.com",
        storageBucket: "testme",
        messagingSenderId: "416055207936"
});



const messaging = firebase.messaging();
