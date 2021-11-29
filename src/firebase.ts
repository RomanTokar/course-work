import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: 'AIzaSyBIOyKbAJn3oEWohr8G6iHRKyEQcCvAHaU',
  authDomain: 'course-work-57b59.firebaseapp.com',
  projectId: 'course-work-57b59',
  storageBucket: 'course-work-57b59.appspot.com',
  messagingSenderId: '200350580927',
  appId: '1:200350580927:web:4e272d446223cf144bc60a',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const firestore = getFirestore(app)
