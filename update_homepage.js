const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/app/page.tsx'), 'utf8');

if (!content.includes('useChurch')) {
  content = content.replace(/(import { useAppearance } from '@\/hooks\/use-appearance';)/, "$1\nimport { useChurch } from '@/context/church-context';");
  
  content = content.replace(
    /const \{ isLoaded: appearanceLoaded \} = useAppearance\(\);/,
    `const { isLoaded: appearanceLoaded } = useAppearance();\n  const { currentChurch } = useChurch();`
  );
  
  // Add church name below "Himnario EECH"
  content = content.replace(
    /<p className="text-sm font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase mt-4 mb-1">/,
    `{currentChurch && (
                    <div className="flex justify-center items-center gap-1.5 mb-2 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full w-max mx-auto border border-black/5 dark:border-white/5">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 dark:text-slate-300">
                        {currentChurch.name}
                      </span>
                    </div>
                  )}
                  <p className="text-sm font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase mt-4 mb-1">`
  );
  
  // Import MapPin
  content = content.replace(
    /ShieldCheck \} from 'lucide-react';/,
    `ShieldCheck, MapPin } from 'lucide-react';`
  );
}

fs.writeFileSync(path.join(__dirname, 'src/app/page.tsx'), content);
