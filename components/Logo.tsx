export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Sunrise over a sill — Lumi is light on your working day. */}
        <rect width="26" height="26" rx="4" fill="#1F5738" />
        <path d="M6 17.5a7 7 0 0 1 14 0Z" fill="#F6F2EA" />
        <rect x="6" y="19.5" width="14" height="1.6" rx="0.8" fill="#F6F2EA" />
      </svg>
      <span className="font-display text-xl tracking-tight text-text">
        Lumi<span className="text-accent">.</span>
      </span>
    </div>
  );
}
