export default function VynloreExactPreview() {
  return (
    <div className="aspect-square overflow-hidden rounded-xl border border-[var(--color-line-strong)] bg-[#0a0a0f] flex flex-col">
      {/* Top bar like Vynlore */}
      <div className="flex h-10 items-center justify-between border-b border-white/10 bg-[#0f1117] px-3">
        <span className="font-mono text-[0.62rem] tracking-[0.18em] text-white/50">VYNL0RE — TAURI v2</span>
        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
      </div>
      <div className="flex flex-1 min-h-0">
        {/* Sidebar — exact from Sidebar.tsx */}
        <div className="hidden w-[140px] shrink-0 border-r border-white/10 bg-[#0f1117] p-3 sm:flex flex-col">
          <div className="font-mono text-[0.58rem] tracking-[0.2em] text-white/30">VYNLORE</div>
          <div className="mt-3 space-y-1">
            {['Home','Library','Albums','Artists','Genres','Playlists'].map((l, i) => (
              <div key={l} className={`flex items-center gap-2 rounded px-2 py-1 text-xs ${i===0 ? 'bg-white text-black' : 'text-white/60'}`}>
                <span className="h-3 w-3 rounded bg-current opacity-20"></span>{l}
              </div>
            ))}
          </div>
          <div className="mt-auto rounded bg-white/5 p-2 text-[0.62rem] text-white/40">Add Folder</div>
        </div>
        {/* Main — like HomeView with tracks */}
        <div className="flex-1 bg-[#0a0a0f] p-3 overflow-hidden">
          <div className="grid grid-cols-2 gap-2">
            {['Midnight Bus','Monsoon Static','Lab Hum','Neon Drift'].map((t, i) => (
              <div key={t} className="rounded-lg border border-white/10 bg-[#14171f] p-2">
                <div className="h-16 rounded bg-gradient-to-br from-[#1a1e29] to-[#0b0d12]"></div>
                <p className="mt-2 text-xs font-medium text-white truncate">{t}</p>
                <p className="text-[0.62rem] text-white/40">FLAC • 44.1kHz</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-white/10 bg-[#14171f] p-2">
            <div className="flex items-center justify-between text-[0.62rem] text-white/40"><span>Recently Played</span><span>→</span></div>
            <div className="mt-2 flex gap-2 overflow-hidden">
              {['A','B','C','D'].map((_,i)=> <div key={i} className="h-10 w-10 shrink-0 rounded bg-white/5"></div>)}
            </div>
          </div>
        </div>
      </div>
      {/* PlayerBar — exact from PlayerBar.tsx */}
      <div className="h-[52px] shrink-0 border-t border-white/10 bg-[#0f1117] px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-white/10"></div>
          <div>
            <p className="text-xs text-white">Midnight Bus</p>
            <p className="text-[0.62rem] text-white/40">FLAC • 44.1kHz</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/60">
          <span className="text-xs">⏮</span>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-black text-xs">▶</span>
          <span className="text-xs">⏭</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[0.62rem] text-white/30">44.1kHz • WASAPI</div>
      </div>
      <div className="bg-[#0f1117] px-3 pb-2 text-center font-mono text-[0.58rem] text-white/30">This is just the design — music can only be played through the app itself (WASAPI exclusive)</div>
    </div>
  );
}
