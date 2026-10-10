const fs = require('fs');
const path = require('path');

const files = [
  'choir-list-client.tsx',
  'hymn-list-client.tsx',
  'praise-list-client.tsx',
  'special-occasion-list-client.tsx',
  'youth-choir-list-client.tsx'
];

for (const file of files) {
  const filePath = path.join(__dirname, 'src/components', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace title styles: text-[13px] -> text-xs leading-tight, remove truncate
    content = content.replace(
      /text-\[13px\] text-slate-700 dark:text-slate-200 truncate/,
      'text-xs leading-tight text-slate-700 dark:text-slate-200 line-clamp-2'
    );
    // There are some list components that might have slightly different classes, I'll use regex carefully
    content = content.replace(
      /className="font-bold text-\[13px\] text-slate-700 dark:text-slate-200 truncate/g,
      'className="font-bold text-xs leading-tight text-slate-700 dark:text-slate-200'
    );
    
    // Also change the number/index width to be slightly smaller
    content = content.replace(
      /w-7 text-center text-xs/,
      'w-6 text-center text-[10px]'
    );
    
    fs.writeFileSync(filePath, content);
  }
}
