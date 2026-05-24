import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "himnario-eech-4a298",
  appId: "1:707970393985:web:966b98c40724b151c2ea80",
  apiKey: "AIzaSyCLaan2nNqsERWQgE1qIIfcRwqTrLIwBuc",
  authDomain: "himnario-eech-4a298.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listOccasions() {
  console.log("Fetching special occasions from Firestore...");
  try {
    const snapshot = await getDocs(collection(db, 'special-occasions'));
    console.log(`Total documents found: ${snapshot.size}`);
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id} | Title: "${data.title}" | Category: "${data.category}" | Status: "${data.status}" | HymnNumber: ${data.hymnNumber}`);
    });
  } catch (err) {
    console.error("Error fetching special occasions:", err);
  }
}

listOccasions().then(() => process.exit(0));
