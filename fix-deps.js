const fs = require('fs');
const file = 'src/firebase/provider.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('const memoized = useMemo(factory, deps);', 'const memoized = useMemo(factory, deps || []);');
fs.writeFileSync(file, content);
