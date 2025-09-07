import React, { useState, useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import StatCard from '../StatCard';
import DollarSignIcon from '../icons/DollarSignIcon';
import ShoppingBagIcon from '../icons/ShoppingBagIcon';
import FileTextIcon from '../icons/FileTextIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import ProductDetailsModal from '../ProductDetailsModal';

// This is a comment to explain the purpose of this component.
// The SellerDetailsPage component displays the details of a single seller.

// Register Chart.js components
Chart.register(
    LineController, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend
);

const SellerDetailsPage = ({ seller, onBack }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [viewingProduct, setViewingProduct] = useState(null);
    const revenueChartRef = useRef(null);

    useEffect(() => {
        if (!revenueChartRef.current) return;
        const ctx = revenueChartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['May', 'Jun', 'Jul', 'Aug'],
                datasets: [{
                    label: 'Revenue',
                    data: [5000, 7200, 6500, 8900],
                    borderColor: '#3B82F6',
                    tension: 0.1
                }]
            },
            options: { plugins: { legend: { display: false } } }
        });
        return () => chart.destroy();
    }, [activeTab]); // Re-run when tab changes to ensure chart is drawn

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-700/50 p-4 rounded-lg h-80"><canvas ref={revenueChartRef}></canvas></div>
                        <div className="space-y-4">
                            <StatCard icon={<DollarSignIcon />} title="Total Revenue" value="$27,600" />
                            <StatCard icon={<ShoppingBagIcon />} title="Total Orders" value="1250" />
                        </div>
                    </div>
                );
            case 'shops':
                return (
                    <div>
                        {seller.shops.map(shop => (
                            <div key={shop.id} className="bg-gray-700/50 p-4 rounded-lg">
                                <h4 className="text-lg font-bold">{shop.name}</h4>
                                <p>Performance: <span className="font-semibold text-green-400">{shop.performance}</span></p>
                                <div className="mt-4">
                                    <h5 className="font-semibold mb-2">Products ({shop.products.length})</h5>
                                    {shop.products.map(product => (
                                        <div key={product.id} onClick={() => setViewingProduct(product)} className="flex justify-between items-center p-2 hover:bg-gray-700 rounded-md cursor-pointer">
                                            <span>{product.name}</span>
                                            <span className="text-sm text-blue-400">View Details</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'transactions':
                return (
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <table className="w-full text-left">
                            <thead><tr><th className="p-2">Date</th><th className="p-2">Order ID</th><th className="p-2">Amount</th><th className="p-2">Status</th></tr></thead>
                            <tbody>
                                {seller.transactions.map(t => (
                                    <tr key={t.id} className="border-b border-gray-600">
                                        <td className="p-2">{t.date}</td>
                                        <td className="p-2 font-mono">{t.orderId}</td>
                                        <td className="p-2 font-mono">${t.total.toFixed(2)}</td>
                                        <td className="p-2 text-green-400">{t.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'documents':
                return (
                    <div className="space-y-4">
                        <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3"><FileTextIcon /> <span>National ID (NID)</span></div>
                            {seller.documents.nid === 'verified' ?
                                <span className="flex items-center gap-2 text-green-400"><CheckCircleIcon /> Verified</span> :
                                <span className="text-yellow-400">Pending</span>}
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3"><FileTextIcon /><span>Business License</span></div>
                            {seller.documents.businessLicense === 'verified' ?
                                <span className="flex items-center gap-2 text-green-400"><CheckCircleIcon /> Verified</span> :
                                <span className="text-yellow-400">Pending</span>}
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <button onClick={onBack} className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6">
                    <ArrowLeftIcon />
                    <span>Back to Seller List</span>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 space-y-4 bg-gray-700/50 p-4 rounded-lg self-start">
                        <h3 className="text-xl font-bold">{seller.name}</h3>
                        <div><p className="text-gray-400">Seller ID</p><p className="font-mono">{seller.id}</p></div>
                        <div><p className="text-gray-400">Email</p><p>{seller.email}</p></div>
                        <div><p className="text-gray-400">Member Since</p><p>{seller.memberSince}</p></div>
                    </div>
                    <div className="md:col-span-3">
                        <div className="flex space-x-1 border-b border-gray-700 mb-4">
                            <button onClick={() => setActiveTab('overview')} className={`py-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''}`}>Overview</button>
                            <button onClick={() => setActiveTab('shops')} className={`py-2 px-4 ${activeTab === 'shops' ? 'border-b-2 border-blue-500' : ''}`}>Shops</button>
                            <button onClick={() => setActiveTab('transactions')} className={`py-2 px-4 ${activeTab === 'transactions' ? 'border-b-2 border-blue-500' : ''}`}>Transactions</button>
                            <button onClick={() => setActiveTab('documents')} className={`py-2 px-4 ${activeTab === 'documents' ? 'border-b-2 border-blue-500' : ''}`}>Documents</button>
                        </div>
                        {renderContent()}
                    </div>
                </div>
            </div>
            <ProductDetailsModal product={viewingProduct} onClose={() => setViewingProduct(null)} />
        </>
    );
};

export default SellerDetailsPage;
