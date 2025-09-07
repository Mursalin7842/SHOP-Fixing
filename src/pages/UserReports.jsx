import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ReportDetailsModal from '../components/ReportDetailsModal';

// This is a comment to explain the purpose of this component.
// The UserReports page displays a list of user reports and feedback.
const UserReports = () => {
    const [activeTab, setActiveTab] = useState('new');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);

    const reports = {
        new: [{ id: 'REP-001', userId: 'USR-xyz123', type: 'Bug Report', subject: 'Cannot update profile picture', date: '2025-09-05', status: 'New', description: 'When I try to upload a new profile picture, I get a 500 server error. I have tried multiple image formats.', sellerId: 'SEL-i9j0k112', shopId: 'SHP-c3d4', productId: 'PROD-002' }],
        progress: [{ id: 'REP-002', userId: 'USR-abc789', type: 'Seller Complaint', subject: 'Item not as described', date: '2025-09-04', status: 'In Progress', description: 'The "Cyber-Knit Jacket" I received is a different color than advertised.', sellerId: 'SEL-i9j0k112', shopId: 'SHP-c3d4', productId: 'PROD-003' }],
        resolved: [{ id: 'REP-003', userId: 'USR-def456', type: 'Feedback', subject: 'Love the new layout!', date: '2025-09-03', status: 'Resolved', description: 'Just wanted to say the new website design is fantastic. Much easier to navigate.', sellerId: null, shopId: null, productId: null }],
    };

    const filteredReports = reports[activeTab]?.filter(r =>
        r.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userId.toLowerCase().includes(searchTerm.toLowerCase())) || [];

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-700 flex flex-wrap gap-4 justify-between items-center">
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold">User Reports & Feedback</h2>
                    <div className="flex space-x-1 sm:space-x-4 mt-4 border-b border-gray-700">
                        <button onClick={() => setActiveTab('new')} className={`py-2 px-1 text-sm font-medium ${activeTab === 'new' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>New</button>
                        <button onClick={() => setActiveTab('progress')} className={`py-2 px-1 text-sm font-medium ${activeTab === 'progress' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>In Progress</button>
                        <button onClick={() => setActiveTab('resolved')} className={`py-2 px-1 text-sm font-medium ${activeTab === 'resolved' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Resolved</button>
                    </div>
                </div>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search reports..." />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="bg-gray-700/50"><th className="p-4">Report ID</th><th className="p-4">User ID</th><th className="p-4">Subject</th><th className="p-4">Date</th><th className="p-4 text-center">Actions</th></tr></thead>
                    <tbody>
                        {filteredReports.length > 0 ? filteredReports.map(report => (
                            <tr key={report.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-4 font-mono">{report.id}</td>
                                <td className="p-4 font-mono">{report.userId}</td>
                                <td className="p-4">{report.subject}</td>
                                <td className="p-4">{report.date}</td>
                                <td className="p-4 text-center">
                                    <button onClick={() => setSelectedReport(report)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Details</button>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="5" className="text-center p-8 text-gray-400">No reports in this category.</td></tr>}
                    </tbody>
                </table>
            </div>
            <ReportDetailsModal report={selectedReport} onClose={() => setSelectedReport(null)} />
        </div>
    );
};

export default UserReports;
