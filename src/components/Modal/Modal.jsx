import React from "react";
import styles from "./ModalStyles.module.css";

const Modal = ({ title, fields, isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        {fields.map((field) => (
          <div key={field.name} className={styles.inputGroup}>
            <label className={styles.label} htmlFor={field.name}>
              {field.label}:
            </label>
            {field.type === "checkbox" ? (
              <input
                id={field.name}
                type="checkbox"
                checked={field.checked || false} // Ensure checked is always boolean
                onChange={field.onChange}
                className={styles.checkbox}
              />
            ) : (
              <input
                id={field.name}
                type={field.type}
                value={field.value}
                onChange={field.onChange}
                className={styles.input}
              />
            )}
          </div>
        ))}
        <button className={styles.saveButton} onClick={onSubmit}>
          Save
        </button>
        <button className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};


export default Modal;
