import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './skeleton.css'
import './fonts/Neirizi.ttf'
import { FavoritesProvider } from './context/FavoritesContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <FavoritesProvider>
        <App />
        </FavoritesProvider>
    </React.StrictMode>
);