import React, { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, setProducts, updateStock, requestEdit } from '../features/productSlice';
import Modal from '../components/Modal';
import OrderStatus from '../components/OrderStatus';
import StatusBadge from '../components/StatusBadge';
import Rating from '../components/Rating';
import { PlusCircleIcon, EyeIcon, EditIcon, TrashIcon } from '../components/icons/index.jsx';
import apiClient from '../api/api';

const AddProductModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]); // array of File
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [shops, setShops] = useState([]); // seller shops
  const [shopId, setShopId] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiClient.get('/shop/mine/');
        const list = Array.isArray(data) ? data : [];
        setShops(list);
        // Prefer first approved, else first any
        const approved = list.find(s => s.status === 'approved');
        if (approved) setShopId(String(approved.id));
        else if (list[0]) setShopId(String(list[0].id));
      } catch {/* ignore */}
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shopId) { alert('You must have (or create) a shop before adding products.'); return; }
    if (!price || isNaN(Number(price))) { alert('Enter a valid price'); return; }
    const numericShopId = Number(shopId);
    if (Number.isNaN(numericShopId)) { alert('Invalid shop selected'); return; }
    try {
      const payload = { shop: numericShopId, name, price: parseFloat(price), description, category };
      const { data } = await apiClient.post('/products/submit/', payload);
      dispatch(addProduct({
        id: data.id,
        shopId: data.shop || numericShopId,
        name: data.name,
        category: data.category || category,
        price: Number(data.price),
        stock: Number(stock) || 0,
        description: data.description || '',
        imageUrl: `https://placehold.co/600x400/1E293B/FFFFFF?text=${encodeURIComponent(data.name)}`,
        images: [],
        specifications: [],
        status: data.status || 'pending',
        reviews: [],
        reports: [],
      }));
      onClose();
    } catch (err) {
      alert(err?.response?.data?.detail || err.message || 'Failed to submit product');
    }
  };

  return (
    <Modal onClose={onClose} title="Add New Product">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[var(--muted-text)] mb-1">Shop</label>
            <select value={shopId} onChange={e => setShopId(e.target.value)} required className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="" disabled>Select a shop</option>
              {shops.map(s => (
                <option key={s.id} value={s.id}>{s.name} {s.status !== 'approved' ? `(${s.status})` : ''}</option>
              ))}
            </select>
          </div>
          <div><label className="block text-[var(--muted-text)] mb-1">Product Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
          <div><label className="block text-[var(--muted-text)] mb-1">Category</label><input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
          <div><label className="block text-[var(--muted-text)] mb-1">Price</label><input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
          <div><label className="block text-[var(--muted-text)] mb-1">Stock (local only)</label><input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
        </div>
        <div><label className="block text-gray-400 mb-1">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows="4" className="w-full bg-gray-700 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" required></textarea></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[var(--muted-text)] mb-1">Product Images (multiple)</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files || []))} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {images.slice(0,8).map((f, i) => (
                  <div key={i} className="h-16 w-full bg-[var(--surface-2)] rounded overflow-hidden">
                    <img src={URL.createObjectURL(f)} alt={f.name} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-[var(--muted-text)] mb-1">Specifications</label>
            <div className="space-y-2">
              {specs.map((s, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <input value={s.key} onChange={e => { const a=[...specs]; a[idx] = { ...a[idx], key: e.target.value }; setSpecs(a); }} placeholder="Key (e.g., Color)" className="bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
                  <input value={s.value} onChange={e => { const a=[...specs]; a[idx] = { ...a[idx], value: e.target.value }; setSpecs(a); }} placeholder="Value (e.g., Red)" className="bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" />
                </div>
              ))}
              <div className="flex gap-2">
                <Button type="button" color="gray" onClick={() => setSpecs([...specs, { key: '', value: '' }])}>Add Row</Button>
                {specs.length > 1 && (
                  <Button type="button" color="gray" onClick={() => setSpecs(specs.slice(0, -1))}>Remove Last</Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 flex justify-end space-x-3">
          <Button color="gray" type="button" onClick={onClose}>Cancel</Button>
          <Button color="primary" type="submit">Submit for Approval</Button>
        </div>
      </form>
    </Modal>
  );
};

const ProductDetailsModal = ({ product, onClose }) => (
  <Modal onClose={onClose} title="Product Details">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div><img src={product.imageUrl} alt={product.name} className="rounded-lg w-full mb-4" /><p className="text-gray-400">{product.description}</p></div>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">{product.name}</h3>
        <p className="text-gray-400">{product.category}</p>
        <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"><span>Status</span><OrderStatus status={product.status} /></div>
        <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"><span>Price</span><span className="font-mono text-lg">${product.price.toFixed(2)}</span></div>
        <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"><span>Stock</span><span>{product.stock} units</span></div>
        <div><h4 className="font-bold mb-2">Reviews ({product.reviews.length})</h4>
          <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
            {product.reviews.length > 0 ? product.reviews.map(r => (
              <div key={r.id} className="bg-gray-900/50 p-3 rounded-lg"><div className="flex justify-between items-center mb-1"><span className="font-semibold">{r.user}</span><Rating rating={r.rating} /></div><p className="text-sm text-gray-400">{r.comment}</p></div>
            )) : <p className="text-sm text-gray-500">No reviews yet.</p>}
          </div>
        </div>
        <div><h4 className="font-bold mb-2">Admin Reports ({product.reports.length})</h4>
          <div className="space-y-3">
            {product.reports.length > 0 ? product.reports.map(rep => (
              <div key={rep.id} className="bg-red-900/30 p-3 rounded-lg"><p className="text-sm text-red-300">{rep.subject}</p></div>
            )) : <p className="text-sm text-gray-500">No reports on this product.</p>}
          </div>
        </div>
      </div>
    </div>
  </Modal>
);

const FeedbackModal = ({ product, onClose }) => (
  <Modal onClose={onClose} title="Admin Feedback">
    {(!product.adminFeedback || product.adminFeedback.length === 0) ? (
      <p className="text-[var(--muted-text)]">No feedback yet.</p>
    ) : (
      <div className="space-y-3">
        {product.adminFeedback.map(fb => (
          <div key={fb.id} className="p-3 rounded-lg bg-[var(--surface-2)]">
            <div className="text-sm text-[var(--muted-text)]">{fb.date}</div>
            <div>{fb.message}</div>
          </div>
        ))}
      </div>
    )}
  </Modal>
);

const EditProductModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(String(product.price));
  const [description, setDescription] = useState(product.description);
  const [imageUrl, setImageUrl] = useState(product.imageUrl || '');

  const onSubmit = (e) => {
    e.preventDefault();
    const changes = {};
    if (name !== product.name) changes.name = name;
    if (category !== product.category) changes.category = category;
    if (Number(price) !== Number(product.price)) changes.price = Number(price);
    if (description !== product.description) changes.description = description;
    if (imageUrl !== (product.imageUrl || '')) changes.imageUrl = imageUrl;
    if (Object.keys(changes).length === 0) { onClose(); return; }
    dispatch(requestEdit({ id: product.id, changes }));
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Edit Product">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-[var(--muted-text)] mb-1">Product Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" required /></div>
          <div><label className="block text-[var(--muted-text)] mb-1">Category</label><input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" required /></div>
          <div><label className="block text-[var(--muted-text)] mb-1">Price</label><input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" required /></div>
          <div><label className="block text-[var(--muted-text)] mb-1">Image URL</label><input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" placeholder="https://..." /></div>
        </div>
        <div><label className="block text-[var(--muted-text)] mb-1">Description</label><textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[var(--input-bg)] text-[var(--input-text)] rounded p-2" /></div>
        <div className="pt-2 flex justify-end gap-3">
          <Button color="gray" type="button" onClick={onClose}>Cancel</Button>
          <Button color="primary" type="submit">Submit for Approval</Button>
        </div>
      </form>
      <p className="text-xs text-[var(--muted-text)] mt-3">Note: Changing name/category/price/description/image will send this product for admin re-approval.</p>
    </Modal>
  );
};

