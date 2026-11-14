import React from "react";
import { BookOpen, Layers, Clock, FileCheck } from "lucide-react";
import { BrutalCard } from "@/components/ui/neo-brutal-ui";
import { ExtractedDocument } from "@/core/entities/document.entity";

interface PdfReaderPreviewProps {
  extractedDoc: ExtractedDocument | null;
}

export function PdfReaderPreview({ extractedDoc }: PdfReaderPreviewProps) {
  return (
    <BrutalCard>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-black" />
          <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-black">
            Texto Extraído e Higienizado
          </span>
        </div>

        {extractedDoc && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-gray-200 border-2 border-black rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              {extractedDoc.totalPages} pág.
            </span>
            <span className="px-3 py-1 bg-gray-200 border-2 border-black rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              {extractedDoc.chunks.length} blocos de IA
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 border-2 border-black rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />~
              {extractedDoc.estimatedDurationMinutes} min de áudio
            </span>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 bg-gray-50 border-2 border-black rounded-2xl font-serif text-base md:text-lg leading-relaxed text-black max-h-96 overflow-y-auto">
        {extractedDoc ? (
          <div className="flex flex-col gap-4 whitespace-pre-line">
            {extractedDoc.cleanText}
          </div>
        ) : (
          <p className="text-gray-600">
            Nenhum documento processado ainda. Selecione um arquivo PDF acima e
            clique em extrair para visualizar o texto real limpo pela nossa
            camada de domínio.
          </p>
        )}
      </div>
    </BrutalCard>
  );
}