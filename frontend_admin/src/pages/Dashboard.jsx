import React from 'react';
import StatCard from '../components/StatCard';
import ApprovalQueues from '../components/ApprovalQueues';
import ActivityFeed from '../components/ActivityFeed';
import AlertTriangleIcon from '../components/icons/AlertTriangleIcon';
import DollarSignIcon from '../components/icons/DollarSignIcon';
import UserCheckIcon from '../components/icons/UserCheckIcon';
import TrendingDownIcon from '../components/icons/TrendingDownIcon';
import ClockIcon from '../components/icons/ClockIcon';

// This is a comment to explain the purpose of this component.
// The Dashboard component is the main page of the admin panel.
// It displays a summary of the most important information.
const Dashboard = ({ navigateTo }) => (
    <div className="space-y-8 rounded-lg shadow-lg p-6 card" style={{ backgroundColor: 'var(--component-bg)', color: 'var(--component-text)' }}>
        <div id="critical-alerts" className="p-4 rounded-lg border card" style={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border-color)' }}>
            <h3 className="font-bold flex items-center gap-2"><AlertTriangleIcon /> Critical Alerts</h3>
            <ul className="list-disc list-inside mt-2" style={{ color: 'var(--text-color)' }}>
                <li>3 Payouts Failed</li>
                <li>Spike in User Reports (+50% in 24h)</li>
                <li>New Seller Application from \"JD Electronics\" waiting {'>'} 48 hours.</li>
            </ul>
        </div>
        <div id="stat-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<DollarSignIcon />} title="Total Revenue" value="$128,430" onClick={() => navigateTo('analytics')} />
            <StatCard icon={<UserCheckIcon />} title="New Customers (24h)" value="84" />
            <StatCard icon={<TrendingDownIcon />} title="Seller Churn Rate" value="1.2%" />
            <StatCard icon={<ClockIcon />} title="Avg Time to Approval" value="18 hours" />
        </div>
        <div id="approval-queues" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ApprovalQueues navigateTo={navigateTo} />
            <ActivityFeed />
        </div>
    </div>
);

export default Dashboard;
