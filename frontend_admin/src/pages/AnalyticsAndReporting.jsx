import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContextUtils';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import StatCard from '../components/StatCard';
import DollarSignIcon from '../components/icons/DollarSignIcon';
import ShoppingBagIcon from '../components/icons/ShoppingBagIcon';
import UsersIcon from '../components/icons/UsersIcon';
import StoreIcon from '../components/icons/StoreIcon';

// This is a comment to explain the purpose of this component.
// The AnalyticsAndReporting page displays a dashboard with charts and tables for sales and seller performance.

// Register Chart.js components
Chart.register(
    BarController, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement, Title, Tooltip, Legend
);

const AnalyticsAndReporting = () => {
    const { theme: _theme } = useAppContext();
    const barChartRef = useRef(null);

    useEffect(() => {
        if (!barChartRef.current) return;

        const ctx = barChartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                datasets: [{
                    label: 'Sales',
                    data: [12000, 19000, 15000, 21000, 18000, 24000, 22000, 28000],
                    backgroundColor: '#3B82F6',
                    borderColor: '#3B82F6',
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#9CA3AF' } },
                    y: { grid: { color: '#374151' }, ticks: { color: '#9CA3AF', callback: (value) => `$${value / 1000}k` } }
                }
            }
        });

        return () => chart.destroy();
    }, []);

    const topProducts = [
        { rank: 1, name: 'Cyber-Knit Jacket', units: 450, revenue: 157500 },
        { rank: 2, name: 'Quantum Headset', units: 320, revenue: 63996.80 },
        { rank: 3, name: 'Chrono-Watch', units: 210, revenue: 89250 },
    ];
    const topSellers = [
        { rank: 1, name: 'Smith\'s Wares', orders: 890, revenue: 231400 },
        { rank: 2, name: 'JD Electronics', orders: 650, revenue: 130000 },
        { rank: 3, name: 'Time Keepers Inc.', orders: 430, revenue: 182750 },
    ];

    return (
    <div className="space-y-8 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--component-bg)', color: 'var(--component-text)' }}>
            <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: 'var(--purple-light)' }}>
                <h2 className="text-3xl font-bold" style={{ color: 'var(--purple-light)' }}>Analytics & Reporting</h2>
                <div className="py-2 px-4 rounded-lg" style={{ backgroundColor: 'var(--chip-bg)' }}>Last 30 Days</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<DollarSignIcon />} title="Gross Sales" value="$152,870" />
                <StatCard icon={<ShoppingBagIcon />} title="Net Revenue" value="$122,296" />
                <StatCard icon={<UsersIcon />} title="Orders" value="1,432" />
                <StatCard icon={<StoreIcon />} title="Avg. Order Value" value="$106.75" />
            </div>
            <div className="p-6 rounded-lg h-96 border" style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-color)' }}>
                <h3 className="text-lg font-bold mb-4">Sales Over Time</h3>
                <canvas ref={barChartRef}></canvas>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-color)' }}>
                    <h3 className="text-lg font-bold mb-4">Top Selling Products</h3>
                    <table className="w-full text-left">
                        <thead><tr className="border-b" style={{ backgroundColor: 'var(--table-header-bg)', borderColor: 'var(--border-color)' }}><th className="p-2">Rank</th><th className="p-2">Product</th><th className="p-2">Units Sold</th><th className="p-2">Revenue</th></tr></thead>
                        <tbody>{topProducts.map(p => <tr key={p.rank} className="border-b" style={{ borderColor: 'var(--border-color)' }}><td className="p-2">{p.rank}</td><td className="p-2">{p.name}</td><td className="p-2">{p.units}</td><td className="p-2 font-mono">${p.revenue.toFixed(2)}</td></tr>)}</tbody>
                    </table>
                </div>
                <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--surface-1)', borderColor: 'var(--border-color)' }}>
                    <h3 className="text-lg font-bold mb-4">Top Performing Sellers</h3>
                    <table className="w-full text-left">
                        <thead><tr className="border-b" style={{ backgroundColor: 'var(--table-header-bg)', borderColor: 'var(--border-color)' }}><th className="p-2">Rank</th><th className="p-2">Seller</th><th className="p-2">Orders</th><th className="p-2">Revenue</th></tr></thead>
                        <tbody>{topSellers.map(s => <tr key={s.rank} className="border-b" style={{ borderColor: 'var(--border-color)' }}><td className="p-2">{s.rank}</td><td className="p-2">{s.name}</td><td className="p-2">{s.orders}</td><td className="p-2 font-mono">${s.revenue.toFixed(2)}</td></tr>)}</tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

export default AnalyticsAndReporting;
