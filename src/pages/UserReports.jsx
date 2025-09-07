import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import ReportDetailsModal from '../components/ReportDetailsModal';
import { fetchReports } from '../redux/actions/reportActions';

// This is a comment to explain the purpose of this component.
// The UserReports page displays a list of user reports and feedback.
const UserReports = () => {
    const [activeTab, setActiveTab] = useState('new');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);
    const dispatch = useDispatch();
    const { loading, items: reportGroups, error } = useSelector(state => state.reports);

    useEffect(() => { dispatch(fetchReports()); }, [dispatch]);

    const list = useMemo(() => reportGroups[activeTab] || [], [reportGroups, activeTab]);
    const filteredReports = list.filter(r =>
        r.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userId.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
    <div className="rounded-lg shadow-lg card" style={{ backgroundColor: 'var(--component-bg)', color: 'var(--component-text)' }}>
            <div className="p-6 border-b flex flex-wrap gap-4 justify-between items-center" style={{ borderColor: 'var(--purple-light)' }}>
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--purple-light)' }}>User Reports & Feedback</h2>
                    <div className="flex space-x-1 sm:space-x-4 mt-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                        {['new','progress','resolved'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-1 text-sm font-medium ${activeTab === tab ? 'border-b-2' : ''}`} style={{ borderColor: activeTab === tab ? 'var(--purple-light)' : 'transparent', color: activeTab === tab ? 'var(--text-color)' : 'var(--muted-text)' }}>{tab === 'new' ? 'New' : tab === 'progress' ? 'In Progress' : 'Resolved'}</button>
                        ))}
                    </div>
                </div>
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search reports..." />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr style={{ backgroundColor: 'var(--table-header-bg)' }}><th className="p-4">Report ID</th><th className="p-4">User ID</th><th className="p-4">Subject</th><th className="p-4">Date</th><th className="p-4 text-center">Actions</th></tr></thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center p-8" style={{ color: 'var(--muted-text)' }}>Loading…</td></tr>
                        ) : error ? (
                            <tr><td colSpan="5" className="text-center p-8 text-red-500">{error}</td></tr>
                        ) : filteredReports.length > 0 ? filteredReports.map(report => (
                            <tr key={report.id} className="border-b hover:bg-[var(--table-row-hover)]" style={{ borderColor: 'var(--border-color)' }}>
                                <td className="p-4 font-mono">{report.id}</td>
                                <td className="p-4 font-mono">{report.userId}</td>
                                <td className="p-4">{report.subject}</td>
                                <td className="p-4">{report.date}</td>
                                <td className="p-4 text-center">
                                    <button onClick={() => setSelectedReport(report)} className="text-white font-bold py-2 px-4 rounded" style={{ backgroundColor: 'var(--button-primary)', color: 'var(--button-primary-text)' }}>View Details</button>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="5" className="text-center p-8" style={{ color: 'var(--muted-text)' }}>No reports in this category.</td></tr>}
                    </tbody>
                </table>
            </div>
            <ReportDetailsModal report={selectedReport} onClose={() => setSelectedReport(null)} />
        </div>
    );
};

export default UserReports;
