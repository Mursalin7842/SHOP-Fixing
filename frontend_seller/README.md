# Seller Panel Frontend

This is the frontend for the seller panel of the e-commerce platform. It is a React application built with Vite and uses Redux for state management and Tailwind CSS for styling.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your machine.

### Installing

1.  Clone the repository to your local machine.
2.  Navigate to the `frontend_seller` directory:
    ```
    cd frontend_seller
    ```
3.  Install the dependencies:
    ```
    npm install
    ```

### Running the Development Server

To run the application in development mode, run the following command:

```
npm run dev
```

This will start the development server and open the application in your browser at `http://localhost:5173`.

## Project Structure

The project is structured as follows:

-   `public/`: Contains the public assets of the application.
-   `src/`: Contains the source code of the application.
    -   `app/`: Contains the Redux store configuration.
    -   `assets/`: Contains the static assets like images and svgs.
    -   `components/`: Contains the reusable React components.
    -   `features/`: Contains the Redux slices for different features.
    -   `pages/`: Contains the page components.
    -   `App.jsx`: The main application component.
    -   `main.jsx`: The entry point of the application.
    -   `index.css`: The main CSS file.
-   `package.json`: Contains the project metadata and dependencies.
-   `vite.config.js`: The configuration file for Vite.

## Built With

-   [React](https://reactjs.org/) - The web framework used.
-   [Vite](https://vitejs.dev/) - The build tool.
-   [Redux](https://redux.js.org/) - The state management library.
-   [Tailwind CSS](https://tailwindcss.com/) - The CSS framework.
