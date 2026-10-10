const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/components/church-selector.tsx'), 'utf8');

// 1. Add state for district
content = content.replace(
  /const \[newChurchName, setNewChurchName\] = useState\(''\);/,
  `const [newChurchName, setNewChurchName] = useState('');\n  const [newChurchDistrict, setNewChurchDistrict] = useState('');`
);

// 2. Update handleCreate
content = content.replace(
  /const created = await createChurch\(newChurchName\.trim\(\)\);/,
  `const created = await createChurch(newChurchName.trim(), newChurchDistrict.trim() || 'Sin Distrito');`
);
content = content.replace(
  /disabled=\{\!newChurchName\.trim\(\)\}/,
  `disabled={!newChurchName.trim() || !newChurchDistrict.trim()}`
);
content = content.replace(
  /setNewChurchName\(''\); \}\}/,
  `setNewChurchName(''); setNewChurchDistrict(''); }}`
);

// 3. Update grouping in the list
const groupingLogic = `
  const groupedChurches = filteredChurches.reduce((acc, church) => {
    const dist = church.district || 'Sin Distrito';
    if (!acc[dist]) acc[dist] = [];
    acc[dist].push(church);
    return acc;
  }, {} as Record<string, typeof availableChurches>);

  const sortedDistricts = Object.keys(groupedChurches).sort();
`;
content = content.replace(
  /const filteredChurches = availableChurches\.filter.*?;\n/,
  `const filteredChurches = availableChurches.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));\n${groupingLogic}`
);

const listRendering = `{sortedDistricts.map(district => (
                  <div key={district} className="space-y-2 mb-4">
                    <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2">
                      {district}
                    </h3>
                    {groupedChurches[district].map(church => (
                      <Button 
                        key={church.id} 
                        variant="outline" 
                        className="w-full justify-start h-14 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all font-bold text-left whitespace-normal h-auto py-3"
                        onClick={() => setCurrentChurch(church)}
                      >
                        <MapPin className="mr-3 h-5 w-5 text-slate-400 shrink-0" />
                        <span>{church.name}</span>
                      </Button>
                    ))}
                  </div>
                ))}`;

content = content.replace(
  /\{filteredChurches\.map\(church => \([\s\S]*?\)\)\}/,
  listRendering
);

// 4. Update the Creation form
const createForm = `<div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Distrito al que pertenece</label>
                <Input 
                  placeholder="Ej: Distrito 1" 
                  value={newChurchDistrict}
                  onChange={(e) => setNewChurchDistrict(e.target.value)}
                  className="bg-black/5 dark:bg-white/5 border-none h-14 rounded-xl font-bold text-lg"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nombre de la nueva iglesia</label>
                <Input 
                  placeholder="Ej: EECH Mi Ciudad" 
                  value={newChurchName}
                  onChange={(e) => setNewChurchName(e.target.value)}
                  className="bg-black/5 dark:bg-white/5 border-none h-14 rounded-xl font-bold text-lg"
                />
              </div>
            </div>`;

content = content.replace(
  /<div className="space-y-4 py-4">[\s\S]*?<\/div>\s*<\/div>/,
  createForm
);

fs.writeFileSync(path.join(__dirname, 'src/components/church-selector.tsx'), content);
