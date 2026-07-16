export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Four-point spark — Lumi, light on your working day. */}
        <rect width="24" height="24" rx="6" fill="#09090B" />
        <path
          d="M12 4.5 C12.45 9.3 14.7 11.55 19.5 12 C14.7 12.45 12.45 14.7 12 19.5 C11.55 14.7 9.3 12.45 4.5 12 C9.3 11.55 11.55 9.3 12 4.5 Z"
          fill="#FFFFFF"
        />
      </svg>
      <span className="font-display text-lg tracking-tight text-text">Lumi</span>
    </div>
  );
}
