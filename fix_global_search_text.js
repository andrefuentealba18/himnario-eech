const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/global-search.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /text-\[13px\] text-slate-700 dark:text-slate-200 truncate/g,
    'text-xs leading-tight text-slate-700 dark:text-slate-200 line-clamp-2'
  );
  
  content = content.replace(
    /w-7 text-center text-xs/g,
    'w-6 text-center text-[10px]'
  );

  fs.writeFileSync(filePath, content);
}
