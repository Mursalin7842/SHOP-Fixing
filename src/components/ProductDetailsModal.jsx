import React from 'react';
import CloseIcon from './icons/CloseIcon';
import ShoppingBagIcon from './icons/ShoppingBagIcon';
import DollarSignIcon from './icons/DollarSignIcon';
import ThumbsUpIcon from './icons/ThumbsUpIcon';
import ThumbsDownIcon from './icons/ThumbsDownIcon';
import StatCard from './StatCard';

// This is a comment to explain the purpose of this component.
// The ProductDetailsModal component is a modal dialog that displays the details of a product.
const ProductDetailsModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Product Details: {product.name}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><CloseIcon /></button>
                </div>
                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="md:col-span-1 space-y-4">
                        <img src={`https://placehold.co/600x600/161b22/FFFFFF?text=${product.name.replace(' ', '+')}`} alt={product.name} className="rounded-lg w-full" />
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                            <p className="text-gray-400">Price</p>
                            <p className="text-2xl font-mono">${product.price.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                            <p className="text-gray-400">Stock</p>
                            <p className="text-2xl font-bold">{product.stock} units</p>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h4 className="font-bold text-lg mb-2">Sales & Reviews</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard icon={<ShoppingBagIcon />} title="Units Sold" value={product.sales} />
                                <StatCard icon={<DollarSignIcon />} title="Total Revenue" value={`$${(product.sales * product.price).toFixed(2)}`} />
                            </div>
                            <div className="mt-4 bg-gray-700/50 p-4 rounded-lg">
                                <p className="font-semibold mb-2">Customer Reviews ({product.reviews.positive + product.reviews.negative}) - {product.reviews.rating} ★</p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center text-green-400"><ThumbsUpIcon /> <span className="ml-2">{product.reviews.positive} Positive</span></div>
                                    <div className="flex items-center text-red-400"><ThumbsDownIcon /> <span className="ml-2">{product.reviews.negative} Negative</span></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-2">Linked User Reports</h4>
                            {product.reports.length > 0 ? (
                                <ul className="space-y-2">
                                    {product.reports.map(report => (
                                        <li key={report.id} className="bg-gray-700/50 p-3 rounded-lg">
                                            <p className="font-semibold text-red-400">{report.subject}</p>
                                            <p className="text-xs text-gray-400 font-mono">Report ID: {report.id}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400">No reports found for this product.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
