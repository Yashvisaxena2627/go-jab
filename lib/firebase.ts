import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDQgNIjiykDq3PqPq0aIrsuffsulDLoqFs",
  authDomain: "sih2025shivansh.firebaseapp.com",
  projectId: "sih2025shivansh",
  storageBucket: "sih2025shivansh.appspot.com",
  messagingSenderId: "56524959310",
  appId: "1:56524959310:web:your_app_id_here",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app
