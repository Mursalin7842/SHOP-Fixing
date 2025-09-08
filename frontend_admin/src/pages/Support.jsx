import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import { FETCH_TICKETS_REQUEST, FETCH_TICKETS_SUCCESS, FETCH_TICKETS_FAILURE, ADD_TICKET_MESSAGE, UPDATE_TICKET_STATUS } from '../constants/actionTypes';

const Support = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeId, setActiveId] = useState(null);
  const dispatch = useDispatch();
  const { loading, tickets, error } = useSelector(s => s.support);

  useEffect(() => {
    dispatch({ type: FETCH_TICKETS_REQUEST });
    try {
      dispatch({ type: FETCH_TICKETS_SUCCESS, payload: tickets });
    } catch (e) {
      dispatch({ type: FETCH_TICKETS_FAILURE, payload: e.message || 'Failed to fetch tickets' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const filtered = useMemo(() => (tickets || []).filter(t => [t.id, t.shop, t.subject].some(f => (f||'').toLowerCase().includes(searchTerm.toLowerCase()))), [tickets, searchTerm]);
  const active = useMemo(() => (tickets || []).find(t => t.id === activeId) || filtered[0] || null, [tickets, filtered, activeId]);

  const [msg, setMsg] = useState('');
  const sendMessage = () => {
    if (!active || !msg.trim()) return;
    dispatch({ type: ADD_TICKET_MESSAGE, payload: { id: active.id, message: { from: 'admin', text: msg.trim(), date: new Date().toISOString().slice(0,10) } } });
    setMsg('');
  };

  return (
    <div className="rounded-lg shadow-lg card" style={{ backgroundColor: 'var(--component-bg)', color: 'var(--component-text)' }}>
      <div className="p-6 border-b flex flex-wrap gap-4 justify-between items-center" style={{ borderColor: 'var(--purple-light)' }}>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--purple-light)' }}>Support</h2>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search tickets..." />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <div className="lg:col-span-1 overflow-y-auto max-h-[70vh] border rounded" style={{ borderColor: 'var(--border-color)' }}>
          <table className="w-full text-left">
            <thead><tr className="bg-[var(--table-header-bg)]"><th className="p-2">Ticket</th><th className="p-2">Shop</th><th className="p-2">Status</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="text-center p-8" style={{ color: 'var(--muted-text)' }}>Loading…</td></tr>
              ) : error ? (
                <tr><td colSpan="3" className="text-center p-8 text-red-500">{error}</td></tr>
              ) : filtered.map(t => (
                <tr key={t.id} onClick={() => setActiveId(t.id)} className={`border-b hover:bg-[var(--table-row-hover)] cursor-pointer ${active?.id===t.id?'bg-[var(--surface-2)]':''}`} style={{ borderColor: 'var(--border-color)' }}>
                  <td className="p-2 font-mono">{t.id}</td>
                  <td className="p-2">{t.shop}</td>
                  <td className="p-2 text-sm">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="lg:col-span-2">
          {!active ? (
            <div className="h-full flex items-center justify-center text-[var(--muted-text)]">Select a ticket to view conversation</div>
          ) : (
            <div className="flex flex-col h-[70vh]">
              <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="font-semibold">{active.subject}</div>
                <div className="text-sm text-[var(--muted-text)]">{active.shop} • {active.id} • Status: {active.status}</div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {active.messages.map((m, idx) => (
                  <div key={idx} className={`p-3 rounded max-w-[75%] ${m.from==='admin'?'ml-auto bg-[var(--surface-2)]':'bg-[var(--surface-3)]'}`}>
                    <div className="text-xs text-[var(--muted-text)] mb-1">{m.from} • {m.date}</div>
                    <div className="text-sm">{m.text}</div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t flex items-center gap-2" style={{ borderColor: 'var(--border-color)' }}>
                <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type a message..." className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
                <Button color="primary" onClick={sendMessage}>Send</Button>
                <Button color="gray" onClick={() => dispatch({ type: UPDATE_TICKET_STATUS, payload: { id: active.id, status: active.status === 'open' ? 'closed' : 'open' } })}>{active.status === 'open' ? 'Close' : 'Reopen'}</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
