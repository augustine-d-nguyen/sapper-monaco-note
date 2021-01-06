import * as firebase from 'firebase-admin';
import * as env from 'dotenv';

env.config()

if (typeof window === 'undefined' && !firebase.apps.length) {
	if (process.env.FIREBASE_CONFIG) {
		firebase.initializeApp();
	} else {
		firebase.initializeApp({
			credential: firebase.credential.cert({
				privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
				clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
				projectId: process.env.FIREBASE_ADMIN_PROJECT_ID
			})
		});
	}
}
const database = firebase.firestore();
export { database }