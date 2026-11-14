import { NextRequest, NextResponse } from "next/server";
import { FreeTtsAdapter } from "@/infrastructure/tts/free-tts.adapter";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { textChunk } = body;

    if (!textChunk || typeof textChunk !== "string") {
      return NextResponse.json(
        { error: "Bloco de texto inválido para conversão em voz." },
        { status: 400 }
      );
    }

    // 1. Passa apenas 1 argumento (textChunk)
    const mp3Buffer = await FreeTtsAdapter.synthesizeToMp3Buffer(textChunk);

    // 2. Converte o Buffer para Uint8Array (compatível com Web API do Next.js 16)
    const uint8Body = new Uint8Array(mp3Buffer);

    return new NextResponse(uint8Body, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": uint8Body.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("[TTS_SYNTHESIZE_ERROR]:", error);
    return NextResponse.json(
      { error: "Erro ao sintetizar o bloco de áudio MP3." },
      { status: 500 }
    );
  }
}