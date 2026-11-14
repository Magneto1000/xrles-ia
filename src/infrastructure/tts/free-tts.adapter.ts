import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

/**
 * INFRASTRUCTURE TIER - Adaptador de Síntese de Voz Neural (TTS) Gratuito
 * Gera áudio MP3 com controle de velocidade (rate) nativo no arquivo final.
 */
export class FreeTtsAdapter {
  // Taxa de aceleração da fala no MP3 gerado:
  // "+30%" equivale a 1.3x (30% mais rápido e natural).
  // Você pode ajustar para "+20%", "+25%" ou "+30%" conforme seu gosto!
  private static readonly SPEECH_RATE = "+30%";

  // Voz Neural Brasileira (Opções: "pt-BR-AntonioNeural" ou "pt-BR-FranciscaNeural")
  private static readonly VOICE_NAME = "pt-BR-FranciscaNeural";

  public static async synthesizeToMp3Buffer(
    textChunk: string
  ): Promise<Buffer> {
    const cleanText = textChunk.replace(/\s+/g, " ").trim();
    if (!cleanText) {
      throw new Error("Bloco de texto vazio.");
    }

    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(
        this.VOICE_NAME,
        OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
      );

      // Gera o stream de áudio já acelerado via Prosody Rate
      const { audioStream } = tts.toStream(cleanText, {
        rate: this.SPEECH_RATE,
      });

      const chunks: Buffer[] = [];

      return await new Promise<Buffer>((resolve, reject) => {
        audioStream.on("data", (chunk: Buffer) => {
          chunks.push(Buffer.from(chunk));
        });
        audioStream.on("end", () => {
          resolve(Buffer.concat(chunks));
        });
        audioStream.on("error", (err: Error) => {
          reject(err);
        });
      });
    } catch (edgeError) {
      console.warn(
        "[TTS_ADAPTER] Fallback acionado devido a erro no EdgeTTS:",
        edgeError
      );
      return this.fallbackGoogleTts(cleanText);
    }
  }

  /**
   * Fallback de segurança caso a rede bloqueie WebSockets do EdgeTTS
   */
  private static async fallbackGoogleTts(text: string): Promise<Buffer> {
    const words = text.split(" ");
    const slices: string[] = [];
    let current = "";

    for (const word of words) {
      if ((current + " " + word).trim().length <= 190) {
        current = (current + " " + word).trim();
      } else {
        if (current) slices.push(current);
        current = word.slice(0, 190);
      }
    }
    if (current) slices.push(current);

    const buffers: Buffer[] = [];
    for (const slice of slices) {
      const encoded = encodeURIComponent(slice);
      const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encoded}&tl=pt-BR&client=tw-ob&ttsspeed=1`;
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      buffers.push(Buffer.from(await res.arrayBuffer()));
    }

    return Buffer.concat(buffers);
  }
}