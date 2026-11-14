import React from "react";
import { Headphones } from "lucide-react";

export function HeaderBrand() {
  return (
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
  );
}