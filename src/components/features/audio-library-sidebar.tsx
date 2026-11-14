"use client";

import React, { useState } from "react";
import { FileText, Download, Volume2, Pause, Trash2, Gauge } from "lucide-react";
import { BrutalCard, BrutalButton } from "@/components/ui/neo-brutal-ui";
import { AudioTrack } from "@/core/entities/document.entity";

interface AudioLibrarySidebarProps {
  tracks: AudioTrack[];
  onRemoveTrack: (id: string) => void;
}

export function AudioLibrarySidebar({
  tracks,
  onRemoveTrack,
}: AudioLibrarySidebarProps) {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  const handleDownload = (track: AudioTrack) => {
    const link = document.createElement("a");
    link.href = track.audioUrl;
    link.download = track.fileName.endsWith(".mp3")
      ? track.fileName
      : `${track.fileName}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <BrutalCard largeShadow>
      <div className="mb-8">
        <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-black block mb-2">
          Biblioteca de Downloads
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-black">
          Arquivos MP3 ({tracks.length})
        </h2>
      </div>

      {tracks.length === 0 ? (
        <div className="p-8 bg-gray-50 border-2 border-black rounded-2xl text-center">
          <p className="font-serif text-sm md:text-base text-gray-600">
            Nenhum arquivo MP3 convertido ainda. Extraia um PDF ao lado e clique
            em &ldquo;2. Gerar Arquivo MP3&rdquo; para criar seu audiobook.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {tracks.map((track) => {
            const isPlaying = activeTrackId === track.id;

            return (
              <div
                key={track.id}
                className="p-6 bg-gray-50 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="bg-white p-2.5 rounded-xl border-2 border-black shrink-0">
                      <FileText className="w-5 h-5 text-black" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-base text-black truncate">
                        {track.fileName}
                      </h3>
                      <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-black block mt-1">
                        {track.sizeMB} • ~{track.durationMinutes} min • Voz Neural (+30%)
                      </span>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-green-100 text-green-700 border-2 border-black rounded-lg text-[10px] font-extrabold uppercase tracking-wider shrink-0">
                    Pronto
                  </span>
                </div>

                {/* PLAYER DE ÁUDIO NATIVO COM CONTROLE DE VELOCIDADE */}
                {isPlaying && (
                  <div className="p-4 bg-white border-2 border-black rounded-xl flex flex-col gap-3">
                    <audio
                      controls
                      autoPlay
                      src={track.audioUrl}
                      className="w-full h-10"
                      onPlay={(e) => {
                        e.currentTarget.playbackRate = playbackRate;
                      }}
                    />
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-black flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5" />
                        Ajuste Fino no Player:
                      </span>
                      <div className="flex gap-1.5">
                        {[1.0, 1.15, 1.3].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            onClick={(e) => {
                              setPlaybackRate(rate);
                              const audioEl = e.currentTarget
                                .closest("div.p-4")
                                ?.querySelector("audio");
                              if (audioEl) audioEl.playbackRate = rate;
                            }}
                            className={`px-2 py-1 rounded-lg border-2 border-black text-[10px] font-extrabold cursor-pointer transition ${
                              playbackRate === rate
                                ? "bg-black text-white"
                                : "bg-gray-200 text-black hover:bg-gray-300"
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-1">
                  <BrutalButton
                    variant="primary"
                    className="flex-1 py-3 text-sm"
                    onClick={() => handleDownload(track)}
                  >
                    <Download className="w-4 h-4" />
                    Baixar MP3
                  </BrutalButton>

                  <BrutalButton
                    variant="muted"
                    className="py-3 px-4 text-sm"
                    onClick={() =>
                      setActiveTrackId(isPlaying ? null : track.id)
                    }
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Fechar
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        Ouvir
                      </>
                    )}
                  </BrutalButton>

                  <BrutalButton
                    variant="secondary"
                    className="py-3 px-3 text-sm"
                    onClick={() => onRemoveTrack(track.id)}
                    title="Remover da lista"
                  >
                    <Trash2 className="w-4 h-4" />
                  </BrutalButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </BrutalCard>
  );
}