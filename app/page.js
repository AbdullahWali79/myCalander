'use client';
import { useState } from 'react';

const styles = {
  body: { fontFamily: "'DM Sans', sans-serif", background: '#0f1117', color: '#f0f2ff', minHeight: '100vh', margin: 0 },
  topbar: { background: '#1a1d27', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10 },
  logoDot: { width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#5b6ef5,#9b6ef5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 },
  logoText: { fontSize: 15, fontWeight: 600 },
  logoSub: { fontSize: 11, color: '#8890b0' },
  statusRow: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8890b0' },
  main: { maxWidth: 680, margin: '0 auto', padding: '28px 20px 60px' },
  tabs: { display: 'flex', gap: 4, background: '#1a1d27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 5, marginBottom: 24 },
  card: { background: '#1a1d27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px', marginBottom: 12 },
  quickGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 },
  quickBtn: { padding: '14px 16px', background: '#1a1d27', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, cursor: 'pointer', textAlign: 'left', color: '#f0f2ff', transition: 'border-color 0.2s' },
  formGroup: { marginBottom: 14 },
  label: { fontSize: 11, color: '#8890b0', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '11px 13px', background: '#22263a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#f0f2ff', fontFamily: 'inherit', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  submitBtn: { width: '100%', padding: 13, background: 'linear-gradient(135deg,#5b6ef5,#9b6ef5)', border: 'none', borderRadius: 8, color: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  outputBox: { fontSize: 13, color: '#8890b0', lineHeight: 1.8, whiteSpace: 'pre-wrap', minHeight: 60 },
  outputLoaded: { fontSize: 13, color: '#f0f2ff', lineHeight: 1.8, whiteSpace: 'pre-wrap', minHeight: 60 },
  urgentBadge: { display: 'inline-block', background: 'rgba(240,79,92,0.15)', color: '#f04f5c', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 },
  resultSuccess: { marginTop: 12, padding: '14px 18px', background: 'rgba(62,207,142,0.08)', border: '1px solid rgba(62,207,142,0.25)', borderRadius: 14, fontSize: 13, color: '#3ecf8e', whiteSpace: 'pre-wrap' },
  resultError: { marginTop: 12, padding: '14px 18px', background: 'rgba(240,79,92,0.08)', border: '1px solid rgba(240,79,92,0.25)', borderRadius: 14, fontSize: 13, color: '#f04f5c' },
};

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ flex: 1, padding: '9px 10px', border: 'none', background: active ? '#22263a' : 'none', color: active ? '#f0f2ff' : '#8890b0', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer', borderRadius: 10, transition: 'all 0.2s' }}>
      {label}
    </button>
  );
}

export default function Home() {
  const [tab, setTab] = useState('view');
  const [viewOutput, setViewOutput] = useState('');
  const [viewLoading, setViewLoading] = useState(false);
  const [urgentOutput, setUrgentOutput] = useState('');
  const [urgentLoading, setUrgentLoading] = useState(false);
  const [addResult, setAddResult] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [location, setLocation] = useState('');
  const [desc, setDesc] = useState('');
  const [urgent, setUrgent] = useState(false);

  async function callAPI(action, payload = {}) {
    const res = await fetch('/api/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.result;
  }

  async function loadView(action) {
    setViewLoading(true);
    setViewOutput('');
    try {
      const result = await callAPI(action);
      setViewOutput(result);
    } catch (e) {
      setViewOutput('❌ Error: ' + e.message);
    }
    setViewLoading(false);
  }

  async function loadUrgent(action) {
    setUrgentLoading(true);
    setUrgentOutput('');
    try {
      const result = await callAPI(action);
      setUrgentOutput(result);
    } catch (e) {
      setUrgentOutput('❌ Error: ' + e.message);
    }
    setUrgentLoading(false);
  }

  async function addEvent() {
    if (!title || !date || !time) { setAddResult({ type: 'error', text: 'Title, Date aur Time zaroor bharo!' }); return; }
    setAddLoading(true);
    setAddResult(null);
    try {
      const endDate = new Date(`${date}T${time}`);
      endDate.setMinutes(endDate.getMinutes() + parseInt(duration));
      const endTime = endDate.toTimeString().slice(0, 5);
      const result = await callAPI('add', { title, date, startTime: time, endTime, location, description: desc, urgent });
      setAddResult({ type: 'success', text: '✅ ' + result });
      setTitle(''); setTime(''); setLocation(''); setDesc(''); setUrgent(false);
    } catch (e) {
      setAddResult({ type: 'error', text: '❌ ' + e.message });
    }
    setAddLoading(false);
  }

  return (
    <div style={styles.body}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={styles.topbar}>
        <div style={styles.logoRow}>
          <div style={styles.logoDot}>📅</div>
          <div>
            <div style={styles.logoText}>My Calendar Manager</div>
            <div style={styles.logoSub}>Bot Maker by Abdullah</div>
          </div>
        </div>
        <div style={styles.statusRow}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#3ecf8e', boxShadow: '0 0 6px #3ecf8e' }} />
          <span>Connected</span>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.tabs}>
          <Tab label="📋 View" active={tab === 'view'} onClick={() => setTab('view')} />
          <Tab label="➕ Add Event" active={tab === 'add'} onClick={() => setTab('add')} />
          <Tab label="🔴 Urgent" active={tab === 'urgent'} onClick={() => setTab('urgent')} />
        </div>

        {tab === 'view' && (
          <>
            <div style={styles.quickGrid}>
              {[
                { action: 'today', icon: '🗓️', label: "Today's Meetings", desc: 'Aaj ki sari meetings' },
                { action: 'tomorrow', icon: '📅', label: 'Tomorrow', desc: 'Kal ka schedule' },
                { action: 'week', icon: '📆', label: 'This Week', desc: '7 din ki meetings' },
                { action: 'urgent_week', icon: '🔴', label: 'Urgent Only', desc: 'Sirf urgent meetings' },
              ].map(({ action, icon, label, desc }) => (
                <button key={action} style={styles.quickBtn} onClick={() => loadView(action)}>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: 11, color: '#8890b0', marginTop: 2 }}>{desc}</div>
                </button>
              ))}
            </div>
            <div style={styles.card}>
              {viewLoading
                ? <div style={{ color: '#8890b0', fontSize: 13 }}>⏳ Loading...</div>
                : <div style={viewOutput ? styles.outputLoaded : styles.outputBox}>{viewOutput || 'Upar se koi button click karo meetings dekhne ke liye...'}</div>
              }
            </div>
          </>
        )}

        {tab === 'add' && (
          <>
            <div style={styles.card}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Meeting Title *</label>
                <input style={styles.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Client call with Ahmed bhai" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Date *</label>
                  <input style={styles.input} type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Start Time *</label>
                  <input style={styles.input} type="time" value={time} onChange={e => setTime(e.target.value)} />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Duration</label>
                <select style={styles.input} value={duration} onChange={e => setDuration(e.target.value)}>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location (optional)</label>
                <input style={styles.input} value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Zoom, Office, Lahore" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description (optional)</label>
                <textarea style={{ ...styles.input, height: 80, resize: 'vertical' }} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Meeting agenda ya notes..." />
              </div>
              <div onClick={() => setUrgent(!urgent)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 8, border: `1px solid ${urgent ? 'rgba(240,79,92,0.4)' : 'rgba(255,255,255,0.08)'}`, background: urgent ? 'rgba(240,79,92,0.06)' : 'none', marginBottom: 14, cursor: 'pointer' }}>
                <input type="checkbox" checked={urgent} onChange={() => setUrgent(!urgent)} style={{ width: 16, height: 16, accentColor: '#f04f5c' }} onClick={e => e.stopPropagation()} />
                <label style={{ fontSize: 13, cursor: 'pointer' }}>Mark as <span style={styles.urgentBadge}>URGENT</span></label>
              </div>
              <button style={styles.submitBtn} onClick={addEvent} disabled={addLoading}>
                {addLoading ? 'Adding...' : 'Add to Google Calendar →'}
              </button>
            </div>
            {addResult && (
              <div style={addResult.type === 'success' ? styles.resultSuccess : styles.resultError}>
                {addResult.text}
              </div>
            )}
          </>
        )}

        {tab === 'urgent' && (
          <>
            <div style={{ background: 'rgba(240,79,92,0.07)', border: '1px solid rgba(240,79,92,0.2)', borderRadius: 14, padding: '14px 18px', marginBottom: 16, fontSize: 13, color: '#f08090', lineHeight: 1.7 }}>
              🔴 Sirf un meetings ko filter karta hai jisme <strong>urgent</strong>, <strong>important</strong>, ya <strong>ASAP</strong> likha ho.
            </div>
            <div style={styles.quickGrid}>
              <button style={styles.quickBtn} onClick={() => loadUrgent('urgent_week')}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>📋</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Urgent This Week</div>
                <div style={{ fontSize: 11, color: '#8890b0', marginTop: 2 }}>7 din ki urgent list</div>
              </button>
              <button style={styles.quickBtn} onClick={() => loadUrgent('urgent_month')}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>🗂️</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Urgent This Month</div>
                <div style={{ fontSize: 11, color: '#8890b0', marginTop: 2 }}>30 din urgent</div>
              </button>
            </div>
            <div style={styles.card}>
              {urgentLoading
                ? <div style={{ color: '#8890b0', fontSize: 13 }}>⏳ Loading...</div>
                : <div style={urgentOutput ? styles.outputLoaded : styles.outputBox}>{urgentOutput || 'Button click karo urgent meetings dekhne ke liye...'}</div>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}
