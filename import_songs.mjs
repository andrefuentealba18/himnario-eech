import fs from 'fs';
import path from 'path';

const jsonPath = '/Users/pabloandresfuentealbabello/Library/Containers/net.whatsapp.WhatsApp/Data/tmp/documents/B1ADF14A-4407-4B31-AF41-00DFE8A5880B/himnario-eech-backup-2026-04-27.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const generateFile = (fileName, typeName, interfaceFileName, arrayName, dataArray) => {
  if (!dataArray || dataArray.length === 0) return;
  const fileContent = `import type { ${typeName} } from './${interfaceFileName}';

export const ${arrayName}: Omit<${typeName}, 'id'>[] = ${JSON.stringify(dataArray, null, 2)};
`;
  fs.writeFileSync(path.join('src/lib', fileName), fileContent);
  console.log(`Successfully wrote ${dataArray.length} items to ${fileName}`);
};

try {
  generateFile('hymns-initial.ts', 'Hymn', 'hymns', 'hymns', data.hymns);
  generateFile('praises-initial.ts', 'Praise', 'praises', 'initialPraises', data.praises);
  generateFile('choirs-initial.ts', 'Choir', 'choirs', 'initialChoirs', data.choirs);
  generateFile('youth-choirs-initial.ts', 'YouthChoir', 'youth-choirs', 'initialYouthChoirs', data.youthChoirs);
} catch (error) {
  console.error("Error generating files:", error);
}
