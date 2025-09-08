import React from 'react';
import { CloseIcon } from './icons/index.jsx';

const Modal = ({ children, onClose, title }) => (
  <div className="fixed inset-0 bg-[var(--overlay-bg)] flex items-center justify-center z-50 p-4 animate-fade-in">
    <div className="rounded-lg shadow-xl w-full max-w-2xl card elevated-card">
  <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
        <h3 className="text-xl font-bold">{title}</h3>
      <button onClick={onClose} className="text-[var(--muted-text)] hover:text-[var(--text-color)]">✕</button>
      </div>
      <div className="p-6 overflow-y-auto">{children}</div>
    </div>
  </div>
);

export default Modal;
