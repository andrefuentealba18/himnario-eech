const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/app/page.tsx'), 'utf8');

// 1. Add church name to splash screen
content = content.replace(
  /Himnario Digital EECH\s*<\/p>/,
  `Himnario Digital EECH
              </p>
              
              {currentChurch && (
                <div 
                  className="mt-6 flex justify-center items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 backdrop-blur-sm opacity-0 animate-in zoom-in-75 fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
                  style={{ animationDelay: '1800ms' }}
                >
                  <MapPin className="h-4 w-4 text-primary animate-bounce" />
                  <span className="text-[11px] font-black tracking-widest uppercase text-slate-700 dark:text-slate-200">
                    {currentChurch.name}
                  </span>
                </div>
              )}`
);

// 2. Add "Cambiar de Iglesia" button below InstallPWAButton
// It's currently: <InstallPWAButton /> \n <SettingsDialog />
content = content.replace(
  /<InstallPWAButton \/>\s*<SettingsDialog \/>/,
  `<InstallPWAButton />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-400 hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]"
                  onClick={() => {
                    localStorage.removeItem('selected_church_id');
                    window.location.reload();
                  }}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Cambiar Iglesia
                </Button>
                <SettingsDialog />`
);

fs.writeFileSync(path.join(__dirname, 'src/app/page.tsx'), content);
