import React from 'react';

const pill = 'px-2 py-1 text-xs font-medium rounded-full inline-flex items-center';

const normalize = (s = '') => String(s).toLowerCase();

const classFor = (status) => {
  const s = normalize(status);
  // Orders-like palette: dark bg + light text
  if (['completed', 'approved', 'active', 'success', 'paid', 'resolved'].includes(s)) return 'bg-green-900 text-green-300';
  if (['shipped', 'in transit', 'dispatch', 'processing'].includes(s)) return s === 'shipped' ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300';
  if (['new', 'pending', 'waiting', 'open', 'queued', 'modification', 'needs changes'].includes(s)) return 'bg-yellow-900 text-yellow-300';
  if (['canceled', 'cancelled', 'rejected', 'failed', 'error', 'closed'].includes(s)) return 'bg-red-900 text-red-300';
  // Fallback neutral
  return 'bg-gray-800 text-gray-300';
};

const formatLabel = (status, label) => {
  if (label) return label;
  const s = normalize(status);
  // Preserve some friendly labels
  if (s === 'modification') return 'Mod Request';
  if (s === 'in transit') return 'In Transit';
  // Title case default
  return String(status).replace(/(^|\s)\w/g, (m) => m.toUpperCase());
};

const StatusBadge = ({ status, label }) => {
  if (!status) return null;
  return (
    <span className={`${pill} ${classFor(status)}`}>{formatLabel(status, label)}</span>
  );
};

export default StatusBadge;
