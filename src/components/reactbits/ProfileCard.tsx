export default function ProfileCard() {
  return (
    <div className="relative w-full max-w-[340px] overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-b from-[#1a1e29] to-[#0f1117] p-[1px]">
      <div className="rounded-[19px] bg-[#0f1117] p-5">
        <div className="flex items-start gap-4">
          <img
            src="https://avatars.githubusercontent.com/u/217703905?v=4"
            alt="Dhanush B S"
            className="h-14 w-14 rounded-full border border-white/10 object-cover"
            loading="lazy"
          />
          <div>
            <h3 className="text-sm font-semibold text-white">Dhanush B S</h3>
            <p className="text-xs text-white/50">Cybersecurity — Networking</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Bengaluru, India
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-white/[0.04] py-3">
            <div className="text-sm font-bold text-white">7</div>
            <div className="text-[0.62rem] tracking-[0.08em] text-white/40">PROJECTS</div>
          </div>
          <div className="rounded-xl bg-white/[0.04] py-3">
            <div className="text-sm font-bold text-white">5</div>
            <div className="text-[0.62rem] tracking-[0.08em] text-white/40">SEM</div>
          </div>
          <div className="rounded-xl bg-white/[0.04] py-3">
            <div className="text-sm font-bold text-white">3</div>
            <div className="text-[0.62rem] tracking-[0.08em] text-white/40">LABS</div>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <a href="/resume" className="flex-1 rounded-full bg-white py-2 text-center text-xs font-semibold text-black hover:bg-white/90">View Resume</a>
          <a href="https://github.com/dhanushbs10" target="_blank" className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/70 hover:bg-white/5">GitHub</a>
        </div>
      </div>
    </div>
  );
}
