import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyCTzF8Mga3K3AG6UCM8LsMwx8ow3UpqFh8",
  authDomain: "bot-email-generator.firebaseapp.com",
  projectId: "bot-email-generator",
  storageBucket: "bot-email-generator.firebasestorage.app",
  messagingSenderId: "292310814017",
  appId: "1:292310814017:web:a8e4f85cad7f44b5dd25c0",
  measurementId: "G-X386PS8WP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)