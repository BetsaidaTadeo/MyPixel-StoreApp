import { defineBoot } from '#q-app'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD5oCFLAKGodzk195x9jj23642p-IeWUUQ',
  authDomain: 'my-pixel-891e1.firebaseapp.com',
  projectId: 'my-pixel-891e1',
  storageBucket: 'my-pixel-891e1.firebasestorage.app',
  messagingSenderId: '1094148770425',
  appId: '1:1094148770425:web:c88880631853d3841f22a8',
  measurementId: 'G-NDLVWVS550',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default defineBoot(() => {})

export { db }
