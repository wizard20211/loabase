// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔐 Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDmhSTiSvzs350TtnKJGlcQ7CQ2eHcWGGA",
  authDomain: "loabase-855c8.firebaseapp.com",
  projectId: "loabase-855c8",
  storageBucket: "loabase-855c8.firebasestorage.app",
  messagingSenderId: "488893290315",
  appId: "1:488893290315:web:0941281c56d8a7bcae3ace"
};

// ✅ Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// ✅ Firebase Auth 관련 추가
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const db = getFirestore(app); 
export const storage = getStorage(app);

// export
export { app, auth, provider };
