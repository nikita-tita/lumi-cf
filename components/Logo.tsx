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
          d="M12 4.5 L13.9 10.1 L19.5 12 L13.9 13.9 L12 19.5 L10.1 13.9 L4.5 12 L10.1 10.1 Z"
          fill="#FFFFFF"
        />
      </svg>
      <span className="font-display text-lg tracking-tight text-text">Lumi</span>
    </div>
  );
}
