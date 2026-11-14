"use client";

import React, { useState } from "react";
import {
  FileText,
  Headphones,
  Upload,
  Download,
  Sparkles,
  Volume2,
  Trash2,
  BookOpen,
} from "lucide-react";
import {
  BrutalCard,
  BrutalButton,
  BrutalInput,
  BrutalAlert,
  BrutalDivider,
} from "@/components/ui/neo-brutal-ui";

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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
    setDocumentTitle(file.name.replace(/\.pdf$/i, ""));
    setStatus({
      type: "success",
      message: `PDF "${file.name}" carregado e pronto para conversão.`,
    });
  };

  const handleClear = () => {
    setSelectedFile(null);
    setDocumentTitle("");
    setStatus(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black py-10 px-4 sm:px-8 md:px-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* CABEÇALHO CENTRALIZADO GRANDE (APENAS ÍCONE E NOME) */}
        <header className="flex flex-col items-center justify-center py-6">
          <div className="inline-flex items-center gap-4 md:gap-5 bg-white border-2 border-black rounded-2xl px-8 py-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-black text-white p-3.5 md:p-4 rounded-xl border-2 border-black flex items-center justify-center">
              <Headphones className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black tracking-tight">
              Xrles.ia
            </h1>
          </div>
        </header>

        {/* ÁREA PRINCIPAL COM ESPAÇAMENTO AMPLO */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* COLUNA ESQUERDA: CONVERSOR E LEITURA (7 COLUNAS) */}
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
                {/* CAMPO DE TÍTULO */}
                <BrutalInput
                  label="Nome do Áudio"
                  placeholder="Digite o título para salvar o arquivo MP3..."
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                />

                {/* ZONA DE UPLOAD DE PDF */}
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

              <BrutalDivider />

              {/* BOTÕES DE AÇÃO */}
              <div className="flex flex-col sm:flex-row gap-4">
                <BrutalButton variant="primary" className="flex-1">
                  <Sparkles className="w-5 h-5" />
                  Converter para MP3
                </BrutalButton>
                {selectedFile && (
                  <BrutalButton variant="secondary" onClick={handleClear}>
                    <Trash2 className="w-5 h-5" />
                    Limpar
                  </BrutalButton>
                )}
              </div>
            </BrutalCard>

            {/* ÁREA DE TEXTO EXTRAÍDO (FONT-SERIF EDITORIAL) */}
            <BrutalCard>
              <div className="flex items-center gap-2.5 mb-5">
                <BookOpen className="w-5 h-5 text-black" />
                <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-black">
                  Texto Extraído do PDF
                </span>
              </div>

              <div className="p-6 md:p-8 bg-gray-50 border-2 border-black rounded-2xl font-serif text-base md:text-lg leading-relaxed text-black">
                {selectedFile ? (
                  <p>
                    Arquivo <strong>{selectedFile.name}</strong> pronto. Assim
                    que clicarmos em converter, o texto limpo das páginas
                    aparecerá aqui para conferência enquanto o áudio MP3 é
                    gerado.
                  </p>
                ) : (
                  <p>
                    Nenhum documento selecionado no momento. Carregue um arquivo
                    PDF acima para visualizar o conteúdo textual antes da
                    conversão em voz.
                  </p>
                )}
              </div>
            </BrutalCard>
          </div>

          {/* COLUNA DIREITA: ARQUIVOS MP3 PRONTOS PARA BAIXAR (5 COLUNAS) */}
          <aside className="lg:col-span-5">
            <BrutalCard largeShadow>
              <div className="mb-8">
                <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-black block mb-2">
                  Biblioteca de Downloads
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-black">
                  Arquivos MP3
                </h2>
              </div>

              <div className="flex flex-col gap-6">
                {/* CARD DE ARQUIVO CONVERTIDO */}
                <div className="p-6 bg-gray-50 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="bg-white p-2.5 rounded-xl border-2 border-black shrink-0">
                        <FileText className="w-5 h-5 text-black" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-base text-black truncate">
                          Capitulo_01_Introducao.mp3
                        </h3>
                        <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-black block mt-1">
                          12.4 MB • 14 min
                        </span>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-green-100 text-green-700 border-2 border-black rounded-lg text-[10px] font-extrabold uppercase tracking-wider shrink-0">
                      Pronto
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <BrutalButton variant="primary" className="flex-1 py-3">
                      <Download className="w-4 h-4" />
                      Baixar MP3
                    </BrutalButton>
                    <BrutalButton variant="muted" className="py-3 px-4">
                      <Volume2 className="w-4 h-4" />
                      Ouvir
                    </BrutalButton>
                  </div>
                </div>
              </div>
            </BrutalCard>
          </aside>
        </main>
      </div>
    </div>
  );
}