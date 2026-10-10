const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/app/page.tsx'), 'utf8');

const oldFooter = \`<div className="flex flex-col items-center justify-center gap-3">
                <InstallPWAButton />
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
                <SettingsDialog />
              </div>\`;

const newFooter = \`<div className="flex flex-col items-center justify-center gap-4">
                <div className="flex items-center justify-center gap-4">
                  <InstallPWAButton />
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
                </div>
                <SettingsDialog />
              </div>\`;

content = content.replace(/<div className="flex flex-col items-center justify-center gap-3">[\s\S]*?<SettingsDialog \/>\s*<\/div>/, newFooter);

fs.writeFileSync(path.join(__dirname, 'src/app/page.tsx'), content);
