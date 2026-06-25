import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { getMyDashboard } from '../api/donors'
import { getMyTarget } from '../api/target'
import { requestMoreData } from '../api/donors'
import { SkeletonDashboard } from '../../../components/Skeleton'
import { cacheGet, cacheSet } from '../../../utils/cache'

const currency = n => n != null ? '₹' + Number(n).toLocaleString('en-IN') : '—'

const STATUS_COLORS = {
  pending: '#fbbf24', contacted: '#60a5fa', follow_up: '#a78bfa',
  donation_collected: '#34d399', lead_done: '#34d399', not_interested: '#f87171',
  not_reachable: '#9ca3af', scheduled: '#a78bfa',
}

const CACHE_KEY = 'fro_dashboard'

export default function Dashboard() {
  const cached = cacheGet(CACHE_KEY)
  const [dashData, setDashData] = useState(cached?.dash || null)
  const [targetData, setTargetData] = useState(cached?.target || null)
  const [loading, setLoading] = useState(!cached)
  const [showRequest, setShowRequest] = useState(false)
  const [reqMsg, setReqMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [reqDone, setReqDone] = useState(false)

  useEffect(() => {
    Promise.all([
      getMyDashboard().catch(() => null),
      getMyTarget().catch(() => null),
    ]).then(([d, t]) => {
      setDashData(d)
      setTargetData(t)
      if (d || t) cacheSet(CACHE_KEY, { dash: d, target: t }, 30000)
    }).finally(() => setLoading(false))
  }, [])

  const handleSendRequest = async () => {
    if (!reqMsg.trim()) return
    setSending(true)
    try {
      await requestMoreData(reqMsg)
      setReqDone(true)
      setReqMsg('')
      setTimeout(() => { setShowRequest(false); setReqDone(false) }, 2000)
    } catch (err) {
      alert(err.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) return <SkeletonDashboard />

  const ds = dashData || {}
  const ts = targetData || {}
  const { stats = {} } = ds
  const target = ts.target || ds.target || 0
  const collected = ts.collected || ds.collected || 0
  const remaining = ts.remaining || Math.max(0, target - collected)
  const progress = target > 0 ? Math.min(100, (collected / target) * 100) : 0
  const inc = ts.incentive || {}

  const sourceLabel = {
    auto: 'Auto-calculated (based on salary & joining date)',
    manual: 'Set by NGO Admin',
    not_set: 'Not set by NGO Admin yet',
  }

  const mainBox = { border:'1px solid var(--line)', borderRadius:16, padding:'18px 20px', display:'flex', flexDirection:'column', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,.04)' }

  const pieData = ts.stats
    ? Object.entries(ts.stats).filter(([k]) => k !== 'total').map(([k, v]) => ({
        name: k.replace(/_/g, ' '),
        value: v,
        color: STATUS_COLORS[k] || '#94a3b8',
      }))
    : []

  const barData = [
    { name: 'Target', amount: target, fill: '#94a3b8' },
    { name: 'Collected', amount: collected, fill: '#34d399' },
    { name: 'Remaining', amount: remaining, fill: '#f87171' },
  ]

  return (
    <div className="bento-grid">
      {/* Hero row */}
      <div className="bento-col-4">
        <div style={mainBox}>
          <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:.5, color:'var(--md-outline)', marginBottom:2 }}>Collected</div>
          <div style={{ fontSize:28, fontWeight:800, color:'var(--sage)', lineHeight:1.2 }}>{currency(collected)}</div>
          <div style={{ marginTop:8, height:4, borderRadius:2, background:'var(--md-outline-variant)', overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:2, background:'var(--sage)', width:`${progress}%`, transition:'width .4s' }} />
          </div>
          <div style={{ marginTop:6, fontSize:10, color:'var(--ink-soft)' }}>{progress.toFixed(0)}% of target achieved</div>
        </div>
      </div>
      <div className="bento-col-4">
        <div style={mainBox}>
          <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:.5, color:'var(--md-outline)', marginBottom:2 }}>Monthly Target</div>
          <div style={{ fontSize:28, fontWeight:800, color:'var(--ink)', lineHeight:1.2 }}>{currency(target)}</div>
          <div style={{ marginTop:8, fontSize:10, color:'var(--ink-soft)' }}>
            {ts.target_source ? <>Source: {sourceLabel[ts.target_source] || ts.target_source}</> : '—'}
          </div>
        </div>
      </div>
      <div className="bento-col-4">
        <div style={mainBox}>
          <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:.5, color:'var(--md-outline)', marginBottom:2 }}>Remaining</div>
          <div style={{ fontSize:28, fontWeight:800, color: remaining > 0 ? '#e53e3e' : 'var(--sage)', lineHeight:1.2 }}>{currency(remaining)}</div>
          <div style={{ marginTop:8, fontSize:10, color:'var(--ink-soft)' }}>
            {remaining > 0 ? `Need ${currency(remaining)} more to hit target` : 'Target achieved!'}
          </div>
        </div>
      </div>

      {/* Secondary stats row */}
      <div className="bento-col-3">
        <div className="bento-card">
          <div className="m3-stat">
            <div className="m3-stat-num">{stats.total ?? ts.stats?.total ?? 0}</div>
            <div className="m3-stat-lbl">Assigned Donors</div>
          </div>
        </div>
      </div>
      <div className="bento-col-3">
        <div className="bento-card">
          <div className="m3-stat">
            <div className="m3-stat-num">{stats.contacted ?? 0}</div>
            <div className="m3-stat-lbl">Contacted</div>
          </div>
        </div>
      </div>
      <div className="bento-col-3">
        <div className="bento-card">
          <div className="m3-stat">
            <div className="m3-stat-num">{stats.donation_collected ?? 0}</div>
            <div className="m3-stat-lbl">Donations</div>
          </div>
        </div>
      </div>
      <div className="bento-col-3">
        <div className="bento-card">
          <div className="m3-stat">
            <div className="m3-stat-num" style={{ color:'var(--amber)' }}>{currency(inc.totalAKI)}</div>
            <div className="m3-stat-lbl">Total AKI</div>
          </div>
        </div>
      </div>
      <div className="bento-col-3">
        <div className="bento-card">
          <div className="m3-stat">
            <div className="m3-stat-num" style={{ color: inc.targetMet ? 'var(--sage)' : 'var(--ink-soft)' }}>{currency(inc.akiPayout)}</div>
            <div className="m3-stat-lbl">AKI Payout {!inc.targetMet && <span style={{fontSize:9, color:'var(--ink-soft)'}}>(target not met)</span>}</div>
          </div>
        </div>
      </div>
      <div className="bento-col-3">
        <div className="bento-card">
          <div className="m3-stat">
            <div className="m3-stat-num" style={{ color: inc.targetMet ? 'var(--sage)' : 'var(--ink-soft)' }}>{currency(inc.monthlyIncentive)}</div>
            <div className="m3-stat-lbl">Monthly 10%</div>
          </div>
        </div>
      </div>
      <div className="bento-col-3">
        <div className="bento-card" style={{ background: inc.targetMet ? 'var(--sage)' : 'var(--bg)', color: inc.targetMet ? '#fff' : 'var(--ink)' }}>
          <div className="m3-stat">
            <div className="m3-stat-num">{currency(inc.totalIncentive)}</div>
            <div className="m3-stat-lbl" style={{ color: inc.targetMet ? 'rgba(255,255,255,.7)' : undefined }}>
              {inc.isNewJoiner ? 'Incentive (New Joiner)' : 'Total Incentive'}
            </div>
          </div>
        </div>
      </div>
      <div className="bento-col-12">
        <div className="bento-card" style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:'12px 16px' }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700 }}>Need more donor data?</div>
            <div style={{ fontSize:10, color:'var(--md-outline)', marginTop:2 }}>Request additional assignments or data from the NGO admin.</div>
          </div>
          <button onClick={() => setShowRequest(true)}
            style={{ padding:'8px 20px', border:'none', borderRadius:8, background:'var(--sage)', color:'#fff', fontSize:11, fontWeight:700, fontFamily:'inherit', cursor:'pointer', display:'flex', alignItems:'center', gap:6, whiteSpace:'nowrap' }}>
            <span className="material-symbols-outlined" style={{ fontSize:16 }}>add_circle</span>
            Request More Data
          </button>
        </div>
      </div>

      {/* Chart row */}
      <div className="bento-col-7">
        <div className="bento-card">
          <div className="bento-card-h"><h3>Target vs Collection</h3></div>
          <div style={{ width:'100%', height:220 }}>
            <ResponsiveContainer>
              <BarChart data={barData} margin={{ top:8, right:8, left:-8, bottom:4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'k'} />
                <Tooltip formatter={(v) => [currency(v), 'Amount']} contentStyle={{ fontSize:11, borderRadius:8, border:'1px solid #e2e8f0' }} />
                <Bar dataKey="amount" radius={[6,6,0,0]} barSize={48}>
                  {barData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bento-col-5">
        <div className="bento-card">
          <div className="bento-card-h"><h3>Donor Status</h3></div>
          <div style={{ width:'100%', height:220, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontSize:11, borderRadius:8, border:'1px solid #e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ fontSize:11, color:'var(--ink-soft)' }}>No status data</div>
            )}
          </div>
          {pieData.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 10px', marginTop:6, justifyContent:'center' }}>
              {pieData.map(e => (
                <div key={e.name} style={{ display:'flex', alignItems:'center', gap:4, fontSize:9, color:'var(--ink-soft)' }}>
                  <span style={{ width:8, height:8, borderRadius:2, background:e.color, display:'inline-block' }} />
                  {e.name} ({e.value})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Request More Data modal */}
      {showRequest && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,.4)' }} onClick={() => { if (!sending) { setShowRequest(false); setReqDone(false) } }}>
          <div style={{ background:'#fff', borderRadius:12, width:400, padding:20, boxShadow:'0 8px 32px rgba(0,0,0,.15)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>Request More Data</div>
            <div style={{ fontSize:10, color:'var(--ink-soft)', marginBottom:12 }}>Send a request to the NGO admin for additional donor assignments or data.</div>
            {reqDone ? (
              <div style={{ textAlign:'center', padding:'16px 0', color:'var(--sage)', fontWeight:600, fontSize:12 }}>
                <span className="material-symbols-outlined" style={{ fontSize:18, verticalAlign:'middle', marginRight:4 }}>check_circle</span>
                Request sent successfully
              </div>
            ) : (
              <>
                <textarea value={reqMsg} onChange={e => setReqMsg(e.target.value)} rows={4}
                  placeholder="Describe what data you need..."
                  style={{ width:'100%', padding:8, border:'1px solid var(--line)', borderRadius:6, fontSize:11, fontFamily:'inherit', resize:'vertical', boxSizing:'border-box' }} />
                <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:12 }}>
                  <button onClick={() => { setShowRequest(false); setReqMsg('') }}
                    style={{ padding:'7px 16px', border:'1px solid var(--line)', borderRadius:6, background:'#fff', fontSize:11, fontWeight:600, fontFamily:'inherit', cursor:'pointer' }}>Cancel</button>
                  <button onClick={handleSendRequest} disabled={sending || !reqMsg.trim()}
                    style={{ padding:'7px 16px', border:'none', borderRadius:6, background:'var(--sage)', color:'#fff', fontSize:11, fontWeight:700, fontFamily:'inherit', cursor:'pointer', opacity: sending || !reqMsg.trim() ? .5 : 1 }}>
                    {sending ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
