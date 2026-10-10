const fs = require('fs');
const path = require('path');

const files = [
  'hymn-detail-client.tsx',
  'praise-detail-client.tsx',
  'choir-detail-client.tsx',
  'youth-choir-detail-client.tsx',
  'special-occasion-detail-client.tsx',
  'repertoire-detail-client.tsx'
];

for (const file of files) {
  const filePath = path.join(__dirname, 'src/components', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace header padding
    content = content.replace(
      /className="sticky top-0 z-20 flex items-center justify-between bg-background\/60 backdrop-blur-xl pt-8 pb-3 px-4/g,
      'className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-xl pt-16 pb-4 px-4'
    );
    
    // Some might have slightly different classes, try generic replace for pt-8
    content = content.replace(
      /backdrop-blur-xl pt-8 pb-3/g,
      'backdrop-blur-xl pt-16 pb-4'
    );
    
    // Also, if the skeleton has pt-32, maybe change to pt-16
    content = content.replace(
      /backdrop-blur-sm pt-32 pb-6 px-4/g,
      'backdrop-blur-sm pt-16 pb-4 px-4'
    );

    fs.writeFileSync(filePath, content);
  }
}
