
'use server';
/**
 * @fileOverview Flow deshabilitado para evitar errores de cuota.
 */
export async function askAssistant(input: any): Promise<any> {
  return { text: "Servicio no disponible.", actions: [] };
}
