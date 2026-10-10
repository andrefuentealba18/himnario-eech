const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/app/page.tsx'), 'utf8');

content = content.replace(
  /<p className="text-\[9px\] text-slate-500 dark:text-slate-400 font-bold tracking-\[0\.4em\] uppercase pt-1 opacity-70">\s*Ejército Evangélico de Chile\s*<\/p>/,
  `<p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold tracking-[0.4em] uppercase pt-1 opacity-70">
                Ejército Evangélico de Chile
              </p>
              
              {currentChurch && (
                <div className="flex justify-center items-center gap-1.5 mt-4 px-4 py-1.5 bg-primary/10 dark:bg-primary/20 rounded-full w-max mx-auto border border-primary/20 shadow-sm">
                  <MapPin className="h-3 w-3 text-primary animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-primary">
                    {currentChurch.name}
                  </span>
                </div>
              )}`
);

fs.writeFileSync(path.join(__dirname, 'src/app/page.tsx'), content);
