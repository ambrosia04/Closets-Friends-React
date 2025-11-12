import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import ItemDetailPage from './pages/ItemDetailPage/ItemDetailPage';
import EditItemPage from './pages/EditItemPage/EditItemPage';
import { WardrobeProvider } from './context/WardrobeContext';

function App() {
    return (
        <WardrobeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/item/:itemId" element={<ItemDetailPage />} />
                    <Route path="/add" element={<EditItemPage />} />
                    <Route path="/edit/:itemId" element={<EditItemPage />} />
                </Routes>
            </Router>
        </WardrobeProvider>
    );
}

export default App;