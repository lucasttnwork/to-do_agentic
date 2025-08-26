import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OPENAI_API_KEY não configurada' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Arquivo de áudio é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar tipo de arquivo
    if (!audioFile.type.startsWith('audio/')) {
      return NextResponse.json(
        { error: 'Arquivo deve ser de áudio' },
        { status: 400 }
      );
    }

    // Converter File para Buffer
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Transcrever com Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: new File([buffer], audioFile.name, { type: audioFile.type }),
      model: 'whisper-1',
      language: 'pt',
      response_format: 'verbose_json',
    });

    return NextResponse.json({ 
      success: true,
      text: (transcription as any).text || (transcription as any).segments?.map((s: any) => s.text).join(' ') || '',
      language: 'pt',
      model: 'whisper-1'
    });

  } catch (error) {
    console.error('Erro na transcrição:', error);
    return NextResponse.json(
      { error: 'Erro na transcrição do áudio' },
      { status: 500 }
    );
  }
}
