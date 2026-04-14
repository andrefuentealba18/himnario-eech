'use server';
/**
 * @fileOverview Flow para el Asistente del Administrador.
 * Maneja solicitudes en lenguaje natural para corregir o actualizar datos del himnario.
 */

import { ai, z } from '@/ai/genkit';

const ActionSchema = z.object({
  type: z.enum(['update_hymn', 'update_praise', 'update_choir', 'update_youth_choir', 'add_praise', 'add_choir']),
  id: z.string().describe('El ID o número del canto a modificar.'),
  data: z.any().describe('Los campos a actualizar (title, lyrics, tone, speed, etc.).'),
  description: z.string().describe('Explicación amigable de lo que hace esta acción.'),
});

const AssistantInputSchema = z.object({
  message: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({ text: z.string() })),
  })).optional(),
  contextSnapshot: z.string().describe('Un resumen de los cantos actuales para que la IA sepa qué existe.'),
});

const AssistantOutputSchema = z.object({
  text: z.string().describe('La respuesta del asistente.'),
  actions: z.array(ActionSchema).optional().describe('Lista de cambios técnicos a ejecutar en la app.'),
});

export type AssistantAction = z.infer<typeof ActionSchema>;
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

export async function askAssistant(input: z.infer<typeof AssistantInputSchema>): Promise<AssistantOutput> {
  const response = await ai.generate({
    system: `Eres el "Asistente Prototyper" oficial de la App Himnario EECH. 
    Tu objetivo es ayudar al administrador a mantener la base de datos limpia y correcta.
    
    REGLAS:
    1. Puedes proponer cambios en himnos (por número), alabanzas, coros y agrupaciones (por ID).
    2. Si el usuario te pide corregir una letra, genera la acción correspondiente con el texto completo corregido.
    3. Si el usuario pide cambiar una tonalidad, identifica el canto y genera la acción.
    4. Siempre sé amable y profesional.
    5. Usa el contexto proporcionado para identificar los IDs correctos.
    6. NO inventes cantos si no estás seguro de que el usuario lo quiere.
    
    FORMATO DE RESPUESTA:
    - Siempre devuelve un texto explicativo.
    - Si vas a realizar cambios, inclúyelos en el array de "actions".`,
    prompt: `Contexto actual (Lista de cantos):
    {{{contextSnapshot}}}
    
    Mensaje del usuario: {{{message}}}`,
    messages: input.history,
    output: { schema: AssistantOutputSchema },
  });

  return response.output!;
}
