const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/context/church-context.tsx'), 'utf8');

if (!content.includes('clearChurch')) {
  content = content.replace(
    /createChurch: \(name: string\) => Promise<Church \| null>;/,
    `createChurch: (name: string) => Promise<Church | null>;\n  clearChurch: () => void;`
  );

  content = content.replace(
    /const setCurrentChurch = \(church: Church\) => {/,
    `const clearChurch = () => {\n    localStorage.removeItem('selected_church_id');\n    setCurrentChurchState(null);\n  };\n\n  const setCurrentChurch = (church: Church) => {`
  );

  content = content.replace(
    /value={{ currentChurch, setCurrentChurch, availableChurches, createChurch, isLoading }}/,
    `value={{ currentChurch, setCurrentChurch, availableChurches, createChurch, clearChurch, isLoading }}`
  );
}

fs.writeFileSync(path.join(__dirname, 'src/context/church-context.tsx'), content);
