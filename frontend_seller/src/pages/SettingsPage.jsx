import React, { useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import { updateProfile, setAvatar, setPasswordMeta } from '../features/profileSlice';
import {
  addBankAccount,
  removeBankAccount,
  setDefaultBankAccount,
  addMobileWallet,
  removeMobileWallet,
  setDefaultMobileWallet,
  addCard,
  removeCard,
  setDefaultCard,
} from '../features/payoutSlice';

const Section = ({ title, subtitle, children, actions }) => (
  <div className="rounded-lg shadow-lg p-6 space-y-6 card elevated-card">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && <p className="text-xs text-[var(--muted-text)] mt-1">{subtitle}</p>}
      </div>
      {actions}
    </div>
    {children}
  </div>
);

const Tab = ({ id, active, onClick, children }) => (
  <button onClick={() => onClick(id)} className={`px-4 py-2 rounded-t-md border-b-2 text-sm font-medium ${active ? 'border-[var(--accent)] text-[var(--text)]' : 'border-transparent text-[var(--muted-text)] hover:text-[var(--text)]'}`}>
    {children}
  </button>
);

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Lightweight modal for details
const DetailsModal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[95%] max-w-lg rounded-lg card elevated-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          <Button color="gray" className="!py-1 !px-3" onClick={onClose}>Close</Button>
        </div>
        {children}
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const dispatch = useDispatch();
  const activeShopId = useSelector(s => s.shops.activeShopId);
  const canEdit = !!activeShopId; // allow edits when a shop is active

  const profile = useSelector(s => s.profile);
  const payouts = useSelector(s => s.payouts);

  const [tab, setTab] = useState('profile');

  // profile refs
  const nameRef = useRef();
  const phoneRef = useRef();
  const avatarInputRef = useRef();

  const hasPaymentMethods = useMemo(() => {
    const { banks = [], mobileWallets = [], cards = [] } = payouts.paymentMethods || {};
    return (banks.length + mobileWallets.length + cards.length) > 0;
  }, [payouts.paymentMethods]);

  const onSaveProfile = () => {
    if (!canEdit) return;
    dispatch(updateProfile({ name: nameRef.current.value, phone: phoneRef.current.value }));
  };

  const onAvatarChange = async (e) => {
    if (!canEdit) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataURL(file);
    dispatch(setAvatar(dataUrl));
  };

  const onResetPassword = () => {
    if (!canEdit) return;
    dispatch(setPasswordMeta({ lastChangedAt: new Date().toISOString() }));
    alert('Password reset link sent to your email (mock)');
  };

  // Payment methods handlers
  const [bankDraft, setBankDraft] = useState({ bankName: '', accountNumber: '', routingNumber: '', holderName: '' });
  const [walletDraft, setWalletDraft] = useState({ provider: '', walletNumber: '', holderName: '' });
  const [cardDraft, setCardDraft] = useState({ brand: '', cardNumber: '', holderName: '', expMonth: '', expYear: '' });

  const addBank = () => {
    if (!canEdit) return;
    const { bankName, accountNumber, routingNumber, holderName } = bankDraft;
    if (!bankName || !accountNumber || !routingNumber || !holderName) return;
    dispatch(addBankAccount({ bankName, accountNumber, routingNumber, holderName }));
    setBankDraft({ bankName: '', accountNumber: '', routingNumber: '', holderName: '' });
  };
  const addWallet = () => {
    if (!canEdit) return;
    const { provider, walletNumber, holderName } = walletDraft;
    if (!provider || !walletNumber || !holderName) return;
    dispatch(addMobileWallet({ provider, walletNumber, holderName }));
    setWalletDraft({ provider: '', walletNumber: '', holderName: '' });
  };
  const addCardFn = () => {
    if (!canEdit) return;
    const { brand, cardNumber, holderName, expMonth, expYear } = cardDraft;
    if (!brand || !cardNumber || !holderName || !expMonth || !expYear) return;
    dispatch(addCard({ brand, cardNumber, holderName, expMonth, expYear }));
    setCardDraft({ brand: '', cardNumber: '', holderName: '', expMonth: '', expYear: '' });
  };

  // Details modal state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [details, setDetails] = useState({ type: null, data: null });
  const [reveal, setReveal] = useState({ account: false, routing: false, wallet: false });

  const pm = payouts.paymentMethods || { banks: [], mobileWallets: [], cards: [] };

  const openDetails = (type, data) => {
    setDetails({ type, data });
    setReveal({ account: false, routing: false, wallet: false });
    setDetailsOpen(true);
  };

  const mask = (val = '', visible = false) => {
    if (!val) return '';
    if (visible) return val;
    const str = String(val);
    if (str.length <= 4) return '•'.repeat(Math.max(0, str.length - 1)) + str.slice(-1);
    return '•'.repeat(Math.max(0, str.length - 4)) + str.slice(-4);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-end gap-2 border-b border-[var(--border-color)]">
        <Tab id="profile" active={tab==='profile'} onClick={setTab}>Profile</Tab>
        <Tab id="security" active={tab==='security'} onClick={setTab}>Security</Tab>
        <Tab id="payments" active={tab==='payments'} onClick={setTab}>Payout Methods</Tab>
      </div>

      {tab === 'profile' && (
        <Section title="Profile" subtitle={!canEdit ? 'Select an approved active shop to enable edits.' : ''} actions={
          <Button color="primary" onClick={onSaveProfile} disabled={!canEdit}>Save</Button>
        }>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[var(--muted-text)]">Full Name</label>
                <input ref={nameRef} type="text" defaultValue={profile.name} disabled={!canEdit} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 disabled:opacity-60" />
              </div>
              <div>
                <label className="block text-[var(--muted-text)]">Email</label>
                <input type="email" value={profile.email} disabled className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 disabled:opacity-60" />
                <p className="text-xs text-[var(--muted-text)] mt-1">Email is managed by admin.</p>
              </div>
              <div>
                <label className="block text-[var(--muted-text)]">Phone</label>
                <input ref={phoneRef} type="tel" defaultValue={profile.phone} disabled={!canEdit} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 disabled:opacity-60" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-[var(--surface-2)] overflow-hidden border border-[var(--border-color)]">
                {profile.avatarDataUrl ? (
                  <img src={profile.avatarDataUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--muted-text)] text-xs">No photo</div>
                )}
              </div>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
              <Button color="gray" onClick={() => avatarInputRef.current?.click()} disabled={!canEdit}>Upload Photo</Button>
            </div>
          </div>
        </Section>
      )}

      {tab === 'security' && (
        <Section title="Security" subtitle={!canEdit ? 'Select an approved active shop to enable actions.' : ''} actions={
          <Button color="red" onClick={onResetPassword} disabled={!canEdit}>Send Reset Link</Button>
        }>
          <div className="text-sm text-[var(--muted-text)]">
            Last password change: {profile.passwordMeta?.lastChangedAt ? new Date(profile.passwordMeta.lastChangedAt).toLocaleString() : 'Never'}
          </div>
          <div className="text-xs text-[var(--muted-text)]">We will send a password reset link to your email.</div>
        </Section>
      )}

      {tab === 'payments' && (
        <Section title="Payout Methods" subtitle="Manage where you receive payouts.">
          {!hasPaymentMethods && (
            <div className="p-3 rounded bg-[var(--surface-2)] border border-[var(--border-color)] text-sm text-[var(--muted-text)]">No payout methods yet. Add one below.</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold">Bank Accounts</h3>
              {(pm.banks || []).map(b => (
                <div key={b.id} className="p-3 rounded border border-[var(--border-color)] bg-[var(--surface-2)] flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <div>{b.bankName} •••• {String(b.accountNumber).slice(-4)}</div>
                    <div className="text-xs text-[var(--muted-text)]">{b.holderName} {b.isDefault ? '• Default' : ''}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button color="gray" className="!py-1 !px-2 text-xs" onClick={() => openDetails('bank', b)}>View</Button>
                    {!b.isDefault && <Button color="yellow" className="!py-1 !px-2 text-xs" onClick={() => dispatch(setDefaultBankAccount(b.id))}>Set Default</Button>}
                    <Button color="red" className="!py-1 !px-2 text-xs" onClick={() => dispatch(removeBankAccount(b.id))}>Remove</Button>
                  </div>
                </div>
              ))}
              <div className="p-3 rounded border border-dashed border-[var(--border-color)] bg-[var(--surface-1)] space-y-2">
                <input placeholder="Bank Name" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={bankDraft.bankName} onChange={e => setBankDraft(v => ({ ...v, bankName: e.target.value }))} disabled={!canEdit} />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Account Number" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={bankDraft.accountNumber} onChange={e => setBankDraft(v => ({ ...v, accountNumber: e.target.value }))} disabled={!canEdit} />
                  <input placeholder="Routing Number" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={bankDraft.routingNumber} onChange={e => setBankDraft(v => ({ ...v, routingNumber: e.target.value }))} disabled={!canEdit} />
                </div>
                <input placeholder="Account Holder Name" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={bankDraft.holderName} onChange={e => setBankDraft(v => ({ ...v, holderName: e.target.value }))} disabled={!canEdit} />
                <div className="flex justify-end">
                  <Button color="green" onClick={addBank} disabled={!canEdit}>Add Bank</Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Mobile Wallets</h3>
              {(pm.mobileWallets || []).map(w => (
                <div key={w.id} className="p-3 rounded border border-[var(--border-color)] bg-[var(--surface-2)] flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <div>{w.provider} {w.walletNumber}</div>
                    <div className="text-xs text-[var(--muted-text)]">{w.holderName} {w.isDefault ? '• Default' : ''}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button color="gray" className="!py-1 !px-2 text-xs" onClick={() => openDetails('wallet', w)}>View</Button>
                    {!w.isDefault && <Button color="yellow" className="!py-1 !px-2 text-xs" onClick={() => dispatch(setDefaultMobileWallet(w.id))}>Set Default</Button>}
                    <Button color="red" className="!py-1 !px-2 text-xs" onClick={() => dispatch(removeMobileWallet(w.id))}>Remove</Button>
                  </div>
                </div>
              ))}
              <div className="p-3 rounded border border-dashed border-[var(--border-color)] bg-[var(--surface-1)] space-y-2">
                <input placeholder="Provider (e.g., bKash, Paytm)" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={walletDraft.provider} onChange={e => setWalletDraft(v => ({ ...v, provider: e.target.value }))} disabled={!canEdit} />
                <input placeholder="Wallet Number" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={walletDraft.walletNumber} onChange={e => setWalletDraft(v => ({ ...v, walletNumber: e.target.value }))} disabled={!canEdit} />
                <input placeholder="Holder Name" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={walletDraft.holderName} onChange={e => setWalletDraft(v => ({ ...v, holderName: e.target.value }))} disabled={!canEdit} />
                <div className="flex justify-end">
                  <Button color="green" onClick={addWallet} disabled={!canEdit}>Add Wallet</Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Cards</h3>
              {(pm.cards || []).map(c => (
                <div key={c.id} className="p-3 rounded border border-[var(--border-color)] bg-[var(--surface-2)] flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <div>{c.brand} **** {c.last4}</div>
                    <div className="text-xs text-[var(--muted-text)]">{c.holderName} • {String(c.expMonth).padStart(2, '0')}/{String(c.expYear).slice(-2)} {c.isDefault ? '• Default' : ''}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button color="gray" className="!py-1 !px-2 text-xs" onClick={() => openDetails('card', c)}>View</Button>
                    {!c.isDefault && <Button color="yellow" className="!py-1 !px-2 text-xs" onClick={() => dispatch(setDefaultCard(c.id))}>Set Default</Button>}
                    <Button color="red" className="!py-1 !px-2 text-xs" onClick={() => dispatch(removeCard(c.id))}>Remove</Button>
                  </div>
                </div>
              ))}
              <div className="p-3 rounded border border-dashed border-[var(--border-color)] bg-[var(--surface-1)] space-y-2">
                <input placeholder="Brand (Visa/Mastercard)" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={cardDraft.brand} onChange={e => setCardDraft(v => ({ ...v, brand: e.target.value }))} disabled={!canEdit} />
                <input placeholder="Card Number" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={cardDraft.cardNumber} onChange={e => setCardDraft(v => ({ ...v, cardNumber: e.target.value }))} disabled={!canEdit} />
                <input placeholder="Holder Name" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={cardDraft.holderName} onChange={e => setCardDraft(v => ({ ...v, holderName: e.target.value }))} disabled={!canEdit} />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="MM" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={cardDraft.expMonth} onChange={e => setCardDraft(v => ({ ...v, expMonth: e.target.value }))} disabled={!canEdit} />
                  <input placeholder="YYYY" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={cardDraft.expYear} onChange={e => setCardDraft(v => ({ ...v, expYear: e.target.value }))} disabled={!canEdit} />
                </div>
                <div className="flex justify-end">
                  <Button color="green" onClick={addCardFn} disabled={!canEdit}>Add Card</Button>
                </div>
              </div>
            </div>
          </div>

          <DetailsModal
            open={detailsOpen}
            onClose={() => setDetailsOpen(false)}
            title={details.type === 'bank' ? 'Bank Account Details' : details.type === 'wallet' ? 'Mobile Wallet Details' : details.type === 'card' ? 'Card Details' : 'Details'}
          >
            {details.type === 'bank' && details.data && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[var(--muted-text)]">Bank</span><span>{details.data.bankName}</span></div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[var(--muted-text)]">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span>{mask(details.data.accountNumber, reveal.account)}</span>
                    <Button color="gray" className="!py-1 !px-2 text-xs" onClick={() => setReveal(r => ({ ...r, account: !r.account }))}>{reveal.account ? 'Hide' : 'Show'}</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[var(--muted-text)]">Routing Number</span>
                  <div className="flex items-center gap-2">
                    <span>{mask(details.data.routingNumber, reveal.routing)}</span>
                    <Button color="gray" className="!py-1 !px-2 text-xs" onClick={() => setReveal(r => ({ ...r, routing: !r.routing }))}>{reveal.routing ? 'Hide' : 'Show'}</Button>
                  </div>
                </div>
                <div className="flex justify-between"><span className="text-[var(--muted-text)]">Account Holder</span><span>{details.data.holderName}</span></div>
                {details.data.isDefault && <div className="text-xs text-[var(--muted-text)]">This is your default bank account.</div>}
              </div>
            )}
            {details.type === 'wallet' && details.data && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[var(--muted-text)]">Provider</span><span>{details.data.provider}</span></div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[var(--muted-text)]">Wallet Number</span>
                  <div className="flex items-center gap-2">
                    <span>{mask(details.data.walletNumber, reveal.wallet)}</span>
                    <Button color="gray" className="!py-1 !px-2 text-xs" onClick={() => setReveal(r => ({ ...r, wallet: !r.wallet }))}>{reveal.wallet ? 'Hide' : 'Show'}</Button>
                  </div>
                </div>
                <div className="flex justify-between"><span className="text-[var(--muted-text)]">Holder</span><span>{details.data.holderName}</span></div>
                {details.data.isDefault && <div className="text-xs text-[var(--muted-text)]">This is your default wallet.</div>}
              </div>
            )}
            {details.type === 'card' && details.data && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[var(--muted-text)]">Brand</span><span>{details.data.brand}</span></div>
                <div className="flex justify-between"><span className="text-[var(--muted-text)]">Last 4</span><span>{details.data.last4}</span></div>
                <div className="flex justify-between"><span className="text-[var(--muted-text)]">Holder</span><span>{details.data.holderName}</span></div>
                <div className="flex justify-between"><span className="text-[var(--muted-text)]">Expiry</span><span>{String(details.data.expMonth).padStart(2,'0')}/{String(details.data.expYear).slice(-2)}</span></div>
                <div className="text-xs text-[var(--muted-text)]">For your security, we do not store full card numbers.</div>
                {details.data.isDefault && <div className="text-xs text-[var(--muted-text)]">This is your default card.</div>}
              </div>
            )}
          </DetailsModal>
        </Section>
      )}
    </div>
  );
};

export default SettingsPage;
