export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lumi-g" x1="0" y1="0" x2="28" y2="28">
            <stop stopColor="#6366F1" />
            <stop offset="0.5" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <rect width="28" height="28" rx="8" fill="url(#lumi-g)" />
        <circle cx="14" cy="14" r="5" fill="#FFFFFF" />
        <circle cx="20" cy="8" r="2" fill="#FFFFFF" />
      </svg>
      <span className="font-extrabold text-lg tracking-tight text-text">
        Lumi<span className="text-accent">.</span>
      </span>
    </div>
  );
}
