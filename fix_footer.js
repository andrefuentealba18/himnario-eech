const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/app/page.tsx'), 'utf8');

content = content.replace(
  /<div className="flex items-center justify-center gap-6">/,
  '<div className="flex flex-col items-center justify-center gap-3">'
);

fs.writeFileSync(path.join(__dirname, 'src/app/page.tsx'), content);
