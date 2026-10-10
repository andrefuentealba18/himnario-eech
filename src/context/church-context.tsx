"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, doc, setDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export interface Church {
  id: string;
  name: string;
  district?: string;
  createdAt?: any;
}

interface ChurchContextType {
  currentChurch: Church | null;
  setCurrentChurch: (church: Church) => void;
  availableChurches: Church[];
  createChurch: (name: string, district?: string) => Promise<Church | null>;
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
        const churches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Church));
        
        // Ensure default EECH Las Torres exists
        let eechLasTorres = churches.find(c => c.name.toLowerCase().includes('las torres'));
        if (!eechLasTorres) {
          const newId = 'eech-las-torres';
          await setDoc(doc(firestore, 'churches', newId), {
            name: 'EECH Las Torres',
            district: 'Distrito 1',
            createdAt: serverTimestamp()
          });
          eechLasTorres = { id: newId, name: 'EECH Las Torres', district: 'Distrito 1' };
          churches.push(eechLasTorres);
        }
        
        setAvailableChurches(churches);

        // Load saved church
        const savedChurchId = localStorage.getItem('selected_church_id');
        if (savedChurchId) {
          const saved = churches.find(c => c.id === savedChurchId);
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

  const createChurch = async (name: string, district: string = 'Sin Distrito') => {
    if (!firestore) return null;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
    const newChurch = { id, name, district };
    try {
      await setDoc(doc(firestore, 'churches', id), {
        name,
        district,
        createdAt: serverTimestamp()
      });
      setAvailableChurches(prev => [...prev, newChurch]);
      return newChurch;
    } catch (e) {
      console.error("Error creating church", e);
      return null;
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
