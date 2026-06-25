const cls = (base, extra) => base + (extra ? ' ' + extra : '')

function Bar({ width, height, style }) {
  return <div style={{ width: width || '100%', height: height || 14, borderRadius: 6, background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite', ...style }} />
}

function Circle({ size }) {
  return <div style={{ width: size || 40, height: size || 40, borderRadius: '50%', background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite', flexShrink: 0 }} />
}

export function SkeletonRow({ cols = 4, height }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 }}>
      {Array.from({ length: cols }).map((_, i) => <Bar key={i} height={height || 80} />)}
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
      <Bar height={16} width="40%" style={{ marginBottom: 8 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Bar height={12} width="30%" />
          <Bar height={12} width="20%" />
          <Bar height={12} width="25%" />
          <Bar height={12} width="15%" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonProfile() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 240px', gap: 12, padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        <Circle size={80} />
        <Bar width="60%" height={14} />
        <Bar width="40%" height={12} />
        {Array.from({ length: 5 }).map((_, i) => <Bar key={i} height={12} />)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bar height={14} width="40%" />
        {Array.from({ length: 4 }).map((_, i) => <Bar key={i} height={36} />)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bar height={14} width="60%" />
        {Array.from({ length: 3 }).map((_, i) => <Bar key={i} height={12} />)}
        <Bar height={40} style={{ marginTop: 8 }} />
      </div>
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 4 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {Array.from({ length: 3 }).map((_, i) => <Bar key={i} height={100} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {Array.from({ length: 4 }).map((_, i) => <Bar key={i} height={72} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {Array.from({ length: 4 }).map((_, i) => <Bar key={i} height={72} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Bar height={200} />
        <Bar height={200} />
      </div>
    </div>
  )
}

export function SkeletonDonors() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 4 }}>
      <Bar height={36} />
      <Bar height={16} width="20%" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0' }}>
          <Circle size={32} />
          <Bar height={13} width="25%" />
          <Bar height={13} width="15%" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 4 }}>
      <Bar height={22} width="40%" />
      <Bar height={13} width="60%" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Bar height={15} width="45%" />
          {Array.from({ length: 3 }).map((_, j) => <Bar key={j} height={11} />)}
        </div>
      ))}
    </div>
  )
}

const STYLE_ID = 'skeleton-shimmer'
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `@keyframes shimmer { to { background-position: -200% 0 } }`
  document.head.appendChild(style)
}
