const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/context/church-context.tsx'), 'utf8');

// 1. Update Church Interface
content = content.replace(
  /export interface Church \{[\s\S]*?name: string;\s*createdAt\?: any;\s*\}/,
  `export interface Church {\n  id: string;\n  name: string;\n  district?: string;\n  createdAt?: any;\n}`
);

// 2. Update Context Type
content = content.replace(
  /createChurch: \(name: string\) => Promise<Church \| null>;/,
  `createChurch: (name: string, district?: string) => Promise<Church | null>;`
);

// 3. Update EECH Las Torres creation
content = content.replace(
  /name: 'EECH Las Torres',\s*createdAt: serverTimestamp\(\)\s*}\);/,
  `name: 'EECH Las Torres',\n            district: 'Distrito 1',\n            createdAt: serverTimestamp()\n          });`
);
content = content.replace(
  /eechLasTorres = { id: newId, name: 'EECH Las Torres' };/,
  `eechLasTorres = { id: newId, name: 'EECH Las Torres', district: 'Distrito 1' };`
);

// 4. Update createChurch function
content = content.replace(
  /const createChurch = async \(name: string\) => \{/,
  `const createChurch = async (name: string, district: string = 'Sin Distrito') => {`
);
content = content.replace(
  /const newChurch = \{ id, name \};/,
  `const newChurch = { id, name, district };`
);
content = content.replace(
  /await setDoc\(doc\(firestore, 'churches', id\), \{\s*name,\s*createdAt: serverTimestamp\(\)\s*\}\);/,
  `await setDoc(doc(firestore, 'churches', id), {\n        name,\n        district,\n        createdAt: serverTimestamp()\n      });`
);

fs.writeFileSync(path.join(__dirname, 'src/context/church-context.tsx'), content);
