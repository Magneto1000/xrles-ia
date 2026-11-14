export interface ExtractedDocument {
  title: string;
  originalFileName: string;
  totalPages: number;
  rawCharacters: number;
  cleanText: string;
  chunks: string[];
  estimatedDurationMinutes: number;
}

export interface AudioTrack {
  id: string;
  title: string;
  fileName: string;
  sizeMB: string;
  durationMinutes: number;
  audioUrl: string;
  createdAt: string;
  status: "processing" | "ready" | "error";
}