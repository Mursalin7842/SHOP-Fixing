import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { setActiveShop } from '../features/shopsSlice';
import { setShops } from '../features/shopsSlice';
import NewShopRequestPage from './NewShopRequestPage';
import ShopProductDetailsPage from './ShopProductDetailsPage';
import apiClient from '../api/api';

const MyShopPage = () => {
  const dispatch = useDispatch();
  const { shops, activeShopId } = useSelector(s => s.shops);
  // Load shops from backend for the logged-in seller
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await apiClient.get('/shop/mine/');
        if (!mounted) return;
        const mapped = (Array.isArray(data) ? data : []).map(s => ({
          id: s.id,
          name: s.name,
          category: '',
          status: s.status || 'pending',
          documents: [],
        }));
        dispatch(setShops(mapped));
      } catch {
        // ignore if unauthorized
      }
    })();
    return () => { mounted = false; };
  }, [dispatch]);
  // old inline form removed; use NewShopRequestPage instead

  // inline form removed in favor of dedicated NewShopRequestPage

  // Analytics: derive metrics for active shop
  const { products } = useSelector(s => s.products);
  const { orders } = useSelector(s => s.orders);
  const activeShop = shops.find(s => s.id === activeShopId);

  // Persisted per-product cost (for profit/loss). Keep it local to this page via localStorage.
  const [costs, setCosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('seller_costs') || '{}'); } catch { return {}; }
  });
  useEffect(() => { localStorage.setItem('seller_costs', JSON.stringify(costs)); }, [costs]);

  const shopAnalytics = useMemo(() => {
    if (!activeShop) return null;
    const shopProducts = products.filter(p => p.shopId === activeShop.id);
    const shopOrders = orders.filter(o => o.shopId === activeShop.id);

    const soldMap = new Map(); // productId -> units sold
    const revenueMap = new Map(); // productId -> revenue
    for (const o of shopOrders) {
      for (const it of (o.items || [])) {
        const p = shopProducts.find(x => x.name === it.productName);
        if (!p) continue;
        const qty = Number(it.qty) || 0;
        soldMap.set(p.id, (soldMap.get(p.id) || 0) + qty);
        revenueMap.set(p.id, (revenueMap.get(p.id) || 0) + qty * (Number(p.price) || 0));
      }
    }

    const totalProducts = shopProducts.length;
    const totalUnitsSold = Array.from(soldMap.values()).reduce((a,b)=>a+b,0);
    const totalRevenue = Array.from(revenueMap.values()).reduce((a,b)=>a+b,0);

    const productRows = shopProducts.map(p => {
      const units = soldMap.get(p.id) || 0;
      const revenue = revenueMap.get(p.id) || 0;
      const avgRating = (p.reviews && p.reviews.length) ? (p.reviews.reduce((a,r)=>a+Number(r.rating||0),0)/p.reviews.length) : 0;
      const flags = (p.reports || []).length;
      const cost = Number(costs[p.id] ?? '');
      const profit = Number.isFinite(cost) ? (Number(p.price) - cost) * units : null;
      return { p, units, revenue, avgRating, flags, cost: Number.isFinite(cost) ? cost : '', profit };
    });

    const goodReviews = productRows.filter(r => r.avgRating >= 4);
    const flagged = productRows.filter(r => r.flags > 0);

    return { totalProducts, totalUnitsSold, totalRevenue, productRows, goodReviews, flagged };
  }, [activeShop, products, orders, costs]);

  const [openForm, setOpenForm] = useState(false);

  const [viewingProductId, setViewingProductId] = useState(null);
  if (openForm) return <NewShopRequestPage onBack={() => setOpenForm(false)} />;
  if (viewingProductId != null) return <ShopProductDetailsPage productId={viewingProductId} onBack={() => setViewingProductId(null)} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Shop</h2>
        <Button color="primary" onClick={() => setOpenForm(true)}>Open a New Shop</Button>
      </div>

      <div className="card elevated-card p-6">
  <h3 className="text-lg font-bold mb-3">My Shops</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--table-header-bg)]"><th className="p-3">Name</th><th className="p-3">Category</th><th className="p-3">Status</th><th className="p-3">NID</th><th className="p-3">Active</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {shops.map(s => (
                <tr key={s.id} className="border-b border-[var(--border-color)] hover:bg-[var(--table-row-hover)]">
                  <td className="p-3 font-semibold">{s.name}</td>
                  <td className="p-3">{s.category}</td>
                  <td className="p-3"><StatusBadge status={s.status} /></td>
                  <td className="p-3">{s.documents?.find(d => d.type === 'NID')?.number || '-'}</td>
                  <td className="p-3">
                    <input type="radio" name="activeShop" checked={activeShopId === s.id} disabled={s.status !== 'approved'} onChange={() => dispatch(setActiveShop(s.id))} />
                  </td>
                  <td className="p-3 text-right text-sm text-[var(--muted-text)]">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics for Active Shop */}
      {activeShop && shopAnalytics && (
        <div className="card elevated-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Shop Overview</h3>
              <p className="text-sm text-[var(--muted-text)]">{activeShop.name} • {activeShop.category} • {activeShop.status}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded bg-[var(--surface-2)]">
              <div className="text-sm text-[var(--muted-text)]">Products</div>
              <div className="text-2xl font-bold">{shopAnalytics.totalProducts}</div>
            </div>
            <div className="p-4 rounded bg-[var(--surface-2)]">
              <div className="text-sm text-[var(--muted-text)]">Units Sold</div>
              <div className="text-2xl font-bold">{shopAnalytics.totalUnitsSold}</div>
            </div>
            <div className="p-4 rounded bg-[var(--surface-2)]">
              <div className="text-sm text-[var(--muted-text)]">Revenue</div>
              <div className="text-2xl font-bold">${shopAnalytics.totalRevenue.toFixed(2)}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--table-header-bg)]">
                  <th className="p-3">Product</th>
                  <th className="p-3">Units Sold</th>
                  <th className="p-3">Revenue</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Avg Rating</th>
                  <th className="p-3">Flags</th>
                  <th className="p-3">Cost</th>
                  <th className="p-3">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {shopAnalytics.productRows.map(row => (
                  <tr key={row.p.id} className="border-b border-[var(--border-color)] hover:bg-[var(--table-row-hover)] cursor-pointer" onClick={() => setViewingProductId(row.p.id)}>
                    <td className="p-3 font-semibold underline hover:text-[var(--link)]">{row.p.name}</td>
                    <td className="p-3">{row.units}</td>
                    <td className="p-3">${row.revenue.toFixed(2)}</td>
                    <td className={`p-3 ${row.p.stock === 0 ? 'text-red-400 font-semibold' : ''}`}>{row.p.stock}</td>
                    <td className="p-3">
                      <StatusBadge status={row.p.status} />
                    </td>
                    <td className="p-3">{row.avgRating ? row.avgRating.toFixed(1) : '—'}</td>
                    <td className="p-3">{row.flags || 0}</td>
                    <td className="p-3">
                      <input type="number" step="0.01" placeholder="0.00" value={row.cost}
                        onChange={e => setCosts(prev => ({ ...prev, [row.p.id]: e.target.value }))}
                        className="w-28 bg-[var(--input-bg)] text-[var(--input-text)] rounded p-1 border border-[var(--border-color)]" />
                    </td>
                    <td className={`p-3 ${row.profit != null ? (row.profit >= 0 ? 'text-[var(--positive-text)] font-semibold' : 'text-[var(--negative-text)] font-semibold') : 'text-[var(--muted-text)]'}`}>{row.profit != null ? `$${row.profit.toFixed(2)}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded bg-[var(--surface-2)]">
              <h4 className="font-semibold mb-2">Well-reviewed Products (avg ≥ 4)</h4>
              {shopAnalytics.goodReviews.length ? (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {shopAnalytics.goodReviews.map(r => (
                    <li key={r.p.id}>{r.p.name} — {r.avgRating.toFixed(1)}★</li>
                  ))}
                </ul>
              ) : <p className="text-sm text-[var(--muted-text)]">No highly-rated products yet.</p>}
            </div>
            <div className="p-4 rounded bg-[var(--surface-2)]">
              <h4 className="font-semibold mb-2">Flagged by Admin</h4>
              {shopAnalytics.flagged.length ? (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {shopAnalytics.flagged.map(r => (
                    <li key={r.p.id}>{r.p.name} — {r.flags} flag(s)</li>
                  ))}
                </ul>
              ) : <p className="text-sm text-[var(--muted-text)]">No flagged products.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyShopPage;
