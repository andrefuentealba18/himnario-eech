import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = {
  projectId: "studio-2357028373-46846",
  appId: "1:622069481217:web:ec29c3033f426a8f91e500",
  apiKey: "AIzaSyB3HCqxHqzZim4GRvwBS4oui8X2P5g1sZE",
  authDomain: "studio-2357028373-46846.firebaseapp.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function exportCollection(colName, tsFileName, typeName, varName) {
  console.log(`Fetching ${colName}...`);
  try {
    const snapshot = await getDocs(collection(db, colName));
    const items = snapshot.docs.map(doc => {
      const { id, createdAt, updatedAt, status, _searchIndex, ...rest } = Object.fromEntries(
        Object.entries(doc.data()).filter(([_, v]) => v !== undefined && v !== null)
      );
      return rest;
    });
    console.log(`Found ${items.length} items in ${colName}`);
    
    if (items.length > 0) {
      const tsContent = `import type { ${typeName} } from './${colName}';\n\nexport const ${varName}: Omit<${typeName}, 'id'>[] = ${JSON.stringify(items, null, 2)};\n`;
      fs.writeFileSync(`src/lib/${tsFileName}`, tsContent);
      console.log(`Wrote ${tsFileName}`);
    }
  } catch (err) {
    console.error(`Failed to fetch ${colName}`, err);
  }
}

async function run() {
  await exportCollection('praises', 'praises-initial.ts', 'Praise', 'initialPraises');
  await exportCollection('choirs', 'choirs-initial.ts', 'Choir', 'initialChoirs');
  await exportCollection('youth-choirs', 'youth-choirs-initial.ts', 'YouthChoir', 'initialYouthChoirs');
  process.exit();
}

run();
