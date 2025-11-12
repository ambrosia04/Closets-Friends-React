import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWardrobe } from '../../context/WardrobeContext';
import styles from './ItemDetailPage.module.css';

const ItemDetailPage = () => {
    const { itemId } = useParams();
    const { getItemById } = useWardrobe();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        const currentItem = getItemById(itemId);
        if (currentItem) {
            setItem(currentItem);
            setMainImage(currentItem.images[0]);
        } else {
            // Optional: Redirect if item not found
            // navigate('/');
        }
    }, [itemId, getItemById, navigate]);

    if (!item) {
        return <div>Item not found. <Link to="/">Go Home</Link></div>;
    }

    return (
        <div className={styles.pageContainer}>
             <Link to="/" className={styles.homeLink}>🏠︎</Link>
             <Link to={`/edit/${item.id}`} className={styles.editLink}>&#9998;</Link>
            <div className={styles.detailContainer}>
                <div className={styles.imageSection}>
                    <img src={mainImage} alt={item.name} className={styles.mainImage} />
                    <div className={styles.thumbnailContainer}>
                        {item.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${item.name} thumbnail ${index + 1}`}
                                className={mainImage === img ? styles.active : ''}
                                onClick={() => setMainImage(img)}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.infoSection}>
                    <h1>{item.name}</h1>
                    <p><strong>Price:</strong> ${item.price || 'N/A'}</p>
                    <p><strong>Materials:</strong> {item.materials?.join(', ') || 'N/A'}</p>
                    <p><strong>Vibe:</strong> {item.vibe?.join(', ') || 'N/A'}</p>
                    <p><strong>Date of Purchase:</strong> {item.purchaseDate || 'N/A'}</p>
                    <p><strong>Place of Purchase:</strong> {item.purchasePlace || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailPage;