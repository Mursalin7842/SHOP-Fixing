import React from 'react';

const pill = 'px-2 py-1 text-xs font-medium rounded-full';

const OrderStatus = ({ status }) => {
  switch (status) {
    case 'approved':
      return <span className={`${pill} bg-[var(--status-approved-bg)] text-[var(--status-approved-text)]`}>Approved</span>;
    case 'pending':
      return <span className={`${pill} bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]`}>Pending Admin</span>;
    case 'modification':
      return <span className={`${pill} bg-[var(--status-modification-bg)] text-[var(--status-modification-text)]`}>Mod Request</span>;
    case 'rejected':
      return <span className={`${pill} bg-[var(--status-rejected-bg)] text-[var(--status-rejected-text)]`}>Rejected</span>;
    default:
      return null;
  }
};

export default OrderStatus;
