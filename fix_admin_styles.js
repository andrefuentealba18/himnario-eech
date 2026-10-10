const fs = require('fs');
const path = require('path');

// 1. Fix settings-dialog.tsx
const settingsPath = path.join(__dirname, 'src/components/settings-dialog.tsx');
if (fs.existsSync(settingsPath)) {
  let content = fs.readFileSync(settingsPath, 'utf8');

  // Make dialog smaller, less rounded, remove wild glowing orbs
  content = content.replace(
    /className="w-\[95vw\] max-w-\[380px\] rounded-\[3rem\] p-0 border border-white\/40 dark:border-white\/10 shadow-\[0_0_80px_-20px_rgba\(59,130,246,0\.3\)\] bg-white\/70 dark:bg-slate-950\/60 backdrop-blur-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-500"/,
    'className="w-[90vw] max-w-[320px] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 animate-in fade-in zoom-in-95 duration-300"'
  );

  // Remove pointer-events-none div with backgrounds
  content = content.replace(
    /<div className="absolute inset-0 pointer-events-none">[\s\S]*?<\/div>\s*<div className="p-8 sm:p-10 relative z-10">/,
    '<div className="relative z-10">'
  );

  // Simplify header
  content = content.replace(
    /<div className="relative mx-auto group">[\s\S]*?<\/div>\s*<div className="space-y-2">/,
    `<div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-slate-700 dark:text-slate-300" />
            </div>
            <div className="space-y-2">`
  );
  
  content = content.replace(
    /className="text-3xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 drop-shadow-sm"/,
    'className="text-xl font-bold text-slate-900 dark:text-white"'
  );

  content = content.replace(
    /className="text-\[10px\] font-bold tracking-\[0\.4em\] text-primary\/80 dark:text-blue-400 uppercase"/,
    'className="text-xs text-slate-500 dark:text-slate-400"'
  );

  // Simplify Input
  content = content.replace(
    /<div className="relative group">\s*<div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" \/>/,
    '<div className="relative group">'
  );
  
  content = content.replace(
    /className="relative text-center tracking-\[1\.5em\] font-black h-16 text-3xl rounded-2xl border border-white\/50 dark:border-white\/10 bg-white\/80 dark:bg-slate-900\/80 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary\/20 backdrop-blur-xl shadow-inner transition-all text-slate-800 dark:text-white"/,
    'className="text-center tracking-[1em] font-bold h-12 text-2xl rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 dark:text-white"'
  );

  // Simplify Button
  content = content.replace(
    /className="w-full rounded-\[2rem\] h-16 font-black text-sm uppercase tracking-widest bg-gradient-to-r from-blue-600 via-primary to-cyan-500 focus:ring-4 focus:ring-primary\/50 text-white hover:scale-\[1\.02\] active:scale-95 transition-all shadow-\[0_10px_40px_-10px_rgba\(59,130,246,0\.8\)\] border border-white\/20 relative overflow-hidden group"/,
    'className="w-full rounded-xl h-12 font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"'
  );
  content = content.replace(
    /<div className="absolute inset-0 bg-white\/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" \/>/,
    ''
  );

  fs.writeFileSync(settingsPath, content);
}

// 2. Fix admin-panel.tsx
const adminPath = path.join(__dirname, 'src/components/admin-panel.tsx');
if (fs.existsSync(adminPath)) {
  let content = fs.readFileSync(adminPath, 'utf8');

  // Remove aura/glowing backgrounds
  content = content.replace(
    /<div className="fixed inset-0 -z-10 pointer-events-none">[\s\S]*?<\/div>\s*<div className="w-full max-w-4xl mx-auto flex flex-col h-screen">/,
    '<div className="fixed inset-0 -z-10 pointer-events-none bg-slate-50/50 dark:bg-slate-950/50" />\n      <div className="w-full max-w-4xl mx-auto flex flex-col h-screen">'
  );

  // Simplify header
  content = content.replace(
    /className="sticky top-0 z-30 bg-background\/60 backdrop-blur-2xl pt-12 pb-4 px-4 border-b border-white\/20 dark:border-white\/10 flex flex-col items-center gap-3"/,
    'className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md pt-12 pb-4 px-6 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-2"'
  );

  content = content.replace(
    /<div className="relative p-3 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl shadow-lg ring-4 ring-primary\/10">/,
    '<div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">'
  );
  content = content.replace(
    /text-white animate-float/,
    'text-slate-700 dark:text-slate-300'
  );

  content = content.replace(
    /className="text-2xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400"/,
    'className="text-xl font-bold text-slate-900 dark:text-white"'
  );
  content = content.replace(
    /className="text-\[10px\] font-bold tracking-\[0\.2em\] text-primary\/80 uppercase"/,
    'className="text-xs text-slate-500"'
  );
  
  // Clean up admin menu items layout
  content = content.replace(
    /className="group relative flex items-center gap-4 p-5 rounded-\[2rem\] bg-white dark:bg-white\/5 border-2 border-slate-100 dark:border-white\/10 hover:border-primary\/30 hover:bg-slate-50 transition-all duration-500 shadow-sm hover:shadow-xl active:scale-95 text-left overflow-hidden"/g,
    'className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm text-left"'
  );

  content = content.replace(
    /<div className=\{cn\(\s*"absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",\s*item\.color\s*\)\} \/>/g,
    ''
  );

  content = content.replace(
    /<div className="relative z-10 p-4 rounded-\[1\.5rem\] bg-white dark:bg-slate-900 shadow-lg group-hover:scale-110 transition-transform duration-500">/g,
    '<div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">'
  );

  content = content.replace(
    /<h3 className="font-black text-xs uppercase tracking-widest text-slate-800 dark:text-slate-200">\{item\.label\}<\/h3>/g,
    '<h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.label}</h3>'
  );
  
  content = content.replace(
    /<div className="relative z-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">[\s\S]*?<\/div>/g,
    '<div><ChevronRight className="h-4 w-4 text-slate-400" /></div>'
  );

  fs.writeFileSync(adminPath, content);
}
