import React, { useState } from 'react';
import MultiSelectButtons from '../MultiSelectButtons/MultiSelectButtons';
import styles from './EditableMultiSelect.module.css';

const EditableMultiSelect = ({ options, selectedOptions, onChange, onAddOption }) => {
    const [newOptionValue, setNewOptionValue] = useState('');

    const handleAddClick = () => {
        if (newOptionValue.trim()) {
            onAddOption(newOptionValue);
            setNewOptionValue(''); // Clear the input after adding
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission on Enter
            handleAddClick();
        }
    };

    return (
        <div className={styles.wrapper}>
            <MultiSelectButtons
                options={options}
                selectedOptions={selectedOptions}
                onChange={onChange}
            />
            <div className={styles.addSection}>
                <input
                    type="text"
                    value={newOptionValue}
                    onChange={(e) => setNewOptionValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add new..."
                    className={styles.addInput}
                />
                <button
                    type="button"
                    onClick={handleAddClick}
                    className={styles.addBtn}
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default EditableMultiSelect;