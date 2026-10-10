const fs = require('fs');
const path = require('path');

const contexts = [
  { file: 'hymns-context.tsx', type: 'Himno' },
  { file: 'praises-context.tsx', type: 'Alabanza' }
];

const basePath = path.join(__dirname, 'src/context');

for (const ctx of contexts) {
  let content = fs.readFileSync(path.join(basePath, ctx.file), 'utf8');
  
  if (!content.includes('logGlobalActivity')) {
    content = content.replace(/(import .* from '@\/firebase';)/, "$1\nimport { logGlobalActivity } from '@/lib/activity-logger';");
  }

  // Find setDoc... .then(() => notifyAdmin(...))
  // and inject logGlobalActivity
  content = content.replace(
    /\.then\(\(\) => notifyAdmin\(([^,]+),\s*([^)]+)\)\)/g,
    `.then(() => {
        notifyAdmin($1, $2);
        logGlobalActivity(firestore, { action: 'CREATE', type: $1, title: $2, churchId: currentChurch.id, churchName: currentChurch.name, userName: 'Usuario' });
      })`
  );

  fs.writeFileSync(path.join(basePath, ctx.file), content);
  console.log(`Injected logs into ${ctx.file}`);
}
