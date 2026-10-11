"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, doc, setDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export interface Church {
  id: string;
  name: string;
  district?: string;
  creatorName?: string;
  creatorEmail?: string;
  createdAt?: any;
}

export type CreateChurchResult = {
  success: boolean;
  church?: Church;
  error?: 'ALREADY_EXISTS' | 'FAILED';
  message?: string;
};

export function normalizeChurchText(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function canonicalDistrict(district: string): string {
  if (!district) return 'Sin Distrito';
  const norm = (district || '')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, '')
    .trim();

  if (norm.includes('concepcion') || norm.includes('conecpcio') || norm.includes('concep') || norm.includes('concecion') || norm.includes('consepcion')) return 'Distrito de Concepción';
  if (norm.includes('tome')) return 'Distrito Tomé';
  if (norm.includes('angol')) return 'Distrito Angol';
  if (norm.includes('puren')) return 'Distrito Purén';
  if (norm.includes('contulmo')) return 'Distrito Contulmo';
  if (norm.includes('cabrero')) return 'Distrito Cabrero';
  if (norm.includes('nacimiento')) return 'Distrito Nacimiento';
  if (norm.includes('santiago oriente') || norm.includes('stgo oriente') || norm.includes('oriente')) return 'Distrito Santiago Oriente';
  if (norm.includes('santiago centro') || norm.includes('stgo centro') || norm.includes('centro')) return 'Distrito Santiago Centro';
  if (norm.includes('linares')) return 'Distrito Linares';
  if (norm.includes('canete')) return 'Distrito Cañete';
  if (norm.includes('carbon') || norm.includes('lota')) return 'Distrito El Carbón';
  if (norm.includes('talcahuano') || norm.includes('penuelas')) return 'Distrito Talcahuano';
  if (norm.includes('renaico')) return 'Distrito Renaico';
  if (norm.includes('temuco')) return 'Distrito Temuco';
  if (norm.includes('costa bio bio') || norm.includes('bio bio')) return 'Distrito Costa Bío Bío';

  const clean = district.replace(/^distrito\s+(de\s+)?/i, '').trim();
  const capitalized = clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  return `Distrito ${capitalized}`;
}

interface ChurchContextType {
  currentChurch: Church | null;
  setCurrentChurch: (church: Church) => void;
  availableChurches: Church[];
  createChurch: (name: string, district?: string, creatorName?: string, creatorEmail?: string) => Promise<CreateChurchResult>;
  clearChurch: () => void;
  isLoading: boolean;
}

const ChurchContext = createContext<ChurchContextType | undefined>(undefined);

