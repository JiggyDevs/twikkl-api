import * as admin from 'firebase-admin';
const serviceAccount = require('./twikklServiceAccount.json');

const firebaseConfig = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default firebaseConfig;
