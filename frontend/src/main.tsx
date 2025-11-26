import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import {store} from './store'
import {Provider} from 'react-redux'
import {setMockUser} from './store/slices/authSlice.ts'

if (import.meta.env.DEV) {
    const state = store.getState();
    if (!state.auth.isAuthenticated && !state.auth.user) {
        store.dispatch(setMockUser({
            accessToken: 'mock-dev-token',
            user: {
                id: 1,
                email: 'dev@example.com',
                name: 'Dev User'
            }
        }));
    }
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
)