const statusTabs = [
  { id: 'all', label: 'All' },
  { id: 'approved', label: 'Approved' },
  { id: 'pending', label: 'Pending' },
  { id: 'modification', label: 'Needs Changes' },
  { id: 'rejected', label: 'Rejected' },
];

const ProductsPage = ({ products, filter, setProductFilter, viewingProduct, setViewingProduct }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [feedbackFor, setFeedbackFor] = useState(null);
  const [editingStock, setEditingStock] = useState({}); // { [id]: value }
  // Dev review controls removed; admin approves externally.
  const dispatch = useDispatch();
  const activeShopId = useSelector(s => s.shops.activeShopId);

  // Load my products on mount once authenticated (token handled by interceptor)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await apiClient.get('/products/mine/');
        if (!mounted) return;
        // Map to UI shape (category/specs not provided by backend demo)
        const mapped = (Array.isArray(data) ? data : []).map(p => ({
          id: p.id,
          shopId: p.shop,
          name: p.name,
          category: p.category || '',
          price: Number(p.price),
          stock: 0,
          description: p.description || '',
          imageUrl: `https://placehold.co/600x400/1E293B/FFFFFF?text=${encodeURIComponent(p.name)}`,
          images: [],
          specifications: [],
          status: p.status || 'pending',
          reviews: [],
          reports: [],
        }));
        dispatch(setProducts(mapped));
      } catch {
        // If 401, user not approved/logged in; ignore here
      }
    })();
    return () => { mounted = false; };
  }, [dispatch]);

  const filteredProducts = useMemo(() => products
    .filter(p => !activeShopId || p.shopId === activeShopId)
    .filter(p => filter === 'all' || p.status === filter)
  , [products, filter, activeShopId]);

  return (
    <>
  <div className="rounded-lg shadow-lg animate-fade-in card elevated-card">
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Products</h2>
          <Button color="primary" onClick={() => setShowAddModal(true)} className="flex items-center gap-2"><PlusCircleIcon /> Add Product</Button>
        </div>
        <div className="px-6 py-3 border-b border-[var(--border-color)] flex flex-wrap gap-2">
          {statusTabs.map(t => (
            <button key={t.id} onClick={() => setProductFilter && setProductFilter(t.id)}
              className={`px-3 py-1 rounded text-sm border ${filter===t.id? 'bg-[var(--surface-2)] border-[var(--border-color)]' : 'bg-transparent border-transparent hover:bg-[var(--surface-2)]'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-[var(--table-header-bg)]"><th className="p-4">Product</th><th className="p-4 hidden md:table-cell">Price</th><th className="p-4 hidden md:table-cell">Stock</th><th className="p-4">Status</th><th className="p-4 hidden md:table-cell">Feedback</th><th className="p-4 text-center">Actions</th></tr></thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} className="border-b border-[var(--border-color)] hover:bg-[var(--table-row-hover)]">
                  <td className="p-4 font-semibold">{p.name}</td>
                  <td className="p-4 font-mono hidden md:table-cell">${p.price.toFixed(2)}</td>
                  <td className={`p-4 hidden md:table-cell ${p.stock === 0 ? 'text-red-400 font-bold' : ''}`}>
                    {Array.isArray(p.variants) && p.variants.length > 0 ? (
                      <span title="Auto-calculated from variants">{p.stock} units</span>
                    ) : p.status === 'approved' ? (
                      <div className="flex items-center gap-2">
                        <input type="number" min="0" className="w-20 bg-[var(--input-bg)] text-[var(--input-text)] rounded p-1 border border-[var(--border-color)]"
                          value={editingStock[p.id] ?? p.stock}
                          onChange={e => setEditingStock({ ...editingStock, [p.id]: e.target.value })}
                        />
                        <Button color="gray" onClick={() => { const val = Number(editingStock[p.id] ?? p.stock); if (val>=0) dispatch(updateStock({ id: p.id, stock: val })); }}>Save</Button>
                      </div>
                    ) : (
                      <span>{p.stock} units</span>
                    )}
                  </td>
                  <td className="p-4"><StatusBadge status={p.status} /></td>
                  <td className="p-4 hidden md:table-cell">
                    <button className="text-blue-400 hover:underline" onClick={() => setFeedbackFor(p)}>
                      {p.adminFeedback?.length ? `${p.adminFeedback.length} note(s)` : 'View'}
                    </button>
                    {/* Pending changes are visible but cannot be approved by seller */}
                  </td>
                  <td className="p-4 text-center space-x-2">
                    <button onClick={() => setViewingProduct(p)} className="p-2 text-gray-400 hover:text-white"><EyeIcon width={18} /></button>
                    <button onClick={() => setEditingProduct(p)} className="p-2 text-gray-400 hover:text-white"><EditIcon width={18} /></button>
                    <button className="p-2 text-gray-400 hover:text-red-400"><TrashIcon width={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  {/* Seller cannot approve/reject pending changes; admin handles this externally. */}
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} />}
      {viewingProduct && <ProductDetailsModal product={viewingProduct} onClose={() => setViewingProduct(null)} />}
      {editingProduct && <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} />}
      {feedbackFor && <FeedbackModal product={feedbackFor} onClose={() => setFeedbackFor(null)} />}
    </>
  );
};

export default ProductsPage;
