import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import ApplicationModal from '../components/ApplicationModal';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { MOCK_DATA } from '../api/mockData'; // Assuming you have shop data in MOCK_DATA

const ShopApproval = ({ initialTab = 'pending' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedShop, setSelectedShop] = useState(null);

    // In a real app, this data would come from Redux
    const [allShops, setAllShops] = useState({
        pending: [
            { id: 'SHP-a1b2', shopName: 'Quantum Gaming Gear', sellerName: 'John Doe', category: 'Electronics', dateApplied: '2025-09-05', description: 'A new shop focusing on high-end gaming peripherals.', history: [{ action: "Submitted", admin: "System", date: "Sep 5, 2025 - 12:01 PM" }] },
            { id: 'SHP-c3d4', shopName: 'Vintage Wears', sellerName: 'Jane Smith', category: 'Apparel', dateApplied: '2025-09-05', description: 'A second-hand clothing store with unique finds.', history: [{ action: "Submitted", admin: "System", date: "Sep 5, 2025 - 02:30 PM" }] },
        ],
        approved: [
            { id: 'SHP-e5f6', shopName: 'Green Thumb Gardens', sellerName: 'Samuel Green', category: 'Home & Garden', dateApplied: '2025-09-04', statusDate: '2025-09-05', description: 'Organic gardening supplies.', history: [] },
        ],
        rejected: [
            { id: 'SHP-g7h8', shopName: 'Gadget Gurus', sellerName: 'Mike Ross', category: 'Electronics', dateApplied: '2025-09-03', statusDate: '2025-09-04', description: 'Refurbished electronics.', history: [] },
        ],
        modification: [
            { id: 'SHP-i9j0', shopName: 'The White Collection', sellerName: 'Emily White', category: 'Home Goods', dateApplied: '2025-09-02', statusDate: '2025-09-03', resubmitted: false, description: 'Minimalist home decor.', history: [] },
        ]
    });

    const handleAction = (id, status, details) => {
        console.log(`Shop ${id} action: ${status}`, details);
    };

    const filteredShops = (allShops[activeTab] || []).filter(s =>
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
        <div className="bg-[var(--component-bg)] rounded-lg shadow-lg text-white">
            <div className="p-6 border-b border-[var(--purple-light)] flex flex-wrap gap-4 justify-between items-center">
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold">Shop Approval</h2>
                    <div className="flex space-x-1 sm:space-x-4 mt-4 border-b border-[var(--purple-light)]">
                        <button onClick={() => setActiveTab('pending')} className={`py-2 px-1 text-sm font-medium ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Pending</button>
                        <button onClick={() => setActiveTab('approved')} className={`py-2 px-1 text-sm font-medium ${activeTab === 'approved' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Approved</button>
                        <button onClick={() => setActiveTab('rejected')} className={`py-2 px-1 text-sm font-medium ${activeTab === 'rejected' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Rejected</button>
                        <button onClick={() => setActiveTab('modification')} className={`py-2 px-1 text-sm font-medium ${activeTab === 'modification' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Modification</button>
                    </div>
                </div>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search shops..." />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-700/50">
                            <th className="p-4">Shop Name</th><th className="p-4">Seller Name</th><th className="p-4">{getStatusDateLabel()}</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredShops.length > 0 ? filteredShops.map(shop => (
                            <tr key={shop.id} className="border-b border-[var(--purple-light)] hover:bg-gray-700/50">
                                <td className="p-4">{shop.shopName}</td><td className="p-4">{shop.sellerName}</td>
                                <td className="p-4">{shop.statusDate || shop.dateApplied}</td>
                                <td className="p-4"><StatusBadge status={activeTab} /></td>
                                <td className="p-4 text-center">
                                    <Button color="purple" onClick={() => setSelectedShop(shop)}>View</Button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center p-8 text-gray-400">No shops in this category.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ApplicationModal application={selectedShop} onClose={() => setSelectedShop(null)} onAction={handleAction} type="shop" />
        </div>
    );
};

export default ShopApproval;