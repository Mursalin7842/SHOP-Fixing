# Admin Panel Documentation

This document provides an overview of the frontend admin panel, its structure, and how to run it.

## Project Structure

The project is structured as follows:

```
frontend_admin/
├── public/
├── src/
│   ├── api/
│   │   ├── api.js
│   │   └── mockData.js
│   ├── assets/
│   ├── components/
│   │   ├── icons/
│   │   ├── payment/
│   │   ├── seller/
│   │   ├── ActionReasonModal.jsx
│   │   ├── ActivityFeed.jsx
│   │   ├── ApplicationModal.jsx
│   │   ├── ApprovalQueues.jsx
│   │   ├── ProductDetailsModal.jsx
│   │   ├── ProductModal.jsx
│   │   ├── ReportDetailsModal.jsx
│   │   ├── SearchBar.jsx
│   │   └── StatCard.jsx
│   ├── constants/
│   │   └── actionTypes.js
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   ├── pages/
│   │   ├── AnalyticsAndReporting.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LoginPage.jsx
│   │   ├── PaymentManagement.jsx
│   │   ├── ProductApproval.jsx
│   │   ├── SellerApproval.jsx
│   │   ├── SellerManagement.jsx
│   │   ├── ShopApproval.jsx
│   │   └── UserReports.jsx
│   ├── redux/
│   │   ├── actions/
│   │   │   └── sellerActions.js
│   │   ├── reducers/
│   │   │   ├── index.js
│   │   │   └── sellersReducer.js
│   │   └── store.js
│   ├── styles/
│   │   ├── App.css
│   │   └── index.css
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── DOCUMENTATION.md
├── index.html
├── package.json
└── ...
```

-   **`src/api`**: Contains the API client (`axios` instance) and mock data.
-   **`src/assets`**: Contains static assets like images and icons.
-   **`src/components`**: Contains reusable UI components.
-   **`src/constants`**: Contains constants like Redux action types.
-   **`src/layouts`**: Contains layout components like the sidebar and header.
-   **`src/pages`**: Contains the main page components.
-   **`src/redux`**: Contains the Redux store, actions, and reducers.
-   **`src/styles`**: Contains global and component-specific styles.
-   **`src/utils`**: Contains utility functions.

## Redux Implementation

The application uses Redux for state management. The Redux setup is as follows:

-   **Store**: The Redux store is created in `src/redux/store.js` using `configureStore` from `@reduxjs/toolkit`.
-   **Reducers**: Reducers are located in `src/redux/reducers`. The root reducer in `index.js` combines all other reducers.
-   **Actions**: Action creators are located in `src/redux/actions`. Thunk middleware is used to handle asynchronous actions.
-   **Action Types**: Action types are defined as constants in `src/constants/actionTypes.js`.

## How to Run the Application

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Backend Integration

The application is set up to communicate with a Django REST API backend. The API client is configured in `src/api/api.js`. The `baseURL` in this file should be updated to point to the correct backend URL.

Currently, the application uses mock data from `src/api/mockData.js`. To switch to the real API, you will need to:

1.  Uncomment the `axios` calls in the Redux action creators (e.g., `src/redux/actions/sellerActions.js`).
2.  Remove the mock data dispatch.
3.  Ensure the backend API is running and accessible.
