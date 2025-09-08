import React, { useEffect, useRef } from 'react';
import StatCard from '../components/StatCard';
import NotificationItem from '../components/NotificationItem';
import { DollarSignIcon, ShoppingCartIcon, PackageIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon, XCircleIcon, StoreIcon, MessageSquareIcon } from '../components/icons/index.jsx';

const SellerDashboardPage = ({ setActivePage, setProductFilter }) => {
  const chartRef = useRef(null);
  useEffect(() => {
    if (!chartRef.current || !window.Chart) return;
    const ctx = chartRef.current.getContext('2d');
    const chart = new window.Chart(ctx, { type: 'line', data: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], datasets: [{ label: 'Sales', data: [1200, 1900, 1500, 2100, 1800, 2400, 2800], backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: '#3B82F6', tension: 0.4, fill: true }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: '#374151' }, ticks: { color: '#9CA3AF' } }, y: { grid: { color: '#374151' }, ticks: { color: '#9CA3AF', callback: (value) => `$${value / 1000}k` } } } } });
    return () => chart.destroy();
  }, []);

  const handleStatClick = (page, filter = 'all') => {
    setProductFilter(filter);
    setActivePage(page);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<DollarSignIcon />} title="Total Revenue" value="$27,600" growth="+8.2%" onClick={() => setActivePage('payouts')} />
        <StatCard icon={<ShoppingCartIcon />} title="Total Orders" value="3" growth="+2.1%" onClick={() => setActivePage('orders')} />
        <StatCard icon={<PackageIcon />} title="Listed Products" value="2" onClick={() => handleStatClick('products', 'approved')} />
        <StatCard icon={<ClockIcon />} title="Pending Products" value="1" onClick={() => handleStatClick('products', 'pending')} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card elevated-card p-6 h-96">
          <h3 className="text-lg font-bold mb-4">Sales Overview</h3>
          <canvas ref={chartRef}></canvas>
        </div>
        <div className="card elevated-card p-6">
          <h3 className="text-lg font-bold mb-4">Admin Notifications</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            <NotificationItem icon={<CheckCircleIcon />} text="Product Approved" details="'Cyber-Knit Jacket' is now live." time="2 hours ago" onClick={() => handleStatClick('products', 'approved')} />
            <NotificationItem icon={<AlertCircleIcon />} text="Modification Request" details="'Quantum Headset' images are too low quality." time="1 day ago" onClick={() => handleStatClick('products', 'modification')} />
            <NotificationItem icon={<XCircleIcon />} text="Product Rejected" details="'Hover-Drone X1' violates our policies." time="3 days ago" onClick={() => handleStatClick('products', 'rejected')} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div onClick={() => setActivePage('shop')} className="card elevated-card p-5 flex items-center gap-3 hover:bg-[var(--surface-2)] cursor-pointer">
          <span className="p-2 rounded bg-[var(--surface-2)]"><StoreIcon /></span>
          <div>
            <div className="font-semibold">Manage Shops</div>
            <div className="text-sm text-[var(--muted-text)]">Switch active shop, submit new shop requests</div>
          </div>
        </div>
        <div onClick={() => setActivePage('reviews')} className="card elevated-card p-5 flex items-center gap-3 hover:bg-[var(--surface-2)] cursor-pointer">
          <span className="p-2 rounded bg-[var(--surface-2)]"><CheckCircleIcon /></span>
          <div>
            <div className="font-semibold">Reviews & Reports</div>
            <div className="text-sm text-[var(--muted-text)]">Track customer reviews and report issues</div>
          </div>
        </div>
        <div onClick={() => setActivePage('support')} className="card elevated-card p-5 flex items-center gap-3 hover:bg-[var(--surface-2)] cursor-pointer">
          <span className="p-2 rounded bg-[var(--surface-2)]"><MessageSquareIcon /></span>
          <div>
            <div className="font-semibold">Support</div>
            <div className="text-sm text-[var(--muted-text)]">Open a ticket or continue conversations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
