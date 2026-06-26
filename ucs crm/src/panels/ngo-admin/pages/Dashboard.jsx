import { useState, useEffect } from 'react';
import { apiGet } from '../api/auth';

const DISPOSITION_ORDER = [
  'donation_collected', 'promise_to_pay', 'lead_done', 'visit_donate', 'payment_pending', 'already_donated',
  'pending', 'contacted', 'follow_up', 'scheduled',
  'not_interested', 'not_interested_now', 'rejected', 'busy', 'ringing',
  'unreachable', 'switched_off', 'wrong_number', 'invalid_number', 'language_barrier',
  'transferred_senior', 'query_complaint', 'receipt_request',
];

const DISPOSITION_LABELS = {
  pending: 'Pending', contacted: 'Contacted', follow_up: 'Follow Up', scheduled: 'Scheduled',
  busy: 'Busy', ringing: 'Ringing', unreachable: 'Unreachable', switched_off: 'Switched Off',
  wrong_number: 'Wrong Number', invalid_number: 'Invalid', rejected: 'Rejected',
  lead_done: 'Lead Done', visit_donate: 'Visit & Donate', promise_to_pay: 'Promise to Pay',
  payment_pending: 'Payment Pending', already_donated: 'Already Donated',
  not_interested: 'Not Interested', not_interested_now: 'Not Interested Now',
  language_barrier: 'Language Barrier', transferred_senior: 'Transferred to Senior',
  query_complaint: 'Query/Complaint', receipt_request: 'Receipt Request',
  donation_collected: 'Donation Collected',
};

const STATUS_COLORS = {
  donation_collected: '#22c55e',
  promise_to_pay: '#22c55e',
  lead_done: '#22c55e',
  visit_donate: '#22c55e',
  payment_pending: '#22c55e',
  already_donated: '#22c55e',
  pending: '#f59e0b',
  contacted: '#f59e0b',
  follow_up: '#f59e0b',
  scheduled: '#f59e0b',
  transferred_senior: '#3b82f6',
  query_complaint: '#3b82f6',
  receipt_request: '#3b82f6',
};

const getStatusColor = (status) => STATUS_COLORS[status] || '#ef4444';

const DISPOSITION_GROUPS = [
  { label: 'Converted', color: '#16a34a', bg: '#f0fdf4', statuses: ['donation_collected', 'promise_to_pay', 'lead_done', 'visit_donate', 'payment_pending', 'already_donated'] },
  { label: 'In Progress', color: '#d97706', bg: '#fffbeb', statuses: ['pending', 'contacted', 'follow_up', 'scheduled'] },
  { label: 'Negative', color: '#dc2626', bg: '#fef2f2', statuses: ['not_interested', 'not_interested_now', 'rejected', 'busy', 'ringing', 'unreachable', 'switched_off', 'wrong_number', 'invalid_number', 'language_barrier'] },
  { label: 'Other', color: '#6366f1', bg: '#eef2ff', statuses: ['transferred_senior', 'query_complaint', 'receipt_request'] },
];

