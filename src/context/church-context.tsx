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
        
        // 1. Delete test/spam churches like "Janno"
        const validChurches: Church[] = [];
        for (const c of rawChurches) {
          const isJanno = (c.name && c.name.toLowerCase().includes('janno')) || 
                          (c.creatorName && c.creatorName.toLowerCase().includes('janno'));
          if (isJanno) {
            try {
              await deleteDoc(doc(firestore, 'churches', c.id));
            } catch (err) {
              console.error("Error deleting test church:", err);
            }
          } else {
            validChurches.push(c);
          }
        }

        // 2. Ensure default EECH Las Torres exists
        let eechLasTorres = validChurches.find(c => c.name.toLowerCase().includes('las torres'));
        if (!eechLasTorres) {
          const newId = 'eech-las-torres';
          await setDoc(doc(firestore, 'churches', newId), {
            name: 'EECH Las Torres',
            district: 'Distrito de Concepción',
            createdAt: serverTimestamp()
          });
          eechLasTorres = { id: newId, name: 'EECH Las Torres', district: 'Distrito de Concepción' };
          validChurches.push(eechLasTorres);
        }
        
        // 3. One-time migration for Las Torres and Santa Elena to Distrito de Concepción
        for (const c of validChurches) {
          if ((c.name.toLowerCase().includes('las torres') || c.name.toLowerCase().includes('santa elena')) && c.district !== 'Distrito de Concepción') {
            await setDoc(doc(firestore, 'churches', c.id), { district: 'Distrito de Concepción' }, { merge: true });
            c.district = 'Distrito de Concepción';
          }
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
        const savedChurchId = localStorage.getItem('selected_church_id');

        for (const [, group] of groups.entries()) {
          if (group.length === 1) {
            uniqueChurches.push(group[0]);
          } else {
            // Find the best primary church (Las Torres > currently selected > first)
            let primary = group.find(c => c.id === 'eech-las-torres');
            if (!primary && savedChurchId) {
              primary = group.find(c => c.id === savedChurchId);
            }
            if (!primary) {
              primary = group[0];
            }

            uniqueChurches.push(primary);

            // Delete duplicate documents from Firestore
            for (const dup of group) {
              if (dup.id !== primary.id) {
                try {
                  await deleteDoc(doc(firestore, 'churches', dup.id));
                  if (savedChurchId === dup.id) {
                    localStorage.setItem('selected_church_id', primary.id);
                  }
                } catch (delErr) {
                  console.error("Error deleting duplicate church:", dup.id, delErr);
                }
              }
            }
          }
        }

        setAvailableChurches(uniqueChurches);

        // Load saved church
        const currentSavedId = localStorage.getItem('selected_church_id');
        if (currentSavedId) {
          const saved = uniqueChurches.find(c => c.id === currentSavedId);
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
    const cleanDistrict = district.trim() || 'Sin Distrito';
    const normName = normalizeChurchText(cleanName);
    const normDistrict = normalizeChurchText(cleanDistrict);

    // Check if a church with the same normalized name in the same district already exists
    const existing = availableChurches.find(c => {
      const cNormName = normalizeChurchText(c.name);
      const cNormDistrict = normalizeChurchText(c.district || 'Sin Distrito');
      return cNormName === normName && cNormDistrict === normDistrict;
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
