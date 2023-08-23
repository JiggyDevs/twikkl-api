import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(String(process.env.FIREBASE_CONFIG)),
  ),
});

export default firebaseConfig;
