import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Server-side request to FormSubmit to bypass client CORS/Origin issues
    await fetch("https://formsubmit.co/ajax/p.andresfuentealbabello@gmail.com", {
      method: "POST",
      headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://himnario-eech.vercel.app',
          'Referer': 'https://himnario-eech.vercel.app/'
      },
      body: JSON.stringify({
          name: "Himnario EECH Bot",
          message: `Un usuario ha enviado una nueva sugerencia para revisión en la aplicación.\n\nTipo: ${body.type}\nTítulo: ${body.title}\n\nIngresa al Panel de Control (Configuración > Admin) de la aplicación para revisar y aprobar esta sugerencia.`,
          _subject: "NUEVA REVISIÓN PENDIENTE - Himnario EECH"
      })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email from API route", error);
    return NextResponse.json({ success: false, error: 'Failed to notify' }, { status: 500 });
  }
}
