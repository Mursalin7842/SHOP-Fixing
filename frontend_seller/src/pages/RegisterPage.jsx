import React, { useMemo, useState } from 'react';
import { UploadCloudIcon } from '../components/icons/index.jsx';

const categories = ['Electronics', 'Fashion', 'Grocery', 'Home & Living', 'Beauty & Health', 'Automotive', 'Books', 'Other'];

import apiClient from '../api/api';

const RegisterPage = ({ onRegister, showLogin }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    businessCategory: '',
    businessDescription: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [licenseFile, setLicenseFile] = useState(null);
  const [nidFile, setNidFile] = useState(null);
  const [touched, setTouched] = useState({});
  const [terms, setTerms] = useState(false);

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const emailOk = useMemo(() => /.+@.+\..+/.test(form.email), [form.email]);
  const phoneOk = useMemo(() => /[0-9\-+()\s]{7,20}/.test(form.phone.trim()), [form.phone]);
  const pwdOk = useMemo(() => form.password.length >= 8, [form.password]);
  const pwdMatch = useMemo(() => form.password && form.password === form.confirmPassword, [form.password, form.confirmPassword]);

  const allFilled = useMemo(() => {
    const valuesOk = Object.values({ ...form }).every(v => String(v || '').trim().length > 0);
    return valuesOk && !!licenseFile && !!nidFile && terms;
  }, [form, licenseFile, nidFile, terms]);

  const formValid = allFilled && emailOk && phoneOk && pwdOk && pwdMatch;

  const onSubmit = async (e) => {
    e.preventDefault();
    // mark all fields touched to show errors
    const keys = Object.keys(form);
    const t = {}; keys.forEach(k => t[k] = true);
    setTouched(t);
    if (!formValid) return;
    try {
      // Map to backend minimal register-seller endpoint
      await apiClient.post('/users/register-seller/', {
        username: form.email || form.fullName.replace(/\s+/g, '').toLowerCase(),
        email: form.email,
        password: form.password,
      });
      onRegister?.({ ...form, licenseFileName: licenseFile?.name, nidFileName: nidFile?.name, termsAccepted: terms });
    } catch (err) {
      alert(err?.response?.data?.detail || err.message || 'Registration failed');
    }
  };

  const errMsg = (field) => {
    if (!touched[field]) return null;
    const v = String(form[field] || '').trim();
    if (!v) return 'This field is required.';
    if (field === 'email' && !emailOk) return 'Enter a valid email.';
    if (field === 'phone' && !phoneOk) return 'Enter a valid phone number.';
    if (field === 'password' && !pwdOk) return 'Password must be at least 8 characters.';
    if (field === 'confirmPassword' && !pwdMatch) return 'Passwords do not match.';
    return null;
  };

  return (
    <div className="bg-[var(--background-color)] text-[var(--text-color)] min-h-screen flex items-center justify-center py-12 animate-fade-in">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-3xl card elevated-card">
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <img src="/logo.png" alt="Tour On Go" className="h-8 w-8 rounded" />
          <div className="font-bold">Tour On Go</div>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Create your seller account</h1>
          <p className="text-sm text-[var(--muted-text)] mt-1">We need a few details to verify and set up your shop.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[var(--muted-text)] mb-1">Full Name</label>
              <input value={form.fullName} onChange={e=>setField('fullName', e.target.value)} onBlur={()=>setTouched(t=>({...t, fullName:true}))} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
              {errMsg('fullName') && <p className="text-xs text-red-500 mt-1">{errMsg('fullName')}</p>}
            </div>
            <div>
              <label className="block text-[var(--muted-text)] mb-1">Email Address</label>
              <input type="email" value={form.email} onChange={e=>setField('email', e.target.value)} onBlur={()=>setTouched(t=>({...t, email:true}))} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
              {errMsg('email') && <p className="text-xs text-red-500 mt-1">{errMsg('email')}</p>}
            </div>
            <div>
              <label className="block text-[var(--muted-text)] mb-1">Phone Number</label>
              <input type="tel" value={form.phone} onChange={e=>setField('phone', e.target.value)} onBlur={()=>setTouched(t=>({...t, phone:true}))} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
              {errMsg('phone') && <p className="text-xs text-red-500 mt-1">{errMsg('phone')}</p>}
            </div>
            <div>
              <label className="block text-[var(--muted-text)] mb-1">Shop Name</label>
              <input value={form.shopName} onChange={e=>setField('shopName', e.target.value)} onBlur={()=>setTouched(t=>({...t, shopName:true}))} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
              {errMsg('shopName') && <p className="text-xs text-red-500 mt-1">{errMsg('shopName')}</p>}
            </div>
            <div>
              <label className="block text-[var(--muted-text)] mb-1">Business Category</label>
              <select value={form.businessCategory} onChange={e=>setField('businessCategory', e.target.value)} onBlur={()=>setTouched(t=>({...t, businessCategory:true}))} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2">
                <option value="" disabled>Select a category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errMsg('businessCategory') && <p className="text-xs text-red-500 mt-1">{errMsg('businessCategory')}</p>}
            </div>
            <div>
              <label className="block text-[var(--muted-text)] mb-1">Password</label>
              <input type="password" value={form.password} onChange={e=>setField('password', e.target.value)} onBlur={()=>setTouched(t=>({...t, password:true}))} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
              {errMsg('password') && <p className="text-xs text-red-500 mt-1">{errMsg('password')}</p>}
            </div>
            <div>
              <label className="block text-[var(--muted-text)] mb-1">Retype Password</label>
              <input type="password" value={form.confirmPassword} onChange={e=>setField('confirmPassword', e.target.value)} onBlur={()=>setTouched(t=>({...t, confirmPassword:true}))} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
              {errMsg('confirmPassword') && <p className="text-xs text-red-500 mt-1">{errMsg('confirmPassword')}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[var(--muted-text)] mb-1">Business Description</label>
            <textarea rows="3" value={form.businessDescription} onChange={e=>setField('businessDescription', e.target.value)} onBlur={()=>setTouched(t=>({...t, businessDescription:true}))} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
            {errMsg('businessDescription') && <p className="text-xs text-red-500 mt-1">{errMsg('businessDescription')}</p>}
          </div>

          <div>
            <label className="block text-[var(--muted-text)] mb-1">Business Address</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input placeholder="Address line 1" value={form.addressLine1} onChange={e=>setField('addressLine1', e.target.value)} onBlur={()=>setTouched(t=>({...t, addressLine1:true}))} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
                {errMsg('addressLine1') && <p className="text-xs text-red-500 mt-1">{errMsg('addressLine1')}</p>}
              </div>
              <div>
                <input placeholder="Address line 2" value={form.addressLine2} onChange={e=>setField('addressLine2', e.target.value)} onBlur={()=>setTouched(t=>({...t, addressLine2:true}))} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
                {errMsg('addressLine2') && <p className="text-xs text-red-500 mt-1">{errMsg('addressLine2')}</p>}
              </div>
              <div>
                <input placeholder="City" value={form.city} onChange={e=>setField('city', e.target.value)} onBlur={()=>setTouched(t=>({...t, city:true}))} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
                {errMsg('city') && <p className="text-xs text-red-500 mt-1">{errMsg('city')}</p>}
              </div>
              <div>
                <input placeholder="State/Province" value={form.state} onChange={e=>setField('state', e.target.value)} onBlur={()=>setTouched(t=>({...t, state:true}))} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
                {errMsg('state') && <p className="text-xs text-red-500 mt-1">{errMsg('state')}</p>}
              </div>
              <div>
                <input placeholder="Postal code" value={form.postalCode} onChange={e=>setField('postalCode', e.target.value)} onBlur={()=>setTouched(t=>({...t, postalCode:true}))} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
                {errMsg('postalCode') && <p className="text-xs text-red-500 mt-1">{errMsg('postalCode')}</p>}
              </div>
              <div>
                <input placeholder="Country" value={form.country} onChange={e=>setField('country', e.target.value)} onBlur={()=>setTouched(t=>({...t, country:true}))} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
                {errMsg('country') && <p className="text-xs text-red-500 mt-1">{errMsg('country')}</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[var(--muted-text)] mb-1">Business License / Tax ID</label>
              <label htmlFor="license-upload" className="cursor-pointer bg-[var(--surface-2)] p-4 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] hover:border-blue-500">
                <UploadCloudIcon className="w-10 h-10 text-gray-500" />
                <p className="mt-2 text-sm text-gray-400">{licenseFile?.name || 'Click to upload a PDF'}</p>
              </label>
              <input id="license-upload" name="license-upload" type="file" className="sr-only" onChange={(e)=> setLicenseFile(e.target.files?.[0] || null)} accept=".pdf" required />
              {!licenseFile && touched.license && <p className="text-xs text-red-500 mt-1">This file is required.</p>}
            </div>
            <div>
              <label className="block text-[var(--muted-text)] mb-1">National ID (NID)</label>
              <label htmlFor="nid-upload" className="cursor-pointer bg-[var(--surface-2)] p-4 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] hover:border-blue-500">
                <UploadCloudIcon className="w-10 h-10 text-gray-500" />
                <p className="mt-2 text-sm text-gray-400">{nidFile?.name || 'Click to upload a JPG/PNG/PDF'}</p>
              </label>
              <input id="nid-upload" name="nid-upload" type="file" className="sr-only" onChange={(e)=> setNidFile(e.target.files?.[0] || null)} accept=".jpg,.jpeg,.png,.pdf" required />
              {!nidFile && touched.nid && <p className="text-xs text-red-500 mt-1">This file is required.</p>}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <input id="terms" type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} className="mt-1 accent-blue-600" required />
            <label htmlFor="terms" className="text-sm text-[var(--muted-text)]">I confirm all information is accurate, and I agree to the Terms and Privacy Policy.</label>
          </div>

          <button type="submit" disabled={!formValid} className={`w-full font-bold py-3 px-4 rounded-lg mt-2 ${formValid ? 'bg-[var(--button-primary)] hover:bg-blue-700 text-[var(--button-primary-text)]' : 'bg-gray-500 text-white opacity-70 cursor-not-allowed'}`}>Submit Application</button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">Already have an account? <button onClick={showLogin} className="text-blue-400 hover:underline">Login here</button></p>
      </div>
    </div>
  );
};

export default RegisterPage;
