export function Tricolor({ className = '' }: { className?: string }) {
  return (
    <div className={`flex h-1.5 w-full ${className}`} aria-hidden>
      <div className="flex-1 bg-pwd-saffron" />
      <div className="flex-1 bg-white" />
      <div className="flex-1 bg-pwd-green" />
    </div>
  );
}

export function AshokaChakra({ className = 'h-6 w-6', color = '#0a3a82' }: { className?: string; color?: string }) {
  const spokes = Array.from({ length: 24 });
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Ashoka Chakra">
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="4" />
      <circle cx="50" cy="50" r="5" fill={color} />
      {spokes.map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2="50"
          y2="6"
          stroke={color}
          strokeWidth="1.5"
          transform={`rotate(${i * 15} 50 50)`}
        />
      ))}
    </svg>
  );
}

export function Emblem({ className = 'h-12 w-12' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex h-full w-full items-center justify-center rounded-full bg-white/95 ring-2 ring-pwd-gold shadow-sm">
        <AshokaChakra className="h-3/4 w-3/4" />
      </div>
    </div>
  );
}

export function SatyamevaJayate({ className = '' }: { className?: string }) {
  return <span className={`font-hindi ${className}`}>सत्यमेव जयते</span>;
}
