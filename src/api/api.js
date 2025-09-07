import axios from 'axios';

// This is a comment to explain the purpose of this file.
// This file creates an instance of axios with a base URL for the backend API.
// In a real application, the baseURL would be the URL of the Django backend.
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api', // This should be replaced with the actual backend URL
    headers: {
        'Content-Type': 'application/json'
    }
});

// Note: No auth by default; add an interceptor here when backend auth is ready.

export default apiClient;
