// --- Mock Data ---
export const MOCK_SHOPS_DATA = [
  { id: 'shop-1', name: 'JD Electronics', category: 'Electronics', status: 'approved', description: 'High-quality gadgets.', address: '123 Market St, Springfield, IL', documents: [{ id: 1, type: 'NID', number: 'A1X-9982' }] },
  { id: 'shop-2', name: 'Cyber Wear', category: 'Apparel', status: 'approved', description: 'Smart apparel and fashion tech.', address: '77 Fashion Ave, NYC, NY', documents: [{ id: 2, type: 'NID', number: 'B7Q-5521' }] },
];

export const MOCK_PRODUCTS_DATA = [
  { id: 1, shopId: 'shop-1', name: 'Quantum Headset', category: 'Electronics', price: 199.99, stock: 150, status: 'modification', imageUrl: 'https://placehold.co/600x400/1E293B/FFFFFF?text=Quantum+Headset', description: 'High-fidelity gaming headset with immersive 7.1 surround sound.', reviews: [{ id: 1, user: 'GamerGuy92', rating: 5, comment: 'Amazing sound quality!' }, { id: 2, user: 'AudioPhile', rating: 4, comment: 'Great for music, not just gaming.' }], reports: [], variants: [{ color: 'Black', stock: 100 }, { color: 'White', stock: 50 }] },
  { id: 2, shopId: 'shop-2', name: 'Cyber-Knit Jacket', category: 'Apparel', price: 350.00, stock: 80, status: 'approved', imageUrl: 'https://placehold.co/600x400/1E293B/FFFFFF?text=Cyber-Knit+Jacket', description: 'A stylish jacket with integrated smart fabric.', reviews: [{ id: 3, user: 'Fashionista', rating: 5, comment: 'So futuristic and comfortable!' }], reports: [{ id: 1, user: 'ConcernedUser', subject: 'Incorrect Sizing Chart', status: 'open' }], variants: [{ color: 'Black', size: 'M', stock: 20 }, { color: 'Black', size: 'L', stock: 15 }, { color: 'Blue', size: 'M', stock: 25 }, { color: 'Blue', size: 'L', stock: 20 }] },
  { id: 3, shopId: 'shop-2', name: 'Aether-Light Sneakers', category: 'Apparel', price: 120.00, stock: 0, status: 'approved', imageUrl: 'https://placehold.co/600x400/1E293B/FFFFFF?text=Aether-Light', description: 'Lightweight and durable sneakers for everyday use.', reviews: [], reports: [], variants: [{ color: 'White', size: '42', stock: 0 }, { color: 'Black', size: '43', stock: 5 }] },
  { id: 4, shopId: 'shop-1', name: 'Chrono-Watch', category: 'Accessories', price: 425.00, stock: 120, status: 'pending', imageUrl: 'https://placehold.co/600x400/1E293B/FFFFFF?text=Chrono-Watch', description: 'A sleek, modern watch.', reviews: [], reports: [] },
  { id: 5, shopId: 'shop-1', name: 'Hover-Drone X1', category: 'Gadgets', price: 899.00, stock: 30, status: 'rejected', imageUrl: 'https://placehold.co/600x400/1E293B/FFFFFF?text=Hover-Drone', description: 'A professional-grade camera drone.', reviews: [], reports: [] },
];

export const MOCK_ORDERS_DATA = [
  { id: 'ORD-105', shopId: 'shop-2', customer: 'Eve', date: '2025-09-06', status: 'New', total: 550.00,
    customerInfo: { name: 'Eve Adams', email: 'eve@example.com', phone: '+1 555-111-2222', shippingAddress: '123 Market St\nSpringfield, IL 62701\nUSA' },
    items: [
      { productName: 'Cyber-Knit Jacket', qty: 1, color: 'Blue', size: 'M' },
      { productName: 'Aether-Light Sneakers', qty: 1, color: 'Black', size: '43' }
    ] },
  { id: 'ORD-102', shopId: 'shop-2', customer: 'Bob', date: '2025-09-05', status: 'Completed', total: 120.00,
    customerInfo: { name: 'Bob Stone', email: 'bob@example.com', phone: '+1 555-333-4444', shippingAddress: '7 Lakeview Rd\nMadison, WI 53703\nUSA' },
    shipping: { carrier: 'USPS', trackingNumber: '9400 1000 0000 0000 0000 00', shippedAt: '2025-09-05', events: [
      { date: '2025-09-05', text: 'Accepted at USPS Origin Facility' },
      { date: '2025-09-06', text: 'In transit to destination' },
      { date: '2025-09-07', text: 'Out for delivery' },
      { date: '2025-09-07', text: 'Delivered' },
    ] },
    deliveredAt: '2025-09-07',
    items: [{ productName: 'Aether-Light Sneakers', qty: 1, color: 'White', size: '42' }] },
  { id: 'ORD-103', shopId: 'shop-2', customer: 'Charlie', date: '2025-09-04', status: 'Shipped', total: 350.00,
    customerInfo: { name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1 555-777-8888', shippingAddress: '88 Pine Ave\nSeattle, WA 98101\nUSA' },
    shipping: { carrier: 'UPS', trackingNumber: '1Z 999 AA1 01 2345 6784', shippedAt: '2025-09-05', events: [
      { date: '2025-09-05', text: 'Label created' },
      { date: '2025-09-05', text: 'Origin scan' },
      { date: '2025-09-06', text: 'Departed UPS Facility' },
    ] },
    items: [{ productName: 'Cyber-Knit Jacket', qty: 1, color: 'Black', size: 'L' }] },
  { id: 'ORD-104', shopId: 'shop-1', customer: 'Diana', date: '2025-09-05', status: 'Processing', total: 199.99,
    customerInfo: { name: 'Diana Prince', email: 'diana@example.com', phone: '+1 555-999-0000', shippingAddress: '42 Justice Blvd\nMetropolis, NY 10001\nUSA' },
    items: [{ productName: 'Quantum Headset', qty: 1, color: 'Black' }] },
];
