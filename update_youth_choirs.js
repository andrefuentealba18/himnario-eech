const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/context/youth-choirs-context.tsx'), 'utf8');

// Stop migration for non-EECH Las Torres
content = content.replace(
  /if \(rawYouthChoirs\?\.length === 0\) \{/,
  `if (rawYouthChoirs?.length === 0) {
          // Si no es la iglesia principal, no migramos las agrupaciones (empiezan vacías)
          if (currentChurch.id !== 'eech-las-torres') {
            const migrationFlag = \`youth_choirs_migrated_v4_\${currentChurch.id}\`;
            localStorage.setItem(migrationFlag, 'true');
            return;
          }`
);

// Fix isLoaded logic so it doesn't wait forever if there's no data and no initial data
content = content.replace(
  /const isLoaded = \(!isLoadingFromHook \|\| \(rawYouthChoirs && rawYouthChoirs\.length > 0\) \|\| initialYouthChoirs\.length > 0\);/,
  `const isLoaded = (!isLoadingFromHook || (rawYouthChoirs && rawYouthChoirs.length >= 0));`
);

// Fix useMemo so it doesn't show initial data if it's empty for non-Las Torres
content = content.replace(
  /if \(!rawYouthChoirs \|\| rawYouthChoirs\.length === 0\) \{[^}]+\}/,
  `if (!rawYouthChoirs || rawYouthChoirs.length === 0) {
      if (currentChurch?.id === 'eech-las-torres') {
        return [...initialYouthChoirs].sort((a, b) => a.title.localeCompare(b.title)) as unknown as YouthChoir[];
      }
      return [];
    }`
);

fs.writeFileSync(path.join(__dirname, 'src/context/youth-choirs-context.tsx'), content);
