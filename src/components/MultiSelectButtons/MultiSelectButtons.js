import React from 'react';
import styles from './MultiSelectButtons.module.css'; // You'll need the CSS file from before

const MultiSelectButtons = ({ options, selectedOptions, onChange }) => {
    
    const handleSelect = (option) => {
        // Use a fallback for selectedOptions as well, just in case
        const currentSelection = selectedOptions || [];
        const isSelected = currentSelection.includes(option);
        let newSelection;

        if (isSelected) {
            newSelection = currentSelection.filter(item => item !== option);
        } else {
            newSelection = [...currentSelection, option];
        }
        onChange(newSelection);
    };

    // THE SAFEGUARD IS HERE: (options || [])
    // If 'options' is undefined, it will map over an empty array, preventing the crash.
    return (
        <div className={styles.container}>
            {(options || []).map(option => (
                <button
                    type="button"
                    key={option}
                    className={`${styles.optionBtn} ${(selectedOptions || []).includes(option) ? styles.active : ''}`}
                    onClick={() => handleSelect(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default MultiSelectButtons;