const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/components/settings-dialog.tsx'), 'utf8');

// The block I added was a div containing "Cambiar de Iglesia" below </Form>
content = content.replace(
  /<div className="mt-8 pt-6 border-t border-slate-200\/50 dark:border-white\/10 flex flex-col items-center">[\s\S]*?<\/div>/,
  ""
);

fs.writeFileSync(path.join(__dirname, 'src/components/settings-dialog.tsx'), content);
