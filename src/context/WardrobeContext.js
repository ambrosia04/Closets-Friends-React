import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WardrobeContext = createContext();

export function useWardrobe() {
    return useContext(WardrobeContext);
}

export const WardrobeProvider = ({ children }) => {
    // Item state (as before)
     const [items, setItems] = useLocalStorage('wardrobeItems', []);

    // State for our dynamic options
    const [materials, setMaterials] = useLocalStorage('wardrobeMaterials', []);
    const [vibes, setVibes] = useLocalStorage('wardrobeVibes', []);

    // Effect to load initial options from JSON if local storage is empty
    useEffect(() => {
        // Seed materials if they don't exist yet
        if (materials.length === 0) {
            fetch('/materials.json')
                .then(res => res.json())
                .then(data => setMaterials(data.sort()))
                .catch(err => console.error("Failed to seed materials:", err));
        }
        // Seed vibes if they don't exist yet
        if (vibes.length === 0) {
            fetch('/vibes.json')
                .then(res => res.json())
                .then(data => setVibes(data.sort()))
                .catch(err => console.error("Failed to seed vibes:", err));
        }
        // The empty array [] means this effect runs only once when the app starts
    }, [materials, vibes, setMaterials, setVibes]);

    // Functions to add new options (case-insensitive check)
    const addMaterial = (newMaterial) => {
        const trimmed = newMaterial.trim();
        if (trimmed && !materials.find(m => m.toLowerCase() === trimmed.toLowerCase())) {
            setMaterials(prev => [...prev, trimmed].sort());
        }
    };

    const addVibe = (newVibe) => {
        const trimmed = newVibe.trim();
        if (trimmed && !vibes.find(v => v.toLowerCase() === trimmed.toLowerCase())) {
            setVibes(prev => [...prev, trimmed].sort());
        }
    };

    // Item management functions (as before)
    const addItem = (item) => {
        setItems(prevItems => [...prevItems, item]);
    };

    const updateItem = (updatedItem) => {
        setItems(prevItems =>
            prevItems.map(item => (item.id === updatedItem.id ? updatedItem : item))
        );
    };

    const deleteItem = (itemId) => {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const getItemById = (itemId) => {
        return items.find(item => item.id.toString() === itemId.toString());
    };

    // This value object now contains everything!
    const value = {
        items,
        setItems,
        addItem,
        updateItem,
        deleteItem,
        getItemById,
        materials,   // <-- Now providing materials
        addMaterial, // <-- Now providing the function
        vibes,       // <-- Now providing vibes
        addVibe,     // <-- Now providing the function
    };

    return (
        <WardrobeContext.Provider value={value}>
            {children}
        </WardrobeContext.Provider>
    );
};