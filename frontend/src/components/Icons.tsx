interface IconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

const BASE = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 1.8 };

// ── Voies ────────────────────────────────────────────────────
export function IconCorps({ size = 22, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...BASE} style={style}>
      <line x1="3" y1="3" x2="21" y2="21" />
      <line x1="21" y1="3" x2="3" y2="21" />
      <line x1="21" y1="3" x2="17" y2="3" />
      <line x1="21" y1="3" x2="21" y2="7" />
      <line x1="3" y1="21" x2="7" y2="21" />
      <line x1="3" y1="21" x2="3" y2="17" />
    </svg>
  );
}

export function IconEsprit({ size = 22, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...BASE} style={style}>
      <path d="M12 6.253v13M12 6.253C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
    </svg>
  );
}

export function IconParesseux({ size = 22, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...BASE} style={style}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      <line x1="14" y1="9" x2="17" y2="9"/>
      <line x1="14" y1="12" x2="16" y2="12"/>
    </svg>
  );
}

// ── Stats ─────────────────────────────────────────────────────
export function IconForce({ size = 22, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...BASE} style={style}>
      <path d="M14.5 2.5L18 6l-9.5 9.5-2-2M2 22l4.5-4.5M6 12l6-6M15 3l6 6"/>
      <line x1="17" y1="3" x2="21" y2="3"/>
      <line x1="21" y1="3" x2="21" y2="7"/>
    </svg>
  );
}

export function IconDefense({ size = 22, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...BASE} style={style}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

export function IconVie({ size = 22, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...BASE} style={style}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

export function IconMagie({ size = 22, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...BASE} style={style}>
      <path d="M15 2L8.5 8.5l1 4 4 1L21 7l-6-5z"/>
      <line x1="3" y1="22" x2="8.5" y2="16.5"/>
      <line x1="12" y1="2" x2="12" y2="4"/>
      <line x1="20" y1="10" x2="22" y2="10"/>
      <line x1="17.5" y1="4.5" x2="19" y2="3"/>
    </svg>
  );
}

export function IconIntel({ size = 22, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...BASE} style={style}>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
    </svg>
  );
}

// ── Temps ─────────────────────────────────────────────────────
export function IconSablier({ size = 18, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...BASE} style={style}>
      <path d="M5 3h14M5 21h14"/>
      <path d="M5 3v5l7 4-7 4v5"/>
      <path d="M19 3v5l-7 4 7 4v5"/>
    </svg>
  );
}

export function IconCalendrier({ size = 18, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...BASE} style={style}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

export function IconDuree({ size = 18, color = "currentColor", style }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} {...BASE} style={style}>
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12 7 12 12 15 15"/>
    </svg>
  );
}
