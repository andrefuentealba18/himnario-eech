const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/components/admin-panel.tsx'), 'utf8');

if (!content.includes('ActivityLogList')) {
  content = content.replace(/(import { DuplicateSongsManager }.*)/, "$1\nimport { ActivityLogList } from '@/components/activity-log-list';\nimport { Activity } from 'lucide-react';");
}

if (!content.includes("{ id: 'activity'")) {
  content = content.replace(
    /(adminMenuItems = \[)/,
    "$1\n    { \n      id: 'activity', \n      label: 'Actividad', \n      desc: 'Historial de cambios', \n      icon: Activity, \n      color: 'from-emerald-500/20 to-emerald-600/5', \n      iconColor: 'text-emerald-600' \n    },"
  );
}

if (!content.includes("tab === 'activity'")) {
  content = content.replace(
    /(\{tab === 'special' && <SpecialOccasionAdminList \/>\})/,
    "$1\n              {tab === 'activity' && <ActivityLogList />}"
  );
}

fs.writeFileSync(path.join(__dirname, 'src/components/admin-panel.tsx'), content);
