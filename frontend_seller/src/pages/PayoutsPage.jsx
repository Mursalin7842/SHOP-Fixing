import React, { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { useDispatch, useSelector } from 'react-redux';
import { requestPayout, cancelPayout } from '../features/payoutSlice';
import Button from '../components/Button';
import { sellerPayoutsApi } from '../api/api';

const currency = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);

const PayoutsPage = () => {
  const dispatch = useDispatch();
  const { balance, pending, history } = useSelector(state => state.payouts);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Bank Transfer');
  const [bankInfo, setBankInfo] = useState({ bank_name: '', account_number: '', routing_number: '', holder_name: '' });
  const [mobileInfo, setMobileInfo] = useState({ mobile_provider: '', mobile_wallet_number: '' });
  const [cardInfo, setCardInfo] = useState({ card_brand: '', card_last4: '' });

  // Load existing payout requests
  useEffect(() => {
    sellerPayoutsApi.list().then(() => {
      // Could hydrate local redux if desired. For now, ignore if structure differs.
    }).catch(() => {});
  }, []);

  const canSubmit = () => {
    const a = Number(amount);
    return a > 0 && a <= balance.available;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit()) return;
    dispatch(requestPayout({ amount: Number(amount), method }));
    // fire backend create
    const payload = { amount: Number(amount), method: method === 'Bank Transfer' ? 'BANK' : method === 'Mobile Wallet' ? 'MOBILE' : 'CARD',
      ...bankInfo, ...mobileInfo, ...cardInfo };
    try { await sellerPayoutsApi.create(payload); } catch { /* ignore */ }
    setAmount('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="card elevated-card p-6"><div className="text-sm text-[var(--muted-text)] mb-1">Total Earned</div><div className="text-2xl font-bold">{currency(balance.totalEarned)}</div></div>
  <div className="card elevated-card p-6"><div className="text-sm text-[var(--muted-text)] mb-1">Available Balance</div><div className="text-2xl font-bold text-green-400">{currency(balance.available)}</div></div>
  <div className="card elevated-card p-6"><div className="text-sm text-[var(--muted-text)] mb-1">Pending Clearance</div><div className="text-2xl font-bold text-yellow-400">{currency(balance.pendingClearance)}</div></div>
      </div>

  <div className="card elevated-card p-6">
        <h2 className="text-xl font-bold mb-4">Request Payout</h2>
  <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-[var(--muted-text)] mb-1">Amount</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="1" step="1" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" placeholder="100" required />
            <p className="text-xs text-[var(--muted-text)] mt-1">Max: {currency(balance.available)}</p>
          </div>
          <div>
            <label className="block text-[var(--muted-text)] mb-1">Method</label>
            <select value={method} onChange={e => setMethod(e.target.value)} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2">
              <option>Bank Transfer</option>
              <option>Mobile Wallet</option>
              <option>PayPal</option>
            </select>
          </div>
          {method === 'Bank Transfer' && (
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
              <input className="bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" placeholder="Bank Name" value={bankInfo.bank_name} onChange={e=>setBankInfo({...bankInfo, bank_name: e.target.value})} />
              <input className="bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" placeholder="Account Number" value={bankInfo.account_number} onChange={e=>setBankInfo({...bankInfo, account_number: e.target.value})} />
              <input className="bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" placeholder="Routing Number" value={bankInfo.routing_number} onChange={e=>setBankInfo({...bankInfo, routing_number: e.target.value})} />
              <input className="bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" placeholder="Account Holder" value={bankInfo.holder_name} onChange={e=>setBankInfo({...bankInfo, holder_name: e.target.value})} />
            </div>
          )}
          {method === 'Mobile Wallet' && (
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" placeholder="Provider (e.g. bKash/Nagad)" value={mobileInfo.mobile_provider} onChange={e=>setMobileInfo({...mobileInfo, mobile_provider: e.target.value})} />
              <input className="bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" placeholder="Wallet Number" value={mobileInfo.mobile_wallet_number} onChange={e=>setMobileInfo({...mobileInfo, mobile_wallet_number: e.target.value})} />
            </div>
          )}
          {method === 'PayPal' && (
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" placeholder="Card Brand" value={cardInfo.card_brand} onChange={e=>setCardInfo({...cardInfo, card_brand: e.target.value})} />
              <input className="bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" placeholder="Card Last 4" value={cardInfo.card_last4} onChange={e=>setCardInfo({...cardInfo, card_last4: e.target.value})} />
            </div>
          )}
          <div className="flex gap-3 md:justify-start justify-stretch">
            <Button color="primary" type="submit" disabled={!canSubmit()}>Request</Button>
            <Button color="gray" type="button" onClick={() => setAmount('')}>Clear</Button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div className="card elevated-card p-6">
          <h3 className="text-lg font-bold mb-4">Pending Requests</h3>
          {pending.length === 0 ? (
            <p className="text-[var(--muted-text)]">No pending payout requests.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--table-header-bg)]">
                    <th className="p-3">ID</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Requested</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map(p => (
                    <tr key={p.id} className="border-b border-[var(--border-color)] hover:bg-[var(--table-row-hover)]">
                      <td className="p-3 font-mono">{p.id}</td>
                      <td className="p-3">{currency(p.amount)}</td>
                      <td className="p-3">{p.method}</td>
                      <td className="p-3">{p.requestedAt}</td>
                      <td className="p-3 text-right align-middle">
                        <Button color="gray" onClick={async () => { dispatch(cancelPayout(p.id)); try { await sellerPayoutsApi.cancel(p.id); } catch { /* ignore */ } }}>Cancel</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
  <div className="card elevated-card p-6">
          <h3 className="text-lg font-bold mb-4">Payout History</h3>
          {history.length === 0 ? (
            <p className="text-[var(--muted-text)]">No payout history yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--table-header-bg)]">
                    <th className="p-3">ID</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Requested</th>
                    <th className="p-3">Processed</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id + h.requestedAt} className="border-b border-[var(--border-color)] hover:bg-[var(--table-row-hover)]">
                      <td className="p-3 font-mono">{h.id}</td>
                      <td className="p-3">{currency(h.amount)}</td>
                      <td className="p-3">{h.method}</td>
                      <td className="p-3">{h.requestedAt}</td>
                      <td className="p-3">{h.processedAt || '-'}</td>
                      <td className="p-3"><StatusBadge status={h.status} /></td>
                      <td className="p-3 text-right align-middle">
                        {h.status === 'Approved' && (
                          <Button color="primary" onClick={async () => { try { await sellerPayoutsApi.confirm(h.id); } catch { /* ignore */ } }}>Withdraw</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayoutsPage;
