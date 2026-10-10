const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/components/admin-panel.tsx'), 'utf8');

if (!content.includes('EditChurchNameDialog')) {
  content = content.replace(/(import { ActivityLogList } from '@\/components\/activity-log-list';)/, "$1\nimport { EditChurchNameDialog } from '@/components/edit-church-name-dialog';\nimport { useChurch } from '@/context/church-context';");
  
  content = content.replace(/(const { pendingSpecialOccasions } = useSpecialOccasions\(\);)/, "$1\n  const { currentChurch } = useChurch();");

  content = content.replace(
    /(<h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest text-center relative z-10 drop-shadow-sm">[\s\S]*?Panel de Administración\s*<\/h2>)/,
    `$1\n              <div className="relative z-10 flex flex-col items-center mt-2">\n                <p className="text-sm font-bold text-slate-500 mb-1">{currentChurch?.name}</p>\n                <EditChurchNameDialog />\n              </div>`
  );
}

fs.writeFileSync(path.join(__dirname, 'src/components/admin-panel.tsx'), content);
