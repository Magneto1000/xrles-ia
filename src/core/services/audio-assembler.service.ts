export class AudioAssemblerService {
  /**
   * Processa todos os blocos de texto em série, reporta o progresso
   * e retorna um Blob MP3 único + URL pronta para download e reprodução.
   */
  public static async convertChunksToSingleMp3(
    chunks: string[],
    onProgress: (currentChunk: number, totalChunks: number) => void
  ): Promise<{ audioBlob: Blob; audioUrl: string; sizeMB: string }> {
    const mp3Parts: ArrayBuffer[] = [];

    for (let i = 0; i < chunks.length; i++) {
      onProgress(i + 1, chunks.length);

      const response = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textChunk: chunks[i] }),
      });

      if (!response.ok) {
        throw new Error(`Falha ao converter o bloco ${i + 1} de ${chunks.length}.`);
      }

      const partBuffer = await response.arrayBuffer();
      mp3Parts.push(partBuffer);
    }

    // Une todos os buffers MP3 em um único arquivo final
    const finalBlob = new Blob(mp3Parts, { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(finalBlob);
    const sizeMB = `${(finalBlob.size / (1024 * 1024)).toFixed(2)} MB`;

    return {
      audioBlob: finalBlob,
      audioUrl,
      sizeMB,
    };
  }
}