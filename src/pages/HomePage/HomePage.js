import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWardrobe } from '../../context/WardrobeContext';
import WardrobeItem from '../../components/WardrobeItem/WardrobeItem';
import Header from '../../components/Header/Header';
import Modal from '../../components/Modal/Modal';
import styles from './HomePage.module.css';

const HomePage = () => {
    const { items, deleteItem } = useWardrobe();
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            deleteItem(itemToDelete.id);
            setItemToDelete(null);
        }
    };

    return (
        <>
            <Header />
            {/* REVERTED: We are now using the simpler container you provided */}
            <div className={styles.wardrobeContainer}>
                {items.length === 0 ? (
                    <div className={styles.emptyWardrobe}>
                        <img src="/NothingYet.png" alt="Empty Wardrobe" className={styles.emptyImage} />
                        <Link to="/add" className={styles.addBtnEmpty}>+</Link>
                    </div>
                ) : (
                    <div className={styles.wardrobeGrid}>
                        {items.map(item => (
                            <WardrobeItem
                                key={item.id}
                                item={item}
                                onDelete={() => handleDeleteClick(item)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
            >
                <h2>Delete Item</h2>
                <p>Are you sure you want to delete "{itemToDelete?.name}"?</p>
                <div className={styles.modalActions}>
                    <button onClick={confirmDelete} className="btn btn-danger">Yes, Delete</button>
                    <button onClick={() => setItemToDelete(null)} className="btn btn-secondary">Cancel</button>
                </div>
            </Modal>
        </>
    );
};

export default HomePage;