import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import { AppProvider } from './context/AppContext'
import './styles/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AppProvider>
        <App />
      </AppProvider>
    </Provider>
  </StrictMode>,
)

// expose for non-hook dispatch in utility handlers
if (typeof window !== 'undefined') {
  window.__STORE__ = store;
}
