import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import SellerDetailsPage from '../components/seller/SellerDetailsPage';
import { fetchSellers } from '../redux/actions/sellerActions';

// This is a comment to explain the purpose of this component.
// The SellerManagement page displays a list of sellers and allows the admin to view their details.
const SellerManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingSeller, setViewingSeller] = useState(null);

    const dispatch = useDispatch();
    const { loading, sellers: allSellers, error } = useSelector(state => state.sellers);

    useEffect(() => {
        dispatch(fetchSellers());
    }, [dispatch]);

    const filteredSellers = allSellers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()));

    if (viewingSeller) {
        return <SellerDetailsPage seller={viewingSeller} onBack={() => setViewingSeller(null)} />
    }

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Seller & Shop Management</h2>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search by seller name or ID..." />
            </div>
            <div className="overflow-x-auto">
                {loading && <p className="text-center p-8">Loading...</p>}
                {error && <p className="text-center p-8 text-red-500">{error}</p>}
                {!loading && !error && (
                    <table className="w-full text-left">
                        <thead><tr className="bg-gray-700/50"><th className="p-4">Seller Name</th><th className="p-4">Seller ID</th><th className="p-4">Shops</th><th className="p-4">Member Since</th><th className="p-4 text-center">Actions</th></tr></thead>
                        <tbody>
                            {filteredSellers.map(seller => (
                                <tr key={seller.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="p-4">{seller.name}</td>
                                    <td className="p-4 font-mono">{seller.id}</td>
                                    <td className="p-4">{seller.shops.length}</td>
                                    <td className="p-4">{seller.memberSince}</td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => setViewingSeller(seller)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SellerManagement;
