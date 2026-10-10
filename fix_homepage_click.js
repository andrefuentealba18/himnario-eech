const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/app/page.tsx'), 'utf8');

// Need to extract clearChurch from useChurch()
if (!content.includes('clearChurch')) {
  content = content.replace(
    /const \{ currentChurch \} = useChurch\(\);/,
    `const { currentChurch, clearChurch } = useChurch();`
  );
  
  content = content.replace(
    /onClick=\{\(\) => \{\s*localStorage\.removeItem\('selected_church_id'\);\s*window\.location\.reload\(\);\s*\}\}/,
    `onClick={() => clearChurch()}`
  );
}

fs.writeFileSync(path.join(__dirname, 'src/app/page.tsx'), content);
