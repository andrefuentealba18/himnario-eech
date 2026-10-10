const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/context/youth-choirs-context.tsx'), 'utf8');

const regex = /const youthChoirs = useMemo\(\(\) => \{[\s\S]*?return mergedYouthChoirs\.sort\(\(a, b\) => a\.title\.localeCompare\(b\.title\)\);\n  \}, \[allData\]\);/;

const newCode = `const youthChoirs = useMemo(() => {
    if (currentChurch && currentChurch.id !== 'eech-las-torres') {
      // For any other church, only return what is actually in Firestore. No defaults!
      const firestoreChoirs = allData ? allData.filter(yc => yc.status === 'approved' || !yc.status) : [];
      return firestoreChoirs.sort((a, b) => a.title.localeCompare(b.title));
    }

    // EECH Las Torres gets the hardcoded initial data merged with Firestore
    const fbYouthChoirsMap = new Map(allData?.map(yc => [yc.id, yc]) || []);
    
    const mergedYouthChoirs = initialYouthChoirs.map(initial => {
      const id = slugify(\`\${initial.group}-\${initial.title}\`);
      const fbData = fbYouthChoirsMap.get(id);
      if (fbData) {
        return { ...initial, ...fbData };
      }
      return { ...initial, id, status: 'approved' as const };
    }) as YouthChoir[];

    const initialIds = new Set(mergedYouthChoirs.map(yc => yc.id));
    if (allData) {
      allData.forEach(fbYouthChoir => {
        if (!initialIds.has(fbYouthChoir.id) && (fbYouthChoir.status === 'approved' || !fbYouthChoir.status)) {
          mergedYouthChoirs.push(fbYouthChoir);
        }
      });
    }

    return mergedYouthChoirs.sort((a, b) => a.title.localeCompare(b.title));
  }, [allData, currentChurch]);`;

content = content.replace(regex, newCode);

fs.writeFileSync(path.join(__dirname, 'src/context/youth-choirs-context.tsx'), content);
