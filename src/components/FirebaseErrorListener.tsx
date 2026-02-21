'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: any) => {
      if (error instanceof FirestorePermissionError) {
        console.error("Caught Firestore Permission Error:", error.message);
        // In a real app, you might throw this to an error boundary
        // or display it in a more user-friendly way.
        // For development, we'll use a toast.
        toast({
          variant: "destructive",
          title: "Error de Permisos de Firestore",
          description: "Revisa las reglas de seguridad. Detalles en la consola.",
          duration: 10000,
        });
      } else {
        // Handle other types of errors if necessary
        console.error("An unexpected error occurred:", error);
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  // This component does not render anything
  return null;
}
