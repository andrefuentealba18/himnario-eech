const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/components/add-song-dialog.tsx'), 'utf8');

if (!content.includes('useChurch')) {
  content = content.replace(/(import .* from '@\/firebase';)/, "$1\nimport { useChurch } from '@/context/church-context';");
}
content = content.replace(/(const form = useForm)/, "const { currentChurch } = useChurch();\n  $1");
content = content.replace(/(const requestsCollection = collection\(firestore, 'songRequests'\);)/, "const requestsCollection = collection(firestore, 'churches', currentChurch.id, 'songRequests');");
content = content.replace(/if \(!firestore\)/, "if (!firestore || !currentChurch)");

fs.writeFileSync(path.join(__dirname, 'src/components/add-song-dialog.tsx'), content);
