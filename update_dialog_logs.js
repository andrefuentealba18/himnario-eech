const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/components/add-song-dialog.tsx'), 'utf8');

if (!content.includes('logGlobalActivity')) {
  content = content.replace(/(import { notifyAdmin } from '@\/lib\/utils';)/, "$1\nimport { logGlobalActivity } from '@/lib/activity-logger';");
}

content = content.replace(
  /notifyAdmin\(categoryMap\[values\.category\] \|\| values\.category, values\.title\);/,
  `notifyAdmin(categoryMap[values.category] || values.category, values.title);
        logGlobalActivity(firestore, { 
          action: 'CREATE', 
          type: categoryMap[values.category] || values.category, 
          title: values.title, 
          churchId: currentChurch.id, 
          churchName: currentChurch.name, 
          userName: values.submitterName 
        });`
);

fs.writeFileSync(path.join(__dirname, 'src/components/add-song-dialog.tsx'), content);