export function ChurchProvider({ children }: { children: ReactNode }) {
  const [currentChurch, setCurrentChurchState] = useState<Church | null>(null);
  const [availableChurches, setAvailableChurches] = useState<Church[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    const loadChurches = async () => {
      if (!firestore) return;
      try {
        const churchesCol = collection(firestore, 'churches');
        const snapshot = await getDocs(churchesCol);
        const rawChurches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Church));
        
        // 1. Filter out spam/test churches
        const validChurches: Church[] = rawChurches.filter(c => {
          const isJanno = (c.name && c.name.toLowerCase().includes('janno')) || 
                          (c.creatorName && c.creatorName.toLowerCase().includes('janno'));
          return !isJanno;
        });

        // 2. Ensure default EECH Las Torres exists
        let eechLasTorres = validChurches.find(c => c.id === 'eech-las-torres' || c.name.toLowerCase().includes('las torres'));
        if (!eechLasTorres) {
          eechLasTorres = { id: 'eech-las-torres', name: 'EECH Las Torres', district: 'Distrito de Concepción' };
          validChurches.push(eechLasTorres);
          setDoc(doc(firestore, 'churches', 'eech-las-torres'), {
            name: 'EECH Las Torres',
            district: 'Distrito de Concepción',
            createdAt: serverTimestamp()
          }).catch(console.error);
        }
        
        // 3. Standardize all districts to canonical names (Concepción, Tomé, etc.)
        for (const c of validChurches) {
          c.district = canonicalDistrict(c.district || '');
        }

        // 4. Group and deduplicate churches with same name in same district
        const groups = new Map<string, Church[]>();
        for (const c of validChurches) {
          const key = `${normalizeChurchText(c.district || 'Sin Distrito')}___${normalizeChurchText(c.name)}`;
          const existingGroup = groups.get(key) || [];
          existingGroup.push(c);
          groups.set(key, existingGroup);
        }

        const uniqueChurches: Church[] = [];
        const savedChurchId = typeof window !== 'undefined' ? localStorage.getItem('selected_church_id') : null;

        for (const [, group] of groups.entries()) {
          // Find the best canonical church (Las Torres > currently selected > first)
          let primary = group.find(c => c.id === 'eech-las-torres');
          if (!primary && savedChurchId) {
            primary = group.find(c => c.id === savedChurchId);
          }
          if (!primary) {
            primary = group[0];
          }
          uniqueChurches.push(primary);
        }

        // Sort churches alphabetically by district then by name
        uniqueChurches.sort((a, b) => {
          const distA = (a.district || 'Sin Distrito').toLowerCase();
          const distB = (b.district || 'Sin Distrito').toLowerCase();
          const cmp = distA.localeCompare(distB);
          if (cmp !== 0) return cmp;
          return a.name.localeCompare(b.name);
        });

        setAvailableChurches(uniqueChurches);

        // Load saved church
        if (savedChurchId) {
          let saved = uniqueChurches.find(c => c.id === savedChurchId);
          if (!saved) {
            // Check if saved ID belongs to a merged duplicate group
            for (const [, group] of groups.entries()) {
              if (group.some(c => c.id === savedChurchId)) {
                saved = group.find(c => uniqueChurches.some(uc => uc.id === c.id));
                if (saved) {
                  localStorage.setItem('selected_church_id', saved.id);
                  break;
                }
              }
            }
          }
          if (saved) {
            setCurrentChurchState(saved);
          }
        }
      } catch (error) {
        console.error("Error loading churches:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChurches();
  }, [firestore]);

  const clearChurch = () => {
    localStorage.removeItem('selected_church_id');
    setCurrentChurchState(null);
  };

  const setCurrentChurch = (church: Church) => {
    localStorage.setItem('selected_church_id', church.id);
    setCurrentChurchState(church);
    // Reload to refresh all contexts cleanly with the new church scope
    window.location.reload();
  };

  const createChurch = async (
    name: string, 
    district: string = 'Sin Distrito', 
    creatorName: string = '', 
    creatorEmail: string = ''
  ): Promise<CreateChurchResult> => {
    if (!firestore) return { success: false, error: 'FAILED', message: 'No hay conexión con la base de datos' };
    
    const cleanName = name.trim();
    const cleanDistrict = canonicalDistrict(district.trim() || 'Sin Distrito');
    const normName = normalizeChurchText(cleanName);
    const normDistrict = normalizeChurchText(cleanDistrict);

    // Check if a church with the same normalized name in the same district already exists
    const existing = availableChurches.find(c => {
      const cNormName = normalizeChurchText(c.name);
      const cNormDistrict = normalizeChurchText(c.district || 'Sin Distrito');
      
      // Exact normalized match
      if (cNormName === normName && (cNormDistrict === normDistrict || !cleanDistrict || !c.district)) {
        return true;
      }
      
      // Stripped prefix match (e.g. 'eech tomé' vs 'tomé', 'distrito de concepcion' vs 'concepcion')
      const cleanCN = cNormName.replace(/^(eech|iglesia)\s+/, '');
      const cleanNN = normName.replace(/^(eech|iglesia)\s+/, '');
      const cleanCD = cNormDistrict.replace(/^distrito\s+(de\s+)?/, '');
      const cleanND = normDistrict.replace(/^distrito\s+(de\s+)?/, '');
      
      if (cleanCN === cleanNN && (cleanCD === cleanND || cleanCD.includes(cleanND) || cleanND.includes(cleanCD))) {
        return true;
      }
      
      return false;
    });

    if (existing) {
      return {
        success: false,
        error: 'ALREADY_EXISTS',
        message: `La iglesia "${existing.name}" ya está creada en el ${existing.district || 'distrito'}.`,
        church: existing
      };
    }

    const id = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
    const newChurch: Church = { id, name: cleanName, district: cleanDistrict, creatorName: creatorName.trim(), creatorEmail: creatorEmail.trim() };
    try {
      await setDoc(doc(firestore, 'churches', id), {
        name: cleanName,
        district: cleanDistrict,
        creatorName: creatorName.trim(),
        creatorEmail: creatorEmail.trim(),
        createdAt: serverTimestamp()
      });
      setAvailableChurches(prev => [...prev, newChurch]);
      return { success: true, church: newChurch };
    } catch (e) {
      console.error("Error creating church", e);
      return { success: false, error: 'FAILED', message: 'No se pudo crear la iglesia. Intenta nuevamente.' };
    }
  };

  return (
    <ChurchContext.Provider value={{ currentChurch, setCurrentChurch, availableChurches, createChurch, clearChurch, isLoading }}>
      {children}
    </ChurchContext.Provider>
  );
}

export function useChurch() {
  const context = useContext(ChurchContext);
  if (context === undefined) {
    throw new Error('useChurch must be used within a ChurchProvider');
  }
  return context;
}
