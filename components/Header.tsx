"use client";

import { Focus, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-neon/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center neon-border">
            <Focus className="w-5 h-5 text-neon" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight neon-text text-neon">
              FocusFlow
            </h1>
            <p className="text-[11px] text-sky-300/60 -mt-0.5">
              AI Destekli Odaklanma Asistanı
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-sky-300/70">
          <Sparkles className="w-3.5 h-3.5 text-neon" />
          <span className="hidden sm:inline">Dark Mode · Glass UI</span>
        </div>
      </div>
    </header>
  );
}