import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '../components/Button';
import { requestShop } from '../features/shopsSlice';

const NewShopRequestPage = ({ onBack }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    taxId: '',
    registrationNo: '',
    nid: '',
    tradeLicense: '',
    bankName: '',
    bankAccount: '',
  });
  const [uploads, setUploads] = useState({ nidFile: null, tradeFile: null, otherFiles: [] });

  const submit = (e) => {
    e.preventDefault();
    const required = ['name','category','description','address','phone','email','nid'];
    for (const key of required) { if (!String(form[key]||'').trim()) return; }
    const documents = [
      { type: 'NID', number: form.nid, fileName: uploads.nidFile?.name },
      form.tradeLicense ? { type: 'TradeLicense', number: form.tradeLicense, fileName: uploads.tradeFile?.name } : null,
    ].filter(Boolean);
    const attachments = (uploads.otherFiles||[]).map(f => ({ name: f.name, size: f.size }));
    dispatch(requestShop({ ...form, documents, attachments }));
    if (typeof onBack === 'function') onBack();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card elevated-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Open a New Shop</h2>
          <Button color="gray" onClick={onBack}>Back</Button>
        </div>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[var(--muted-text)] mb-1">Shop Name</label>
            <input className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-[var(--muted-text)] mb-1">Category</label>
            <input className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[var(--muted-text)] mb-1">Description</label>
            <textarea rows={3} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[var(--muted-text)] mb-1">Address</label>
            <input className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
          </div>
          <div>
            <label className="block text-[var(--muted-text)] mb-1">Phone</label>
            <input className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div>
            <label className="block text-[var(--muted-text)] mb-1">Email</label>
            <input type="email" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="block text-[var(--muted-text)] mb-1">Tax ID</label>
            <input className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={form.taxId} onChange={e => setForm({ ...form, taxId: e.target.value })} />
          </div>
          <div>
            <label className="block text-[var(--muted-text)] mb-1">Registration No.</label>
            <input className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={form.registrationNo} onChange={e => setForm({ ...form, registrationNo: e.target.value })} />
          </div>
          <div>
            <label className="block text-[var(--muted-text)] mb-1">NID (Required)</label>
            <input className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={form.nid} onChange={e => setForm({ ...form, nid: e.target.value })} required />
          </div>
          <div>
            <label className="block text-[var(--muted-text)] mb-1">Trade License</label>
            <input className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={form.tradeLicense} onChange={e => setForm({ ...form, tradeLicense: e.target.value })} />
          </div>
          <div>
            <label className="block text-[var(--muted-text)] mb-1">Bank Name</label>
            <input className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} />
          </div>
          <div>
            <label className="block text-[var(--muted-text)] mb-1">Bank Account</label>
            <input className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={form.bankAccount} onChange={e => setForm({ ...form, bankAccount: e.target.value })} />
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[var(--muted-text)] mb-1">Upload NID</label>
              <input type="file" accept="image/*,application/pdf" onChange={e => setUploads(u => ({ ...u, nidFile: e.target.files?.[0] || null }))} />
            </div>
            <div>
              <label className="block text-[var(--muted-text)] mb-1">Upload Trade License</label>
              <input type="file" accept="image/*,application/pdf" onChange={e => setUploads(u => ({ ...u, tradeFile: e.target.files?.[0] || null }))} />
            </div>
            <div>
              <label className="block text-[var(--muted-text)] mb-1">Other Attachments</label>
              <input type="file" multiple accept="image/*,application/pdf" onChange={e => setUploads(u => ({ ...u, otherFiles: Array.from(e.target.files||[]) }))} />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <Button color="gray" type="button" onClick={() => { setForm({ name:'',category:'',description:'',address:'',phone:'',email:'',taxId:'',registrationNo:'',nid:'',tradeLicense:'',bankName:'',bankAccount:'' }); setUploads({ nidFile:null, tradeFile:null, otherFiles:[] }); }}>Clear</Button>
            <Button color="primary" type="submit">Submit for Approval</Button>
          </div>
        </form>
        <p className="text-xs text-[var(--muted-text)] mt-3">Admin will review provided information and documents before approving your shop.</p>
      </div>
    </div>
  );
};

export default NewShopRequestPage;
