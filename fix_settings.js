const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/components/settings-dialog.tsx'), 'utf8');

content = content.replace(/<Button\s+variant="outline"[\s\S]*?Cambiar de Iglesia\s*<\/Button>\s*<\/div>\s*<\/div>/, '</div>');

fs.writeFileSync(path.join(__dirname, 'src/components/settings-dialog.tsx'), content);
