import { useState, useRef } from 'react';

export default function ImageUpload({ currentImage, onImageSelect }) {
  const [preview, setPreview] = useState(currentImage || null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onImageSelect(null);
    fileInputRef.current.value = '';
  };

  return (
    <div className="image-upload-container">
      <div
        className={`image-upload-area ${preview ? 'has-image' : ''}`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <button
              type="button"
              className="image-remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="image-placeholder">
            <span className="upload-icon">📷</span>
            <p>Arrastra una imagen o haz clic</p>
            <span className="upload-hint">JPG, PNG, GIF (max 16MB)</span>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
}
