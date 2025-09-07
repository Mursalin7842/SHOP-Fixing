import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import ApplicationModal from '../components/ApplicationModal';
import { fetchSellers } from '../redux/actions/sellerActions';
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

    const filteredSellers = allSellers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAction = (id, status, details) => {
        console.log(`Seller ${id} action: ${status}`, details);
    };

    const getStatusDateLabel = () => {
        switch (activeTab) {
            case 'pending': return 'Date Applied';
            case 'modification': return 'Date Requested';
            default: return 'Status Date';
        }
    };

    return (
        <div className="bg-[var(--component-bg)] rounded-lg shadow-lg text-white">
            <div className="p-6 border-b border-[var(--purple-light)] flex flex-wrap gap-4 justify-between items-center">
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold">Seller Approval</h2>
                    <div className="flex space-x-1 sm:space-x-4 mt-4 border-b border-[var(--purple-light)]">
                        <button onClick={() => setActiveTab('pending')} className={`py-2 px-1 text-sm font-medium ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Pending</button>
                        <button onClick={() => setActiveTab('approved')} className={`py-2 px-1 text-sm font-medium ${activeTab === 'approved' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Approved</button>
                        <button onClick={() => setActiveTab('rejected')} className={`py-2 px-1 text-sm font-medium ${activeTab === 'rejected' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Rejected</button>
                        <button onClick={() => setActiveTab('modification')} className={`py-2 px-1 text-sm font-medium ${activeTab === 'modification' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Modification</button>
                    </div>
                </div>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search sellers..." />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-700/50">
                            <th className="p-4">Seller Name</th><th className="p-4">Shop Name</th>
                            <th className="p-4">{getStatusDateLabel()}</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && <tr><td colSpan="5" className="text-center p-8">Loading...</td></tr>}
                        {error && <tr><td colSpan="5" className="text-center p-8 text-red-500">{error}</td></tr>}
                        {!loading && !error && filteredSellers.length > 0 ? filteredSellers.map(seller => (
                            <tr key={seller.id} className="border-b border-[var(--purple-light)] hover:bg-gray-700/50">
                                <td className="p-4">{seller.name}</td><td className="p-4">{seller.shopName}</td>
                                <td className="p-4">{seller.dateApplied}</td>
                                <td className="p-4"><StatusBadge status={seller.status || 'Pending'} /></td>
                                <td className="p-4 text-center space-x-2">
                                    <Button color="purple" onClick={() => setSelectedSeller(seller)}>View</Button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center p-8 text-gray-400">No sellers in this category.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ApplicationModal application={selectedSeller} onClose={() => setSelectedSeller(null)} onAction={handleAction} type="seller" />
        </div>
    );
};

export default SellerApproval;