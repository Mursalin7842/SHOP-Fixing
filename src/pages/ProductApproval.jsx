import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import ProductModal from '../components/ProductModal';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { fetchProducts } from '../redux/actions/productActions';

const ProductApproval = ({ initialTab = 'pending' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const dispatch = useDispatch();
    const { loading, items: productGroups, error } = useSelector(state => state.products);

    useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);
    
    const handleAction = (id, status, details) => {
        console.log(`Product ${id} action: ${status}`, details);
    };

    const list = useMemo(() => productGroups[activeTab] || [], [productGroups, activeTab]);
    const filteredProducts = list.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
    <div className="rounded-lg shadow-lg card" style={{ backgroundColor: 'var(--component-bg)', color: 'var(--component-text)' }}>
            <div className="p-6 border-b flex flex-wrap gap-4 justify-between items-center" style={{ borderColor: 'var(--purple-light)' }}>
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--purple-light)' }}>Product Approval</h2>
                    <div className="flex space-x-1 sm:space-x-4 mt-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                        {['pending', 'approved', 'rejected', 'flagged', 'modification'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-1 text-sm font-medium capitalize ${activeTab === tab ? 'border-b-2' : ''}`} style={{ borderColor: activeTab === tab ? 'var(--purple-light)' : 'transparent', color: activeTab === tab ? 'var(--text-color)' : 'var(--muted-text)' }}>{tab}</button>
                        ))}
                    </div>
                </div>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search products..." />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
                            <th className="p-4">Product Name</th><th className="p-4">Seller</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">{activeTab === 'flagged' ? 'Flag Reason' : 'Status'}</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center p-8" style={{ color: 'var(--muted-text)' }}>Loading…</td></tr>
                        ) : error ? (
                            <tr><td colSpan="5" className="text-center p-8 text-red-500">{error}</td></tr>
                        ) : filteredProducts.length > 0 ? filteredProducts.map(product => (
                            <tr key={product.id} className="border-b hover:bg-[var(--table-row-hover)]" style={{ borderColor: 'var(--border-color)' }}>
                                <td className="p-4">{product.name}</td><td className="p-4">{product.seller}</td>
                                <td className="p-4">{product.date}</td>
                                <td className="p-4">
                                    <StatusBadge status={activeTab} />
                                </td>
                                <td className="p-4 text-center">
                                    <Button color="primary" onClick={() => setSelectedProduct(product)}>View</Button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center p-8" style={{ color: 'var(--muted-text)' }}>No products in this category.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAction={handleAction} tab={activeTab} />
        </div>
    );
};

export default ProductApproval;