function S({ width, height, style }) {
  return <div className="sk" style={{ width: width || '100%', height: height || 14, ...style }} />
}

export function SkeletonRow({ cols = 4, height }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap:10, padding:4 }}>
      {Array.from({ length: cols }).map((_, i) => <S key={i} height={height || 80} />)}
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8, padding:16 }}>
      <S width="40%" style={{ marginBottom:8 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display:'flex', gap:12, alignItems:'center' }}>
          <S width="30%" />
          <S width="20%" />
          <S width="25%" />
          <S width="15%" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonProfile() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'240px 1fr 240px', gap:12, padding:16 }}>
      <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'center' }}>
        <div className="sk" style={{ width:80, height:80, borderRadius:'50%' }} />
        <S width="60%" />
        <S width="40%" />
        {Array.from({ length: 5 }).map((_, i) => <S key={i} />)}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <S width="40%" />
        {Array.from({ length: 4 }).map((_, i) => <S key={i} height={36} />)}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <S width="60%" />
        {Array.from({ length: 3 }).map((_, i) => <S key={i} />)}
        <S height={40} style={{ marginTop:8 }} />
      </div>
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, padding:4 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
        {Array.from({ length: 3 }).map((_, i) => <S key={i} height={100} />)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
        {Array.from({ length: 4 }).map((_, i) => <S key={i} height={72} />)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
        {Array.from({ length: 4 }).map((_, i) => <S key={i} height={72} />)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <S height={200} />
        <S height={200} />
      </div>
    </div>
  )
}

export function SkeletonDonors() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8, padding:4 }}>
      <S height={36} />
      <S width="20%" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'6px 0' }}>
          <div className="sk" style={{ width:32, height:32, borderRadius:'50%' }} />
          <S width="25%" />
          <S width="15%" />
        </div>
      ))}
    </div>
  )
}
