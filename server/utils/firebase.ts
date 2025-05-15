
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Initialize Firebase Admin SDK using either FIREBASE_SERVICE_ACCOUNT env 
 * or a firebase-service-account.json file in the project root.
 */
let serviceAccount: ServiceAccount | undefined;

try {
  // Prefer environment variable, fallback to local file for development.
  serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require('../firebase-service-account.json');
} catch (error) {
  throw new Error(
    'Firebase service account not found. Please either:\n' +
    '1. Add firebase-service-account.json to the project root, or\n' +
    '2. Set FIREBASE_SERVICE_ACCOUNT environment variable with the service account JSON'
  );
}

if (!serviceAccount) {
  throw new Error("Service account is undefined.");
}

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});

// Export Firestore instance for use in storage and other modules.
export const db = getFirestore(firebaseApp);

