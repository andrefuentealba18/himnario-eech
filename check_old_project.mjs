import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-2357028373-46846",
  appId: "1:622069481217:web:ec29c3033f426a8f91e500",
  apiKey: "AIzaSyB3HCqxHqzZim4GRvwBS4oui8X2P5g1sZE",
  authDomain: "studio-2357028373-46846.firebaseapp.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listOldOccasions() {
  console.log("Fetching special occasions from old Firestore project...");
  try {
    const snapshot = await getDocs(collection(db, 'special-occasions'));
    console.log(`Total documents found in old project: ${snapshot.size}`);
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id} | Title: "${data.title}" | Category: "${data.category}" | Status: "${data.status}"`);
    });
  } catch (err) {
    console.error("Error fetching from old project:", err);
  }
}

listOldOccasions().then(() => process.exit(0));
