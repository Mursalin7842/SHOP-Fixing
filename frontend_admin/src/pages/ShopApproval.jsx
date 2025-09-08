import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import ApplicationModal from '../components/ApplicationModal';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { fetchShops } from '../redux/actions/shopActions';
import { APPROVE_SHOP, REJECT_SHOP, REQUEST_SHOP_MODIFICATION } from '../constants/actionTypes';

const ShopApproval = ({ initialTab = 'pending' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedShop, setSelectedShop] = useState(null);
    const dispatch = useDispatch();
    const { loading, items: shopGroups, error } = useSelector(state => state.shops);

    useEffect(() => { dispatch(fetchShops()); }, [dispatch]);

    const handleAction = (id, status, details) => {
        switch (status) {
            case 'approved':
                dispatch({ type: APPROVE_SHOP, payload: id });
                break;
            case 'rejected':
                dispatch({ type: REJECT_SHOP, payload: id });
                break;
            case 'modification':
                dispatch({ type: REQUEST_SHOP_MODIFICATION, payload: { id, note: details?.comment || details?.reason } });
                break;
            default:
                break;
        }
    };

    const list = useMemo(() => shopGroups[activeTab] || [], [shopGroups, activeTab]);
    const filteredShops = list.filter(s =>
        s.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusDateLabel = () => {
        switch (activeTab) {
            case 'pending': return 'Date Applied';
            case 'modification': return 'Date Requested';
            default: return 'Status Date';
        }
    };

    return (
    <div className="rounded-lg shadow-lg card" style={{ backgroundColor: 'var(--component-bg)', color: 'var(--component-text)' }}>
            <div className="p-6 border-b flex flex-wrap gap-4 justify-between items-center" style={{ borderColor: 'var(--purple-light)' }}>
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--purple-light)' }}>Shop Approval</h2>
                    <div className="flex space-x-1 sm:space-x-4 mt-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                        {['pending','approved','rejected','modification'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-1 text-sm font-medium ${activeTab === tab ? 'border-b-2' : ''}`} style={{ borderColor: activeTab === tab ? 'var(--purple-light)' : 'transparent', color: activeTab === tab ? 'var(--text-color)' : 'var(--muted-text)' }}>{tab.charAt(0).toUpperCase()+tab.slice(1)}</button>
                        ))}
                    </div>
                </div>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search shops..." />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
                            <th className="p-4">Shop Name</th><th className="p-4">Seller Name</th><th className="p-4">{getStatusDateLabel()}</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center p-8" style={{ color: 'var(--muted-text)' }}>Loading…</td></tr>
                        ) : error ? (
                            <tr><td colSpan="5" className="text-center p-8 text-red-500">{error}</td></tr>
                        ) : filteredShops.length > 0 ? filteredShops.map(shop => (
                            <tr key={shop.id} className="border-b hover:bg-[var(--table-row-hover)]" style={{ borderColor: 'var(--border-color)' }}>
                                <td className="p-4">{shop.shopName}</td><td className="p-4">{shop.sellerName}</td>
                                <td className="p-4">{shop.statusDate || shop.dateApplied}</td>
                                <td className="p-4"><StatusBadge status={activeTab} /></td>
                                <td className="p-4 text-center">
                                    <Button color="primary" onClick={() => setSelectedShop(shop)}>View</Button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center p-8" style={{ color: 'var(--muted-text)' }}>No shops in this category.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ApplicationModal application={selectedShop} onClose={() => setSelectedShop(null)} onAction={handleAction} type="shop" />
        </div>
    );
};

export default ShopApproval;