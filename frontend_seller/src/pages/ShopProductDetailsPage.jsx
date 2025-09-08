import React, { useEffect, useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import { updateStock, updateVariantStock, requestEdit } from '../features/productSlice';

const Row = ({ label, children }) => (
  <div className="flex items-start justify-between p-3 bg-[var(--surface-2)] rounded">
    <span className="text-sm text-[var(--muted-text)]">{label}</span>
    <div className="ml-4">{children}</div>
  </div>
);

const VariantKeyValueEditor = ({ value, onChange }) => {
  const kv = value?.kv || [{ key: '', value: '' }];
  const setKV = (rows) => onChange({ ...(value||{}), kv: rows });
  return (
    <div>
      <label className="block text-[var(--muted-text)] mb-1 text-sm">Attributes (key → value)</label>
      <div className="space-y-2">
        {kv.map((row, idx) => (
          <div key={idx} className="grid grid-cols-2 gap-2">
            <input placeholder="Key (e.g., material)" className="bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={row.key} onChange={e => setKV(kv.map((r,i)=> i===idx?{...r, key:e.target.value}:r))} />
            <input placeholder="Value (e.g., Cotton)" className="bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={row.value} onChange={e => setKV(kv.map((r,i)=> i===idx?{...r, value:e.target.value}:r))} />
          </div>
        ))}
        <div className="flex gap-2">
          <Button color="gray" onClick={() => setKV([...kv, { key:'', value:'' }])}>Add Row</Button>
          {kv.length>1 && <Button color="gray" onClick={() => setKV(kv.slice(0,-1))}>Remove Last</Button>}
        </div>
      </div>
    </div>
  );
};

const ShopProductDetailsPage = ({ productId, onBack }) => {
  const dispatch = useDispatch();
  const { products } = useSelector(s => s.products);
  const { activeShopId } = useSelector(s => s.shops);
  const product = useMemo(() => products.find(p => p.id === productId), [products, productId]);
  const [stockVal, setStockVal] = useState(product ? String(product.stock ?? 0) : '0');
  const [editingVariants, setEditingVariants] = useState(() => (product?.variants || []).map(v => ({ ...v, stock: String(v.stock ?? 0) })));
  const [newVariant, setNewVariant] = useState({ color: '', size: '', stock: '', kv: [{ key: '', value: '' }], images: [] });
  const [stagedVariants, setStagedVariants] = useState([]);

  // Keep base stock in sync with store updates (e.g., after variant stock change)
  useEffect(() => {
    setStockVal(String(product ? (product.stock ?? 0) : 0));
  }, [product]);

  // Keep local editable variants in sync if product variants change in store
  useEffect(() => {
    setEditingVariants((product?.variants || []).map(v => ({ ...v, stock: String(v.stock ?? 0) })));
  }, [product]);

  if (!product) return (
    <div className="card elevated-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Product</h2>
        <Button color="gray" onClick={onBack}>Back</Button>
      </div>
      <p className="text-[var(--muted-text)]">Product not found.</p>
    </div>
  );

  const wrongShop = activeShopId && product.shopId !== activeShopId;

  const saveStock = () => {
    const n = Math.max(0, Number(stockVal) || 0);
    dispatch(updateStock({ id: product.id, stock: n }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card elevated-card p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <Button color="gray" onClick={onBack}>Back</Button>
        </div>
        {product.status === 'pending' && (
          <div className="mb-4 p-3 rounded bg-yellow-900/30 text-yellow-200 text-sm">This product is pending admin review. Some actions are limited.</div>
        )}
        {wrongShop && (
          <div className="mb-4 p-3 rounded bg-yellow-900/30 text-yellow-200 text-sm">This product belongs to a different shop. Switch the active shop to edit.</div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <img src={product.imageUrl} alt={product.name} className="rounded-lg w-full mb-4" />
            <p className="text-[var(--muted-text)] whitespace-pre-line">{product.description}</p>
          </div>
          <div className="space-y-3">
            <Row label="Status"><StatusBadge status={product.status} /></Row>
            <Row label="Category"><span>{product.category}</span></Row>
            <Row label="Price"><span className="font-mono">${Number(product.price).toFixed(2)}</span></Row>
            <Row label="Stock">
              <div className="flex items-center gap-2">
                <input type="number" min="0" value={stockVal} onChange={e => setStockVal(e.target.value)}
                  disabled={wrongShop || product.status !== 'approved' || (Array.isArray(product.variants) && product.variants.length > 0)}
                  className="w-24 bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 border border-[var(--border-color)]" />
                {!(Array.isArray(product.variants) && product.variants.length > 0) && (
                  <Button color="primary" onClick={saveStock} disabled={wrongShop || product.status !== 'approved'}>Save</Button>
                )}
              </div>
              {Array.isArray(product.variants) && product.variants.length > 0 ? (
                <div className="text-xs text-[var(--muted-text)] mt-1">Base stock is auto-calculated from variants.</div>
              ) : product.status !== 'approved' && (
                <div className="text-xs text-[var(--muted-text)] mt-1">Stock updates are available after product approval.</div>
              )}
            </Row>
            {Array.isArray(product.variants) && product.variants.length > 0 && (
              <div className="p-3 rounded bg-[var(--surface-2)]">
                <div className="text-sm text-[var(--muted-text)] mb-2">Variants</div>
                <div className="space-y-2">
                  {editingVariants.map((v, i) => (
                    <div key={i} className="p-2 rounded bg-[var(--surface-3)] text-sm flex items-center justify-between gap-2">
                      <div className="flex-1">
                        {(() => {
                          const attrs = v.attributes
                            ? (Array.isArray(v.attributes)
                              ? Object.fromEntries(v.attributes.map(a => [a.key, a.value]))
                              : v.attributes)
                            : {
                                ...(v.color ? { color: v.color } : {}),
                                ...(v.size ? { size: v.size } : {}),
                              };
                          const entries = Object.entries(attrs || {});
                          if (!entries.length) return '—';
                          return entries.map(([k,val]) => `${k}: ${val}`).join(' • ');
                        })()}
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" min="0" className="w-24 bg-[var(--input-bg)] text-[var(--input-text)] rounded p-1 border border-[var(--border-color)]"
                          value={v.stock}
                          onChange={e => setEditingVariants(prev => prev.map((pv, idx) => idx === i ? { ...pv, stock: e.target.value } : pv))}
                          disabled={wrongShop || product.status !== 'approved'}
                        />
                        <Button color="primary" onClick={() => {
                          const n = Math.max(0, Number(v.stock) || 0);
                          dispatch(updateVariantStock({ id: product.id, variantIndex: i, stock: n }));
                          setEditingVariants(prev => prev.map((pv, idx) => idx === i ? { ...pv, stock: String(n) } : pv));
                        }} disabled={wrongShop || product.status !== 'approved'}>Save</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card elevated-card p-6">
        <h3 className="text-lg font-bold mb-3">Reviews</h3>
        {product.reviews?.length ? (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {product.reviews.map(r => (
              <div key={r.id} className="p-3 rounded bg-[var(--surface-2)]">
                <div className="text-sm text-[var(--muted-text)]">{r.user}</div>
                <div className="text-sm">Rating: {r.rating} / 5</div>
                <div className="text-sm mt-1">{r.comment}</div>
              </div>
            ))}
          </div>
        ) : <p className="text-[var(--muted-text)]">No reviews yet.</p>}
      </div>

      <div className="card elevated-card p-6">
        <h3 className="text-lg font-bold mb-3">Admin Flags</h3>
        {product.reports?.length ? (
          <ul className="list-disc list-inside space-y-1 text-sm">
            {product.reports.map(rep => (
              <li key={rep.id} className="text-red-300">{rep.subject}</li>
            ))}
          </ul>
        ) : <p className="text-[var(--muted-text)]">No flags.</p>}
      </div>

      <div className="card elevated-card p-6">
        <h3 className="text-lg font-bold mb-3">Request New Variants (admin approval required)</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <VariantKeyValueEditor value={newVariant} onChange={setNewVariant} />
            </div>
            <div>
              <label className="block text-[var(--muted-text)] mb-1 text-sm">Initial Stock</label>
              <input type="number" min="0" placeholder="0" className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" value={newVariant.stock || ''} onChange={e => setNewVariant({ ...newVariant, stock: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--muted-text)] mb-1 text-sm">Variant Images (required)</label>
              <input type="file" multiple accept="image/*" onChange={e => setNewVariant(v => ({ ...v, images: Array.from(e.target.files||[]) }))} />
              {newVariant.images?.length ? (
                <div className="text-xs text-[var(--muted-text)] mt-1">{newVariant.images.length} image(s) selected</div>
              ) : <div className="text-xs text-[var(--muted-text)] mt-1">Please attach at least 1 image.</div>}
            </div>
          </div>
          <div className="flex justify-end">
            <Button color="primary" onClick={() => {
              const entries = (newVariant.kv || []).filter(r => r.key.trim() && r.value.trim());
              if (entries.length === 0) return;
              if (!newVariant.images || newVariant.images.length === 0) return;
              const attrs = Object.fromEntries(entries.map(r => [r.key.trim(), r.value.trim()]));
              const nv = { attributes: attrs, stock: Math.max(0, Number(newVariant.stock)||0), images: newVariant.images.map(f => ({ name: f.name })) };
              setStagedVariants(prev => [...prev, nv]);
              setNewVariant({ kv: [{ key: '', value: '' }], stock: '', images: [] });
            }}>Add to Request</Button>
          </div>
        </div>

        {stagedVariants.length > 0 && (
          <div className="mt-4">
            <div className="text-sm text-[var(--muted-text)] mb-2">Variants to request:</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--table-header-bg)] text-sm"><th className="p-2">Attributes</th><th className="p-2">Stock</th><th className="p-2">Images</th><th className="p-2 text-right">Remove</th></tr>
                </thead>
                <tbody>
                  {stagedVariants.map((v, i) => (
                    <tr key={i} className="border-b border-[var(--border-color)]">
                      <td className="p-2 text-sm">{Object.entries(v.attributes||{}).map(([k,val]) => `${k}: ${val}`).join(' • ') || '—'}</td>
                      <td className="p-2">{v.stock}</td>
                      <td className="p-2 text-sm">{v.images?.length || 0}</td>
                      <td className="p-2 text-right"><Button color="gray" onClick={() => setStagedVariants(prev => prev.filter((_, idx) => idx !== i))}>Remove</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-3">
              <Button color="primary" onClick={() => {
                // Tag staged variants with pending status
                const stagedWithStatus = stagedVariants.map(v => ({ ...v, status: 'pending' }));
                const proposedWithStatus = [...(product.variants||[]), ...stagedWithStatus];
                dispatch(requestEdit({ id: product.id, changes: { variants: proposedWithStatus } }));
                setStagedVariants([]);
                // Optional: optimistic local status hint
                // This page reads product from store; requestEdit sets status to pending accordingly.
              }}>Submit {stagedVariants.length} Variant{stagedVariants.length>1?'s':''} for Approval</Button>
            </div>
          </div>
        )}
        <p className="text-xs text-[var(--muted-text)] mt-2">New variants require admin approval. Once approved, you'll be able to edit their stock directly.</p>
      </div>

      {/* Variants Overview at bottom */}
      <div className="card elevated-card p-6">
        <h3 className="text-lg font-bold mb-3">Variants Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--table-header-bg)] text-sm">
                <th className="p-2">Attributes</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const toKey = (v) => {
                  const attrs = v.attributes ? (Array.isArray(v.attributes) ? Object.fromEntries(v.attributes.map(a=>[a.key,a.value])) : v.attributes) : { ...(v.color?{color:v.color}:{}) , ...(v.size?{size:v.size}:{}) };
                  const entries = Object.entries(attrs||{}).sort(([a],[b]) => a.localeCompare(b));
                  return JSON.stringify(entries);
                };
                const existing = product.variants || [];
                const existingKeys = new Set(existing.map(toKey));
                const pending = product.pendingChanges?.variants || [];
                const rows = [];
                // Existing rows as approved (unless variant carries its own status)
                for (const v of existing) {
                  const attrs = v.attributes ? (Array.isArray(v.attributes) ? Object.fromEntries(v.attributes.map(a=>[a.key,a.value])) : v.attributes) : { ...(v.color?{color:v.color}:{}) , ...(v.size?{size:v.size}:{}) };
                  rows.push({ attrs, stock: v.stock ?? 0, status: v.status || 'approved' });
                }
                // Pending new variants (those not in existing set)
                for (const v of pending) {
                  const key = toKey(v);
                  if (!existingKeys.has(key)) {
                    const attrs = v.attributes ? (Array.isArray(v.attributes) ? Object.fromEntries(v.attributes.map(a=>[a.key,a.value])) : v.attributes) : { ...(v.color?{color:v.color}:{}) , ...(v.size?{size:v.size}:{}) };
                    rows.push({ attrs, stock: v.stock ?? 0, status: v.status || 'pending' });
                  }
                }
                if (rows.length === 0) return (
                  <tr><td className="p-2 text-[var(--muted-text)]" colSpan={3}>No variants.</td></tr>
                );
                return rows.map((r, idx) => (
                  <tr key={idx} className="border-b border-[var(--border-color)]">
                    <td className="p-2 text-sm">{Object.entries(r.attrs||{}).map(([k,val]) => `${k}: ${val}`).join(' • ') || '—'}</td>
                    <td className="p-2">{r.stock}</td>
                    <td className="p-2"><StatusBadge status={r.status} /></td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShopProductDetailsPage;
