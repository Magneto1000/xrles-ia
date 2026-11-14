import { ExtractedDocument } from "../entities/document.entity";

export class PdfTextProcessorService {
  // Tamanho seguro de caracteres por bloco para síntese de voz sem timeout
  private static readonly MAX_CHUNK_LENGTH = 1800;
  // Velocidade média de leitura em português (palavras por minuto)
  private static readonly WORDS_PER_MINUTE = 140;

  /**
   * Higieniza o texto bruto extraído do PDF para leitura fluida por IA
   */
  public static sanitizeForSpeech(rawText: string): string {
    return rawText
      // 1. Junta palavras separadas por hífen na quebra de linha (ex: "arqui-\ntetura" -> "arquitetura")
      .replace(/(\w+)-\s*\r?\n\s*(\w+)/g, "$1$2")
      // 2. Remove números de página isolados em linhas (ex: "\n 14 \n" ou "Página 14")
      .replace(/^\s*(?:página|pág\.?|page)?\s*\d+\s*$/gim, "")
      // 3. Transforma quebras de linha simples (meio de frase) em espaço, preservando parágrafos duplos
      .replace(/([^\n])\r?\n(?!\r?\n)/g, "$1 ")
      // 4. Remove múltiplos espaços em branco seguidos
      .replace(/[ \t]{2,}/g, " ")
      // 5. Normaliza múltiplas quebras de parágrafo
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  /**
   * Divide o texto higienizado em blocos (chunks) respeitando o fim das frases (pontos finais)
   */
  public static splitIntoSpeechChunks(cleanText: string): string[] {
    if (!cleanText) return [];

    const sentences = cleanText.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [cleanText];
    const chunks: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;

      if ((currentChunk + " " + trimmedSentence).length <= this.MAX_CHUNK_LENGTH) {
        currentChunk = currentChunk ? `${currentChunk} ${trimmedSentence}` : trimmedSentence;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        // Caso uma única frase seja gigante, fatia de forma segura
        if (trimmedSentence.length > this.MAX_CHUNK_LENGTH) {
          const subChunks = trimmedSentence.match(new RegExp(`.{1,${this.MAX_CHUNK_LENGTH}}`, "g")) || [];
          chunks.push(...subChunks);
          currentChunk = "";
        } else {
          currentChunk = trimmedSentence;
        }
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  /**
   * Monta o objeto final de domínio com métricas e blocos prontos para a IA
   */
  public static buildExtractedDocument(
    title: string,
    originalFileName: string,
    totalPages: number,
    rawText: string
  ): ExtractedDocument {
    const cleanText = this.sanitizeForSpeech(rawText);
    const chunks = this.splitIntoSpeechChunks(cleanText);
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    const estimatedDurationMinutes = Math.max(1, Math.ceil(wordCount / this.WORDS_PER_MINUTE));

    return {
      title: title || originalFileName.replace(/\.pdf$/i, ""),
      originalFileName,
      totalPages,
      rawCharacters: cleanText.length,
      cleanText,
      chunks,
      estimatedDurationMinutes,
    };
  }
}