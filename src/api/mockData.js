// This is a comment to explain the purpose of this file.
// This file contains mock data for the admin panel.
// In a real application, this data would be fetched from a backend API.
export const MOCK_DATA = {
    sellers: [
        {
            id: 'SEL-i9j0k112', name: 'Jane Smith', email: 'jane.smith@example.com', memberSince: '2025-09-04',
            documents: { nid: 'verified', businessLicense: 'verified' },
            transactions: [
                { id: 'TRN-002', orderId: 'ORD-102', customer: 'Bob', total: 120.00, date: '2025-09-05', status: 'Completed' },
                { id: 'TRN-003', orderId: 'ORD-103', customer: 'Charlie', total: 350.00, date: '2025-09-04', status: 'Completed' },
            ],
            shops: [
                {
                    id: 'SHP-c3d4', name: 'Smith\'s Wares', performance: 'Excellent',
                    products: [
                        { id: 'PROD-003', name: 'Cyber-Knit Jacket', price: 350.00, stock: 80, sales: 450, reviews: { positive: 120, negative: 5, rating: 4.8 }, reports: [{ id: 'REP-002', subject: 'Item not as described' }] },
                        { id: 'PROD-002', name: 'Aether-Light Sneakers', price: 120.00, stock: 200, sales: 800, reviews: { positive: 250, negative: 10, rating: 4.9 }, reports: [] },
                    ]
                }
            ]
        },
        {
            id: 'SEL-e5f6g7h8', name: 'Samuel Green', email: 'sam.green@example.com', memberSince: '2025-09-05',
            documents: { nid: 'pending', businessLicense: 'verified' },
            transactions: [],
            shops: [
                { id: 'SHP-e5f6', name: 'Green Thumb Gardens', performance: 'New', products: [] }
            ]
        },
    ]
};
