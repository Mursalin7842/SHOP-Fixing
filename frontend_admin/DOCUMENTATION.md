# Admin Panel Documentation

This document is a practical guide to the frontend admin panel—what’s where, how to run it, and how to safely add features. It’s written for junior developers too, with clear pointers for future modifications.

## Project Structure

The project is structured as follows:

```text
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

- **`src/api`**: Contains the API client (`axios` instance) and mock data.
- **`src/assets`**: Contains static assets like images and icons.
- **`src/components`**: Contains reusable UI components.
- **`src/constants`**: Contains constants like Redux action types.
- **`src/layouts`**: Contains layout components like the sidebar and header.
- **`src/pages`**: Contains the main page components.
- **`src/redux`**: Contains the Redux store, actions, and reducers.
- **`src/styles`**: Contains global and component-specific styles.
- **`src/utils`**: Contains utility functions.

## How to Run the Application

1. Install dependencies
    - npm install
2. Start the development server
    - npm run dev
      - The app serves at <http://localhost:5173> by default (Vite may auto-pick another port if 5173 is taken).
3. Production build
    - npm run build
    - Preview the build with npm run preview

## Styling and Theming

- Tailwind CSS is used for utility-first styling.
- Global CSS variables and base styles live in `src/styles/index.css`.
- App-level styles: `src/styles/App.css`.
- If you add new components, prefer Tailwind classes and use CSS variables for colors to respect light/dark modes.

## Redux Implementation

The application uses Redux for state management. The Redux setup is as follows:

- Store: The Redux store is created in `src/redux/store.js` using `configureStore` from `@reduxjs/toolkit`.
- Reducers: Reducers are located in `src/redux/reducers`. The root reducer in `index.js` combines all other reducers.
- Actions: Action creators are located in `src/redux/actions`. Thunk middleware is used to handle asynchronous actions.
- Action Types: Action types are defined as constants in `src/constants/actionTypes.js`.

## Backend Integration

The application is set up to communicate with a Django REST API backend. The API client is configured in `src/api/api.js`. The `baseURL` in this file should be updated to point to the correct backend URL.

Currently, the application uses mock data from `src/api/mockData.js`. To switch to the real API, you will need to:

1. Uncomment the `axios` calls in the Redux action creators (e.g., `src/redux/actions/sellerActions.js`).
2. Remove the mock data dispatch.
3. Ensure the backend API is running and accessible.

### Where to wire API endpoints

- `src/api/api.js`: set `baseURL` and add interceptors (e.g., auth headers, correlation IDs).
- `src/redux/actions/*`: call API methods and dispatch success/error actions.
- `src/redux/reducers/*`: shape and store the data.

## Adding Authentication (later)

No authentication is wired by default. When you add auth:

- Create an auth module under `src/auth/` (e.g., `src/auth/yourIdp.js`).
- Attach tokens in `src/api/api.js` via an axios request interceptor.
- Gate routes/pages in `src/App.jsx` or a top-level router.
- Provide a login/logout UI entry point in `src/layouts/Header.jsx`.

Checklist for auth integration:

- Env variables for the IdP (URL, realm/tenant, client ID, etc.). Store them as `VITE_*` keys.
- Public/private route handling.
- Token refresh and error handling (401 → re-login).
- Logout redirect back to the SPA.

## UI Components and Pages

- Reusable components live in `src/components/`.
- Feature pages live in `src/pages/` and use the components.
- `src/layouts/` contains the shell (Sidebar, Header, AdminLayout).

### Where to change sidebar/menu

- `src/layouts/Sidebar.jsx`: add links, icons, badges.

### Where to change header (title, actions)

- `src/layouts/Header.jsx`: user menu, theme toggle, search.

### Where to change dashboard KPIs

- `src/pages/Dashboard.jsx` and components like `StatCard.jsx` and `ActivityFeed.jsx`.

## Theming and Accessibility

- Colors and spacing are managed via CSS variables and Tailwind.
- For contrast tweaks, adjust variables in `src/styles/index.css`.
- Keep contrast ratios WCAG-friendly, especially in light mode.

## Testing and Quality Gates

- Build: `npm run build`
- Lint: `npm run lint`
- Basic smoke: run the app, click through pages, open the console for errors.

## Common Tasks (where to look)

- Add a new page: `src/pages/`, export a component, add a route/menu entry.
- Add a new API call: `src/api/api.js` (client), `src/redux/actions/*` (dispatch), reducers to store results.
- Add a modal: `src/components/*Modal.jsx` for patterns and styling.
- Change icons: `src/components/icons/` contains SVG React components.

## Troubleshooting

- Port already in use: Vite will pick another; check terminal output or set a port in `vite.config.js`.
- No styles: ensure `src/styles/index.css` is imported in `src/main.jsx`.
- Network errors: confirm API `baseURL` in `src/api/api.js` and backend CORS settings.
