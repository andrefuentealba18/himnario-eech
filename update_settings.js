const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/components/settings-dialog.tsx'), 'utf8');

if (!content.includes('useChurch')) {
  content = content.replace(/(import { Settings, ShieldCheck, Sparkles } from 'lucide-react';)/, "$1\nimport { useChurch } from '@/context/church-context';\nimport { MapPin } from 'lucide-react';");
  
  content = content.replace(/(const { toast } = useToast\(\);)/, "$1\n  const { currentChurch } = useChurch();");

  const changeChurchBtn = `
          <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-white/10 flex flex-col items-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Iglesia Actual</p>
            <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl mb-4">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{currentChurch?.name}</span>
            </div>
            <Button 
              variant="outline" 
              className="w-full rounded-xl border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-xs"
              onClick={() => {
                localStorage.removeItem('selected_church_id');
                window.location.reload();
              }}
            >
              Cambiar de Iglesia
            </Button>
          </div>
`;

  content = content.replace(/(<\/Form>)/, `$1\n${changeChurchBtn}`);
}

fs.writeFileSync(path.join(__dirname, 'src/components/settings-dialog.tsx'), content);
