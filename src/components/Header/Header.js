import React from 'react';
import { Link } from 'react-router-dom';
import { useWardrobe } from '../../context/WardrobeContext';
import styles from './Header.module.css';

const Header = () => {
    const { items, setItems } = useWardrobe();

    const handleExport = () => {
        if (items.length === 0) {
            alert("Your wardrobe is empty. Nothing to export!");
            return;
        }
        const dataStr = JSON.stringify(items, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'my_wardrobe.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedItems = JSON.parse(e.target.result);
                if (Array.isArray(importedItems)) {
                    // Basic validation can be added here
                    setItems(importedItems);
                    alert('Wardrobe imported successfully!');
                } else {
                    alert('Invalid file format.');
                }
            } catch (error) {
                alert('Error reading the file. Please ensure it is a valid JSON file.');
            }
        };
        reader.readAsText(file);
        // Reset the input value to allow importing the same file again
        event.target.value = null;
    };


    return (
        <header className={styles.mainHeader}>
            <Link to="/add" className={styles.addBtn}>+</Link>
            <Link to="/">
                <img src="/LOGO.png" alt="Wardrobe Logo" className={styles.logo} />
            </Link>
            <div className={styles.ioButtons}>
                <label htmlFor="import-json" className={styles.ioBtn}>Reload Wardrobe</label>
                <input
                    type="file"
                    id="import-json"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleImport}
                />
                <button onClick={handleExport} className={styles.ioBtn}>Save Wardrobe</button>
            </div>
        </header>
    );
};

export default Header;