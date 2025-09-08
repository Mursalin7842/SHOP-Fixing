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
                        <div className="p-4 rounded-lg h-80" style={{ backgroundColor: 'var(--surface-2)' }}><canvas ref={revenueChartRef}></canvas></div>
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
                            <div key={shop.id} className="p-4 rounded-lg border mb-4" style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border-color)' }}>
                                <h4 className="text-lg font-bold">{shop.name}</h4>
                                <p>
                                    Performance: 
                                    <span className="font-semibold ml-1 px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--badge-green-bg)', color: 'var(--badge-green-text)' }}>{shop.performance}</span>
                                </p>
                                <div className="mt-4">
                                    <h5 className="font-semibold mb-2">Products ({shop.products.length})</h5>
                                    {shop.products.map(product => (
                                        <div
                                            key={product.id}
                                            onClick={() => setViewingProduct(product)}
                                            tabIndex={0}
                                            className="flex justify-between items-center p-2 rounded-md cursor-pointer border mb-2 hover:bg-[var(--table-row-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--purple-light)]"
                                            style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-color)' }}
                                        >
                                            <span>{product.name}</span>
                                            <span className="text-sm font-medium" style={{ color: 'var(--purple-light)' }}>View Details</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'transactions':
                return (
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border-color)' }}>
                        <table className="w-full text-left">
                            <thead><tr style={{ backgroundColor: 'var(--table-header-bg)' }}><th className="p-2">Date</th><th className="p-2">Order ID</th><th className="p-2">Amount</th><th className="p-2">Status</th></tr></thead>
                            <tbody>
                                {seller.transactions.map(t => (
                                    <tr key={t.id} className="border-b hover:bg-[var(--table-row-hover)]" style={{ borderColor: 'var(--border-color)' }}>
                                        <td className="p-2">{t.date}</td>
                                        <td className="p-2 font-mono">{t.orderId}</td>
                                        <td className="p-2 font-mono">${t.total.toFixed(2)}</td>
                                        <td className="p-2">
                                            <span className="px-2 py-0.5 rounded text-sm font-medium" style={{ backgroundColor: 'var(--badge-green-bg)', color: 'var(--badge-green-text)' }}>{t.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'documents':
                return (
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg flex items-center justify-between border" style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border-color)' }}>
                            <div className="flex items-center gap-3"><FileTextIcon /> <span>National ID (NID)</span></div>
                            {seller.documents.nid === 'verified' ? (
                                <span className="flex items-center gap-2 px-2 py-0.5 rounded text-sm font-medium" style={{ backgroundColor: 'var(--badge-green-bg)', color: 'var(--badge-green-text)' }}><CheckCircleIcon /> Verified</span>
                            ) : (
                                <span className="px-2 py-0.5 rounded text-sm font-medium" style={{ backgroundColor: 'var(--badge-yellow-bg)', color: 'var(--badge-yellow-text)' }}>Pending</span>
                            )}
                        </div>
                        <div className="p-4 rounded-lg flex items-center justify-between border" style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border-color)' }}>
                            <div className="flex items-center gap-3"><FileTextIcon /><span>Business License</span></div>
                            {seller.documents.businessLicense === 'verified' ? (
                                <span className="flex items-center gap-2 px-2 py-0.5 rounded text-sm font-medium" style={{ backgroundColor: 'var(--badge-green-bg)', color: 'var(--badge-green-text)' }}><CheckCircleIcon /> Verified</span>
                            ) : (
                                <span className="px-2 py-0.5 rounded text-sm font-medium" style={{ backgroundColor: 'var(--badge-yellow-bg)', color: 'var(--badge-yellow-text)' }}>Pending</span>
                            )}
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <>
            <div className="rounded-lg shadow-lg p-6 border" style={{ backgroundColor: 'var(--surface-1)', color: 'var(--component-text)', borderColor: 'var(--border-color)' }}>
                <button onClick={onBack} className="flex items-center space-x-2 mb-6" style={{ color: 'var(--purple-light)' }}>
                    <ArrowLeftIcon />
                    <span>Back to Seller List</span>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 space-y-4 p-4 rounded-lg self-start border" style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border-color)' }}>
                        <h3 className="text-xl font-bold">{seller.name}</h3>
                        <div><p style={{ color: 'var(--muted-text)' }}>Seller ID</p><p className="font-mono">{seller.id}</p></div>
                        <div><p style={{ color: 'var(--muted-text)' }}>Email</p><p>{seller.email}</p></div>
                        <div><p style={{ color: 'var(--muted-text)' }}>Member Since</p><p>{seller.memberSince}</p></div>
                    </div>
                    <div className="md:col-span-3">
                        <div className="flex space-x-1 border-b mb-4" style={{ borderColor: 'var(--border-color)' }}>
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-2 px-4 rounded-t-md hover:bg-[var(--table-row-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--purple-light)] ${activeTab === 'overview' ? 'border-b-2' : ''}`}
                                style={activeTab === 'overview' ? { borderColor: 'var(--purple-light)', color: 'var(--purple-light)' } : {}}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('shops')}
                                className={`py-2 px-4 rounded-t-md hover:bg-[var(--table-row-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--purple-light)] ${activeTab === 'shops' ? 'border-b-2' : ''}`}
                                style={activeTab === 'shops' ? { borderColor: 'var(--purple-light)', color: 'var(--purple-light)' } : {}}
                            >
                                Shops
                            </button>
                            <button
                                onClick={() => setActiveTab('transactions')}
                                className={`py-2 px-4 rounded-t-md hover:bg-[var(--table-row-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--purple-light)] ${activeTab === 'transactions' ? 'border-b-2' : ''}`}
                                style={activeTab === 'transactions' ? { borderColor: 'var(--purple-light)', color: 'var(--purple-light)' } : {}}
                            >
                                Transactions
                            </button>
                            <button
                                onClick={() => setActiveTab('documents')}
                                className={`py-2 px-4 rounded-t-md hover:bg-[var(--table-row-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--purple-light)] ${activeTab === 'documents' ? 'border-b-2' : ''}`}
                                style={activeTab === 'documents' ? { borderColor: 'var(--purple-light)', color: 'var(--purple-light)' } : {}}
                            >
                                Documents
                            </button>
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
