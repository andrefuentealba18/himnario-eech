const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/repertoire-list-client.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /text-\[13px\] text-slate-700 dark:text-slate-200 truncate/g,
    'text-xs leading-tight text-slate-700 dark:text-slate-200 line-clamp-2'
  );

  fs.writeFileSync(filePath, content);
}
