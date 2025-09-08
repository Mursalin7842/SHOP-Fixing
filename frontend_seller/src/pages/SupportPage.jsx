import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import { createTicket, addMessage, closeTicket, reopenTicket, setTicketPriority } from '../features/supportSlice';

const SupportPage = () => {
  const dispatch = useDispatch();
  const { tickets } = useSelector(s => s.support);
  const activeShopId = useSelector(s => s.shops.activeShopId);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('open'); // open | closed | all
  const [category, setCategory] = useState('all'); // all | Payouts | Orders | Products | Shops | Other
  const [priorityFilter, setPriorityFilter] = useState('all'); // all | Low | Medium | High
  const [selectedId, setSelectedId] = useState(null);

  const scoped = useMemo(() => tickets.filter(t => !activeShopId || t.shopId === activeShopId), [tickets, activeShopId]);
  const filtered = useMemo(() => scoped.filter(t => {
    if (status !== 'all' && t.status !== status) return false;
    if (category !== 'all' && t.category !== category) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (query && !(`${t.subject} ${t.category}`.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  }), [scoped, status, category, priorityFilter, query]);

  const selected = filtered.find(t => t.id === selectedId) || filtered[0] || null;

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Ticket List & Filters */}
      <div className="lg:col-span-1 space-y-4">
        <div className="card elevated-card rounded-lg shadow-lg">
          <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
            <h2 className="text-xl font-bold">Support Tickets</h2>
            <NewTicketButton onCreated={(id) => setSelectedId(id)} />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search subject/category" className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] rounded px-3 py-2" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select value={status} onChange={e=>setStatus(e.target.value)} className="bg-[var(--input-bg)] text-[var(--input-text)] rounded px-2 py-2">
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="all">All</option>
              </select>
              <select value={category} onChange={e=>setCategory(e.target.value)} className="bg-[var(--input-bg)] text-[var(--input-text)] rounded px-2 py-2">
                {['all','Payouts','Orders','Products','Shops','Other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={priorityFilter} onChange={e=>setPriorityFilter(e.target.value)} className="bg-[var(--input-bg)] text-[var(--input-text)] rounded px-2 py-2">
                {['all','Low','Medium','High'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="max-h-[520px] overflow-y-auto divide-y divide-[var(--border-color)]">
            {filtered.map(t => (
              <button key={t.id} onClick={()=>setSelectedId(t.id)} className={`w-full text-left p-4 hover:bg-[var(--table-row-hover)] ${selected?.id===t.id? 'bg-[var(--surface-2)]' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold truncate">{t.subject}</div>
                  <span className={`text-xs px-2 py-1 rounded ${t.status==='open'? 'bg-green-900/20 border border-green-700' : 'bg-[var(--surface-2)] border border-[var(--border-color)]'}`}>{t.status}</span>
                </div>
                <div className="text-xs text-[var(--muted-text)] mt-1">{t.category} • Priority: {t.priority} • #{t.id}</div>
              </button>
            ))}
            {filtered.length===0 && (
              <div className="p-4 text-[var(--muted-text)]">No tickets match your filters.</div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Ticket Thread */}
      <div className="lg:col-span-2">
        {selected ? (
          <div className="card elevated-card rounded-lg shadow-lg">
            <div className="p-4 border-b border-[var(--border-color)] flex flex-wrap gap-3 items-center justify-between">
              <div>
                <div className="text-xl font-bold">{selected.subject}</div>
                <div className="text-sm text-[var(--muted-text)]">{selected.category} • Priority:
                  <select className="ml-2 bg-[var(--input-bg)] text-[var(--input-text)] rounded px-2 py-1" value={selected.priority} onChange={e=>dispatch(setTicketPriority({ ticketId: selected.id, priority: e.target.value }))}>
                    {['Low','Medium','High'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selected.status === 'open' ? (
                  <Button color="red" onClick={()=>dispatch(closeTicket({ ticketId: selected.id }))}>Close</Button>
                ) : (
                  <Button color="green" onClick={()=>dispatch(reopenTicket({ ticketId: selected.id }))}>Reopen</Button>
                )}
              </div>
            </div>
            <div className="p-4 space-y-4 max-h-[520px] overflow-y-auto">
              {(selected.messages || []).map(m => (
                <div key={m.id} className={`p-3 rounded border ${m.from==='seller'? 'bg-[var(--surface-2)] border-[var(--border-color)]' : 'bg-blue-900/10 border-blue-800'}`}>
                  <div className="text-xs text-[var(--muted-text)]">{m.from} • {m.date}</div>
                  <div>{m.text}</div>
                </div>
              ))}
              {selected.messages?.length===0 && <div className="text-[var(--muted-text)]">No messages yet.</div>}
            </div>
            <MessageComposer ticket={selected} />
          </div>
        ) : (
          <div className="card elevated-card rounded-lg shadow-lg p-6"><div className="text-[var(--muted-text)]">Select or create a ticket to view the conversation.</div></div>
        )}
      </div>
    </div>
  );
};

const NewTicketButton = ({ onCreated }) => {
  const dispatch = useDispatch();
  const activeShopId = useSelector(s => s.shops.activeShopId);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Payouts');
  const [priority, setPriority] = useState('Low');
  const [message, setMessage] = useState('');

  const create = (e) => {
    e.preventDefault();
    if (!activeShopId) { alert('Please select an approved active shop.'); return; }
    if (!subject.trim()) return;
    const id = 'SUP-' + Date.now();
    dispatch(createTicket({ shopId: activeShopId, subject: subject.trim(), category, priority, message: message.trim() }));
    setOpen(false); setSubject(''); setMessage('');
    onCreated && onCreated(id);
  };

  return (
    <>
      <Button color="primary" onClick={()=>setOpen(true)}>New</Button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card elevated-card rounded-lg shadow-xl w-full max-w-xl">
            <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
              <div className="text-xl font-bold">New Support Ticket</div>
              <button onClick={()=>setOpen(false)} className="text-[var(--muted-text)]">✕</button>
            </div>
            <form onSubmit={create} className="p-4 space-y-4">
              <div>
                <label className="block text-[var(--muted-text)] mb-1">Subject</label>
                <input value={subject} onChange={e=>setSubject(e.target.value)} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded px-3 py-2" placeholder="Brief summary" required />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[var(--muted-text)] mb-1">Category</label>
                  <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded px-3 py-2">
                    {['Payouts','Orders','Products','Shops','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--muted-text)] mb-1">Priority</label>
                  <select value={priority} onChange={e=>setPriority(e.target.value)} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded px-3 py-2">
                    {['Low','Medium','High'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[var(--muted-text)] mb-1">Message</label>
                <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={5} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded px-3 py-2" placeholder="Describe your issue"></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <Button color="gray" type="button" onClick={()=>setOpen(false)}>Cancel</Button>
                <Button color="primary" type="submit">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const MessageComposer = ({ ticket }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); if (!text.trim()) return; dispatch(addMessage({ ticketId: ticket.id, text: text.trim(), from: 'seller' })); setText(''); }} className="p-4 border-t border-[var(--border-color)] flex gap-2">
      <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 bg-[var(--input-bg)] text-[var(--input-text)] rounded px-3 py-2" placeholder={ticket.status==='closed'? 'Ticket is closed' : 'Type a message to support...'} disabled={ticket.status==='closed'} />
      <Button color="gray" type="submit" disabled={ticket.status==='closed' || !text.trim()}>Send</Button>
    </form>
  );
};

export default SupportPage;
