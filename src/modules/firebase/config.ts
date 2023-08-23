import * as admin from 'firebase-admin';
// import { FIREBASE_CONFIG } from 'src/config';
// const serviceAccount = require('./twikklServiceAccount.json');

const firebaseConfig = admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount),
});

export default firebaseConfig;
