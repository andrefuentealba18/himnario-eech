const fs = require('fs');
const path = require('path');

const contexts = [
  { file: 'hymns-context.tsx', col: 'hymns', addMethod: 'addHymn', nameField: 'title' },
  { file: 'praises-context.tsx', col: 'praises', addMethod: 'addPraise', nameField: 'title' },
  { file: 'choirs-context.tsx', col: 'choirs', addMethod: 'addChoir', nameField: 'title' },
  { file: 'youth-choirs-context.tsx', col: 'youth-choirs', addMethod: 'addYouthChoir', nameField: 'title' },
  { file: 'special-occasions-context.tsx', col: 'special-occasions', addMethod: 'addSpecialOccasion', nameField: 'title' },
  { file: 'repertoires-context.tsx', col: 'repertoires', addMethod: 'addRepertoire', nameField: 'name' }
];

const basePath = path.join(__dirname, 'src/context');

for (const ctx of contexts) {
  let content = fs.readFileSync(path.join(basePath, ctx.file), 'utf8');
  
  // 1. Import useChurch
  if (!content.includes('useChurch')) {
    content = content.replace(/(import .* from '@\/firebase';)/, "$1\nimport { useChurch } from '@/context/church-context';");
  }

  // 2. Add currentChurch to Provider
  content = content.replace(/(const firestore = useFirestore\(\);)/, "$1\n  const { currentChurch } = useChurch();");

  // 3. Update useMemoFirebase
  content = content.replace(
    new RegExp(`collection\\(firestore, '${ctx.col}'\\)`),
    `firestore && currentChurch ? collection(firestore, 'churches', currentChurch.id, '${ctx.col}') : null`
  );
  content = content.replace(/\[firestore\]\);/g, `[firestore, currentChurch]);`);

  // 4. Update migrateData
  content = content.replace(/if \(!firestore \|\| isLoadingFromHook\) return;/, "if (!firestore || isLoadingFromHook || !currentChurch) return;");
  content = content.replace(new RegExp(`const migrationFlag = '${ctx.col}_migrated_v4';`), `const migrationFlag = \`${ctx.col}_migrated_v4_\${currentChurch.id}\`;`);
  content = content.replace(new RegExp(`doc\\(firestore, '${ctx.col}'`, 'g'), `doc(firestore, 'churches', currentChurch.id, '${ctx.col}'`);

  // 5. Update add/update/delete methods to check currentChurch
  content = content.replace(/if \(!firestore\) return( \{ success: false \})?;/g, "if (!firestore || !currentChurch) return$1;");

  fs.writeFileSync(path.join(basePath, ctx.file), content);
  console.log(`Refactored ${ctx.file}`);
}
