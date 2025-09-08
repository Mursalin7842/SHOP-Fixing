import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import ApplicationModal from '../components/ApplicationModal';
import { fetchSellers, approveSeller, rejectSeller } from '../redux/actions/sellerActions';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';

const SellerApproval = ({ initialTab = 'pending' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSeller, setSelectedSeller] = useState(null);

    const dispatch = useDispatch();
    const { loading, sellers: allSellers, error } = useSelector(state => state.sellers);

    useEffect(() => {
        dispatch(fetchSellers());
    }, [dispatch]);

    const filteredSellers = allSellers
        .filter(s => (activeTab === 'pending' ? s.status === 'pending' : activeTab === 'approved' ? s.status === 'approved' : activeTab === 'rejected' ? s.status === 'rejected' : true))
        .filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAction = (id, status) => {
        if (status === 'approved') dispatch(approveSeller(id));
        if (status === 'rejected') dispatch(rejectSeller(id));
    };

    const getStatusDateLabel = () => {
        switch (activeTab) {
            case 'pending': return 'Date Applied';
            case 'modification': return 'Date Requested';
            default: return 'Status Date';
        }
    };

    return (
    <div className="rounded-lg shadow-lg" style={{ backgroundColor: 'var(--component-bg)', color: 'var(--component-text)' }}>
            <div className="p-6 border-b flex flex-wrap gap-4 justify-between items-center" style={{ borderColor: 'var(--purple-light)' }}>
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--purple-light)' }}>Seller Approval</h2>
                    <div className="flex space-x-1 sm:space-x-4 mt-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                        {['pending','approved','rejected','modification'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-1 text-sm font-medium ${activeTab === tab ? 'border-b-2' : ''}`} style={{ borderColor: activeTab === tab ? 'var(--purple-light)' : 'transparent', color: activeTab === tab ? 'var(--text-color)' : 'var(--muted-text)' }}>{tab.charAt(0).toUpperCase()+tab.slice(1)}</button>
                        ))}
                    </div>
                </div>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search sellers..." />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
                            <th className="p-4">Seller Name</th><th className="p-4">Shop Name</th>
                            <th className="p-4">{getStatusDateLabel()}</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && <tr><td colSpan="5" className="text-center p-8">Loading...</td></tr>}
                        {error && <tr><td colSpan="5" className="text-center p-8 text-red-500">{error}</td></tr>}
                        {!loading && !error && filteredSellers.length > 0 ? filteredSellers.map(seller => (
                            <tr key={seller.id} className="border-b hover:bg-[var(--table-row-hover)]" style={{ borderColor: 'var(--border-color)' }}>
                                <td className="p-4">{seller.name}</td><td className="p-4">{seller.shopName}</td>
                                <td className="p-4">{seller.dateApplied}</td>
                                <td className="p-4"><StatusBadge status={seller.status || 'pending'} /></td>
                                <td className="p-4 text-center space-x-2">
                                    <Button color="primary" onClick={() => setSelectedSeller(seller)}>View</Button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center p-8" style={{ color: 'var(--muted-text)' }}>No sellers in this category.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ApplicationModal application={selectedSeller} onClose={() => setSelectedSeller(null)} onAction={handleAction} type="seller" />
        </div>
    );
};

export default SellerApproval;