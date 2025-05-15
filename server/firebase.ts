import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore as _getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    const filePath = join(__dirname, '..', 'firebase-service-account.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    serviceAccount = JSON.parse(fileContent);
  }
} catch (error) {
  console.error('Error loading service account:', error);
  throw new Error(
    'Firebase service account not found. Please either:\n' +
    '1. Add firebase-service-account.json to the project root, or\n' +
    '2. Set FIREBASE_SERVICE_ACCOUNT environment variable with the service account JSON'
  );
}

const app = initializeApp({
  credential: cert(serviceAccount),
});

// Get Firestore instance with ignoreUndefinedProperties
const firestoreDb = _getFirestore(app);

export { firestoreDb as db };
export const getFirestore = () => firestoreDb;
