const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/context/church-context.tsx'), 'utf8');

const migrationCode = `
        // One-time migration for Las Torres and Santa Elena
        for (const c of churches) {
          if ((c.name.toLowerCase().includes('las torres') || c.name.toLowerCase().includes('santa elena')) && c.district !== 'Distrito de Concepción') {
            await setDoc(doc(firestore, 'churches', c.id), { district: 'Distrito de Concepción' }, { merge: true });
            c.district = 'Distrito de Concepción';
          }
        }
        
        setAvailableChurches(churches);`;

content = content.replace(/setAvailableChurches\(churches\);/, migrationCode);

// Also update the hardcoded creation of EECH Las Torres just in case it ever gets recreated
content = content.replace(/district: 'Distrito 1'/g, "district: 'Distrito de Concepción'");

fs.writeFileSync(path.join(__dirname, 'src/context/church-context.tsx'), content);
