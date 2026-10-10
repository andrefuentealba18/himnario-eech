const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/components/church-selector.tsx'), 'utf8');

if (!content.includes('showDelay')) {
  content = content.replace(/(import \{ useState)/, "$1, useEffect");
  
  content = content.replace(
    /(const \[newChurchName, setNewChurchName\] = useState\(''\);)/,
    `$1\n  const [showDelay, setShowDelay] = useState(false);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setShowDelay(true), 3600);\n    return () => clearTimeout(timer);\n  }, []);`
  );
  
  content = content.replace(
    /(if \(isLoading \|\| currentChurch\) return null;)/,
    `$1\n  if (!showDelay) return null; // Wait for the splash screen to finish`
  );
}

fs.writeFileSync(path.join(__dirname, 'src/components/church-selector.tsx'), content);
