'use server';
/**
 * @fileOverview Flow deshabilitado.
 */
export async function askAssistant(input: any): Promise<any> {
  return { text: "Servicio no disponible.", actions: [] };
}