import React from 'react';
import { Link } from 'react-router-dom';
import styles from './WardrobeItem.module.css';

const WardrobeItem = ({ item, onDelete }) => {
    // Stop the link navigation when the delete button is clicked
    const handleDeleteClick = (e) => {
        e.preventDefault();
        onDelete();
    };

    return (
        <Link to={`/item/${item.id}`} className={styles.itemLink}>
            <div className={styles.wardrobeItem}>
                <img src={item.images[0]} alt={item.name} />
                <p>{item.name}</p>
                <button onClick={handleDeleteClick} className={styles.deleteBtn}>
                    &times;
                </button>
            </div>
        </Link>
    );
};

export default WardrobeItem;