import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWardrobe } from '../../context/WardrobeContext';
import { compressImage } from '../../utils/imageCompressor';
// CHANGE 1: We no longer need the old component
// import MultiSelectButtons from '../../components/MultiSelectButtons/MultiSelectButtons'; 
import EditableMultiSelect from '../../components/EditableMultiSelect/EditableMultiSelect';
import styles from './EditItemPage.module.css';

const EditItemPage = () => {
    const { itemId } = useParams();
    const navigate = useNavigate();
    
    // CHANGE 2: Get the new options and functions from the context
    const {
        getItemById,
        addItem,
        updateItem,
        materials, // <-- Get materials from context
        addMaterial, // <-- Get function to add a material
        vibes,       // <-- Get vibes from context
        addVibe      // <-- Get function to add a vibe
    } = useWardrobe();
    
    const isEditMode = Boolean(itemId);

    // This state remains the same
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        purchaseDate: '',
        purchasePlace: '',
        materials: [],
        vibe: [],
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);

    // CHANGE 3: Remove the local state for options. The context now manages this.
    // const [materialOptions, setMaterialOptions] = useState([]);
    // const [vibeOptions, setVibeOptions] = useState([]);

    // CHANGE 4: Remove the useEffect that fetches from JSON. The context now handles this.
    // useEffect(() => {
    //     fetch('/materials.json')
    //         .then(res => res.json())
    //         .then(data => setMaterialOptions(data))
    //         .catch(err => console.error("Failed to load materials:", err));
    //
    //     fetch('/vibes.json')
    //         .then(res => res.json())
    //         .then(data => setVibeOptions(data))
    //         .catch(err => console.error("Failed to load vibes:", err));
    // }, []);

    // This useEffect is perfect and needs no changes
    useEffect(() => {
        if (isEditMode) {
            const item = getItemById(itemId);
            if (item) {
                setFormData({
                    ...item,
                    materials: item.materials || [],
                    vibe: item.vibe || []
                });
                const previews = [...item.images];
                while (previews.length < 4) previews.push(null);
                setImagePreviews(previews);
            }
        }
    }, [itemId, isEditMode, getItemById]);

    // All these handlers are perfect and need no changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelectChange = (fieldName, newSelection) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: newSelection
        }));
    };

    const handleImageChange = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const compressedUrl = await compressImage(file);
            const newImageUrls = [...imagePreviews];
            newImageUrls[index] = compressedUrl;
            setImagePreviews(newImageUrls);
            setFormData(prev => ({ ...prev, images: newImageUrls.filter(Boolean) }));
        } catch (error) {
            console.error("Image processing failed:", error);
            alert("There was an error processing the image.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) {
            alert('Please enter a name for the item.');
            return;
        }
        if (formData.images.length === 0) {
            alert('Please add at least one photo.');
            return;
        }

        if (isEditMode) {
            updateItem(formData);
        } else {
            addItem({ ...formData, id: Date.now() });
        }
        navigate('/');
    };

    return (
        <div className={styles.editContainer}>
            <h2>{isEditMode ? 'Edit Item' : 'Add New Item'}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    {/* Left Column is unchanged */}
                    <div className={styles.formColumn}>
                         <div className={styles.photoSection}>
                            <label>Photos</label>
                            <div className={styles.photoUploadMain}>
                                 <label htmlFor="main-photo-upload" className={styles.photoBox} style={{ backgroundImage: `url(${imagePreviews[0]})` }}>
                                    {!imagePreviews[0] && '+'}
                                 </label>
                                <input type="file" id="main-photo-upload" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageChange(e, 0)}/>
                            </div>
                             <div className={styles.photoThumbnails}>
                                {[1, 2, 3].map(index => (
                                     <React.Fragment key={index}>
                                         <label htmlFor={`thumb${index}-upload`} className={`${styles.photoBox} ${styles.small}`} style={{ backgroundImage: `url(${imagePreviews[index]})` }}>
                                            {!imagePreviews[index] && '+'}
                                        </label>
                                        <input type="file" id={`thumb${index}-upload`} accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageChange(e, index)} />
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <label htmlFor="price">Price of Purchase</label>
                        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} placeholder="e.g., 29.99" />
                    </div>

                     {/* Right Column */}
                    <div className={styles.formColumn}>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Blue Denim Jacket" required />

                        {/* CHANGE 5: Replace the component and its props */}
                        <label>Materials</label>
                        <EditableMultiSelect
                            options={materials} // Use "materials" from context
                            selectedOptions={formData.materials}
                            onChange={(selection) => handleMultiSelectChange('materials', selection)}
                            onAddOption={addMaterial} // Pass the add function
                        />

                        {/* CHANGE 6: Do the same for Vibes */}
                        <label>Vibe</label>
                         <EditableMultiSelect
                            options={vibes} // Use "vibes" from context
                            selectedOptions={formData.vibe}
                            onChange={(selection) => handleMultiSelectChange('vibe', selection)}
                            onAddOption={addVibe} // Pass the add function
                        />

                        <label htmlFor="purchase-date">Date of Purchase</label>
                        <input type="date" id="purchase-date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} />

                        <label htmlFor="purchase-place">Place of Purchase</label>
                        <input type="text" id="purchase-place" name="purchasePlace" value={formData.purchasePlace} onChange={handleChange} placeholder="e.g., Zara, Online" />
                    </div>
                </div>

                <div className={styles.actionButtons}>
                    <button type="submit" className="btn btn-primary">{isEditMode ? 'Update Item' : 'Save Item'}</button>
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    );
};

 export default EditItemPage;