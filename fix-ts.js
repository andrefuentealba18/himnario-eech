const fs = require('fs');

const replaceInFile = (file, search, replace) => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(search, replace);
  fs.writeFileSync(file, content);
};

// 1. choir-detail-client.tsx
replaceInFile('src/components/choir-detail-client.tsx', 
  `const handleDelete = useCallback(() => {`,
  `const handleDelete = useCallback(async () => {`
);

// 2. hymn-detail-client.tsx
replaceInFile('src/components/hymn-detail-client.tsx', 
  `const handleDelete = useCallback(() => {`,
  `const handleDelete = useCallback(async () => {`
);

// 3. praise-detail-client.tsx
replaceInFile('src/components/praise-detail-client.tsx', 
  `const handleDelete = useCallback(() => {`,
  `const handleDelete = useCallback(async () => {`
);

// 4. youth-choir-detail-client.tsx
replaceInFile('src/components/youth-choir-detail-client.tsx', 
  `const handleDelete = useCallback(() => {`,
  `const handleDelete = useCallback(async () => {`
);

// 5. global-search.tsx
replaceInFile('src/components/global-search.tsx', 
  `const allSongs: Song[] = useMemo(() => {`,
  `const allSongs: Song[] = useMemo(() => {`
);
replaceInFile('src/components/global-search.tsx', 
  `const base = [`,
  `const base: Song[] = [`
);

// 6. repertoire-builder-client.tsx
replaceInFile('src/components/repertoire-builder-client.tsx', 
  `name={\`\${name}.\${index}.id\`}`,
  `name={\`\${name}.\${index}.id\` as any}`
);
replaceInFile('src/components/repertoire-builder-client.tsx', 
  `value={field.value}`,
  `value={field.value as string}`
);

// 7. song-requests-list.tsx
replaceInFile('src/components/song-requests-list.tsx', 
  `result = await addYouthChoir(songData);`,
  `result = await addYouthChoir({ ...songData, group: "Coro Juventud" });`
);

// 8. ui/calendar.tsx
replaceInFile('src/components/ui/calendar.tsx', 
  `components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}`,
  `components={{
        Chevron: ({ className, orientation, ...props }: any) => {
          const Comp = orientation === 'left' ? ChevronLeft : ChevronRight;
          return <Comp className={cn("h-4 w-4", className)} {...props} />;
        }
      }}`
);

// 9. context/special-occasions-context.tsx
replaceInFile('src/context/special-occasions-context.tsx', 
  `const isLoaded = (!isLoading || (allData && allData.length > 0));`,
  `const isLoaded = Boolean(!isLoading || (allData && allData.length > 0));`
);

// 10. firebase/provider.tsx
replaceInFile('src/firebase/provider.tsx', 
  `  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;`,
  `  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;`
);

// 11. firebase/index.ts
replaceInFile('src/firebase/index.ts', 
  `tabManager: persistentSingleTabManager()`,
  `tabManager: persistentSingleTabManager({})`
);

// 12. hooks/use-toast.ts
replaceInFile('src/hooks/use-toast.ts', 
  `Number.SAFE_INTEGER`,
  `Number.MAX_SAFE_INTEGER`
);

console.log("Replacements done");