const CARDS = [
  { label: 'Total Donors', key: 'total_donors', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
  { label: 'Assigned Donors', key: 'assigned_donors', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 3.13 19 6.13 22 3.13" /></svg> },
  { label: 'Active FRO Workers', key: 'active_fros', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
  { label: 'Month Collection', key: 'month_collection', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', format: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg> },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [stationStats, setStationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedStation, setExpandedStation] = useState(null);

  useEffect(() => {
    Promise.all([
      apiGet('/ngo-admin/dashboard'),
      apiGet('/ngo-admin/dashboard/station-stats'),
    ])
      .then(([d, s]) => { setData(d); setStationStats(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!data) return <div className="empty-state"><p>Could not load dashboard data.</p></div>;

  const stations = stationStats?.stations || {};
  const summary = stationStats?.summary || {};
  const stationNames = Object.keys(stations).sort((a, b) => {
    const idxA = a.lastIndexOf('-'), idxB = b.lastIndexOf('-');
    const numA = idxA > 0 ? parseInt(a.slice(idxA + 1)) || 0 : 0;
    const numB = idxB > 0 ? parseInt(b.slice(idxB + 1)) || 0 : 0;
    const preA = idxA > 0 ? a.slice(0, idxA) : a;
    const preB = idxB > 0 ? b.slice(0, idxB) : b;
    if (preA !== preB) return preA.localeCompare(preB);
    return numA - numB;
  });

  const getCell = (station, status) => stations[station]?.[status] || 0;
  const getStationTotal = (station) => Object.values(stations[station] || {}).reduce((t, v) => t + v, 0);
  const grandTotal = stationNames.reduce((t, s) => t + getStationTotal(s), 0);

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16, marginBottom: 24,
      }}>
        {CARDS.map((card, i) => {
          const val = card.format ? card.format(data[card.key]) : data[card.key];
          return (
            <div key={i} style={{
              position: 'relative', background: '#fff', borderRadius: 16, padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden', cursor: 'default',
              transition: 'transform .2s ease, box-shadow .2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}>
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 100, height: 100,
                borderRadius: '0 16px 0 80px', background: card.gradient, opacity: 0.08,
              }} />
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: card.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 16,
              }}>
                {card.icon}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e', lineHeight: 1.2 }}>{val}</div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4, fontWeight: 500 }}>{card.label}</div>
            </div>
          );
        })}
      </div>

      {stationNames.length > 0 && (
        <div className="card" style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <div className="card-head" style={{ padding: '16px 20px', borderBottom: '1px solid var(--line, #e5e7eb)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
              <h3 style={{ margin: 0, fontSize: 15 }}>Station Overview</h3>
            </div>
            <span className="count" style={{ background: '#eef2ff', color: '#6366f1', fontSize: 12, padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>
              {stationNames.length} stations · {grandTotal} donors
            </span>
          </div>
          <div className="card-pad" style={{ padding: '16px 20px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 12,
            }}>
              {stationNames.map(st => {
                const total = getStationTotal(st);
                const groupCounts = DISPOSITION_GROUPS.map(g => ({
                  ...g,
                  count: g.statuses.reduce((t, s) => t + getCell(st, s), 0),
                }));
                const maxGroup = groupCounts.reduce((m, g) => Math.max(m, g.count), 0);
                return (
                  <div key={st} style={{
                    background: '#fafbfc', borderRadius: 12, padding: '14px 16px',
                    border: '1px solid var(--line, #e5e7eb)', cursor: 'pointer',
                    transition: 'box-shadow .15s, border-color .15s',
                  }}
                    onClick={() => setExpandedStation(expandedStation === st ? null : st)}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(99,102,241,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{st}</span>
                      <span style={{ fontWeight: 800, fontSize: 15, color: '#6366f1' }}>{total}</span>
                    </div>

                    <div style={{ height: 6, borderRadius: 3, background: '#f1f5f9', display: 'flex', overflow: 'hidden', marginBottom: 10 }}>
                      {groupCounts.map((g, i) => g.count > 0 && (
                        <div key={g.label} style={{
                          width: `${(g.count / total) * 100}%`, height: '100%',
                          background: g.color, opacity: 0.6,
                          borderRight: i < groupCounts.length - 1 ? '1px solid #fff' : 'none',
                        }} />
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {groupCounts.filter(g => g.count > 0).map(g => (
                        <span key={g.label} style={{
                          fontSize: 11, color: g.color, fontWeight: 600,
                          background: g.bg, padding: '1px 8px', borderRadius: 10,
                        }}>
                          {g.label}: {g.count}
                        </span>
                      ))}
                    </div>

                    {expandedStation === st && (
                      <div style={{ marginTop: 12, borderTop: '1px solid var(--line, #e5e7eb)', paddingTop: 10 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: 12 }}>
                          {DISPOSITION_GROUPS.map(g => {
                            const visibileStatuses = g.statuses.filter(s => getCell(st, s) > 0);
                            if (visibileStatuses.length === 0) return null;
                            return (
                              <div key={g.label} style={{ gridColumn: '1 / -1', marginTop: 4 }}>
                                <span style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', color: g.color }}>{g.label}</span>
                              </div>
                            );
                          })}
                          {DISPOSITION_GROUPS.flatMap(g =>
                            g.statuses.filter(s => getCell(st, s) > 0).map(s => (
                              <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                                <span style={{ color: '#64748b' }}>{DISPOSITION_LABELS[s] || s}</span>
                                <span style={{ fontWeight: 700, color: getStatusColor(s) }}>{getCell(st, s)}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
      }}>
        {DISPOSITION_GROUPS.map(group => {
          const items = group.statuses
            .map(s => ({ status: s, total: summary[s] || 0 }))
            .filter(x => x.total > 0);
          if (items.length === 0) return null;
          const groupTotal = items.reduce((t, x) => t + x.total, 0);
          return (
            <div key={group.label} className="card" style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="card-head" style={{ padding: '12px 16px', borderBottom: `2px solid ${group.color}20` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: group.color }} />
                  <h3 style={{ margin: 0, fontSize: 14, color: group.color }}>{group.label}</h3>
                </div>
                <span style={{ fontWeight: 800, fontSize: 16, color: group.color }}>{groupTotal}</span>
              </div>
              <div className="card-pad" style={{ padding: '8px 16px 12px' }}>
                {items.map(({ status, total }) => {
                  const pct = groupTotal > 0 ? (total / groupTotal) * 100 : 0;
                  return (
                    <div key={status} style={{ marginBottom: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
                        <span style={{ color: '#475569' }}>{DISPOSITION_LABELS[status] || status}</span>
                        <span style={{ fontWeight: 700, color: getStatusColor(status) }}>{total}</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: '#f1f5f9', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: group.color, opacity: 0.5 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
