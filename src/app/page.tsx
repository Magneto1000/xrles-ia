"use client";

import React, { useState } from "react";
import {
  Upload,
  Sparkles,
  Trash2,
  Loader2,
  Headphones,
} from "lucide-react";
import {
  BrutalCard,
  BrutalButton,
  BrutalInput,
  BrutalAlert,
  BrutalDivider,
} from "@/components/ui/neo-brutal-ui";
import { HeaderBrand } from "@/components/features/header-brand";
import { PdfReaderPreview } from "@/components/features/pdf-reader-preview";
import { AudioLibrarySidebar } from "@/components/features/audio-library-sidebar";
import { ExtractedDocument, AudioTrack } from "@/core/entities/document.entity";
import { AudioAssemblerService } from "@/core/services/audio-assembler.service";

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isConvertingAudio, setIsConvertingAudio] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(
    null
  );
  const [extractedDoc, setExtractedDoc] = useState<ExtractedDocument | null>(
    null
  );
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [tracks, setTracks] = useState<AudioTrack[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setStatus({
        type: "error",
        message: "Formato inválido. Selecione apenas arquivos PDF.",
      });
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setExtractedDoc(null);
    setDocumentTitle(file.name.replace(/\.pdf$/i, ""));
    setStatus({
      type: "success",
      message: `PDF "${file.name}" carregado. Clique em "1. Extrair Texto do PDF" abaixo.`,
    });
  };

  const handleExtractPdf = async () => {
    if (!selectedFile) return;

    try {
      setIsExtracting(true);
      setStatus(null);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", documentTitle);

      const response = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao extrair o PDF.");
      }

      setExtractedDoc(result.data);
      setStatus({
        type: "success",
        message: `Texto extraído (${result.data.chunks.length} blocos). Agora clique em "2. Gerar Arquivo MP3"!`,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro inesperado ao ler o PDF.";
      setStatus({ type: "error", message: errorMessage });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConvertToMp3 = async () => {
    if (!extractedDoc) return;

    try {
      setIsConvertingAudio(true);
      setStatus(null);

      const { audioUrl, sizeMB } =
        await AudioAssemblerService.convertChunksToSingleMp3(
          extractedDoc.chunks,
          (current, total) => {
            setProgress({ current, total });
          }
        );

      const safeFileName =
        (documentTitle || extractedDoc.title)
          .trim()
          .replace(/[^\w\d_-]+/g, "_") + ".mp3";

      const newTrack: AudioTrack = {
        id: crypto.randomUUID(),
        title: documentTitle || extractedDoc.title,
        fileName: safeFileName,
        sizeMB,
        durationMinutes: extractedDoc.estimatedDurationMinutes,
        audioUrl,
        createdAt: new Date().toISOString(),
        status: "ready",
      };

      setTracks((prev) => [newTrack, ...prev]);
      setStatus({
        type: "success",
        message: `Conversão concluída com sucesso! Seu arquivo "${safeFileName}" já está disponível para download ao lado.`,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro durante a síntese de voz para MP3.";
      setStatus({ type: "error", message: errorMessage });
    } finally {
      setIsConvertingAudio(false);
      setProgress(null);
    }
  };

  const handleRemoveTrack = (id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClear = () => {
    setSelectedFile(null);
    setDocumentTitle("");
    setExtractedDoc(null);
    setProgress(null);
    setStatus(null);
  };

  const progressPercent = progress
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 text-black py-10 px-4 sm:px-8 md:px-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <HeaderBrand />

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* COLUNA ESQUERDA (7 COLUNAS) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <BrutalCard largeShadow>
              <div className="mb-8">
                <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-black block mb-2">
                  Conversor de Documentos
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-black">
                  Transformar PDF em Áudio MP3
                </h2>
              </div>

              {status && (
                <div className="mb-8">
                  <BrutalAlert type={status.type} message={status.message} />
                </div>
              )}

              <div className="flex flex-col gap-8">
                <BrutalInput
                  label="Nome do Áudio"
                  placeholder="Digite o título para salvar o arquivo MP3..."
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                />

                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-black">
                    Documento PDF
                  </span>
                  <label className="flex flex-col items-center justify-center border-2 border-black rounded-2xl p-10 md:p-12 bg-gray-50 hover:bg-gray-200 transition cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center gap-3">
                    <div className="bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2">
                      <Upload className="w-7 h-7 text-black" />
                    </div>
                    <span className="font-extrabold text-base md:text-lg text-black max-w-md break-words">
                      {selectedFile
                        ? selectedFile.name
                        : "Clique para selecionar seu arquivo PDF"}
                    </span>
                    <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-black">
                      {selectedFile
                        ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB carregados`
                        : "Livros, artigos ou apostilas"}
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              {/* BARRA DE PROGRESSO NEO-BRUTALISTA DURANTE A CONVERSÃO */}
              {isConvertingAudio && progress && (
                <div className="mt-8 p-5 bg-gray-50 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-black">
                      Sintetizando Voz com IA (Bloco {progress.current} de{" "}
                      {progress.total})
                    </span>
                    <span className="text-sm font-extrabold text-black">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-5 bg-white border-2 border-black rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <BrutalDivider />

              {/* BOTÕES DE AÇÃO EM DUAS ETAPAS CLARAS */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <BrutalButton
                  variant={extractedDoc ? "secondary" : "primary"}
                  className="flex-1"
                  onClick={handleExtractPdf}
                  disabled={!selectedFile || isExtracting || isConvertingAudio}
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Extraindo PDF...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      1. Extrair Texto do PDF
                    </>
                  )}
                </BrutalButton>

                {extractedDoc && (
                  <BrutalButton
                    variant="primary"
                    className="flex-1"
                    onClick={handleConvertToMp3}
                    disabled={isConvertingAudio || isExtracting}
                  >
                    {isConvertingAudio ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Gerando MP3 ({progressPercent}%)...
                      </>
                    ) : (
                      <>
                        <Headphones className="w-5 h-5" />
                        2. Gerar Arquivo MP3
                      </>
                    )}
                  </BrutalButton>
                )}

                {selectedFile && (
                  <BrutalButton
                    variant="muted"
                    onClick={handleClear}
                    disabled={isExtracting || isConvertingAudio}
                  >
                    <Trash2 className="w-5 h-5" />
                    Limpar
                  </BrutalButton>
                )}
              </div>
            </BrutalCard>

            <PdfReaderPreview extractedDoc={extractedDoc} />
          </div>

          {/* COLUNA DIREITA: BIBLIOTECA DE MP3 (5 COLUNAS) */}
          <aside className="lg:col-span-5">
            <AudioLibrarySidebar
              tracks={tracks}
              onRemoveTrack={handleRemoveTrack}
            />
          </aside>
        </main>
      </div>
    </div>
  );
}