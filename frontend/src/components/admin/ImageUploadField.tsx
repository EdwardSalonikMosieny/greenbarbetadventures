import { useRef, useState } from 'react';
import { resolveImageUrl, uploadImage } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';
import styles from './ImageUploadField.module.css';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

function ImageUploadField({ label, value, onChange, error }: ImageUploadFieldProps) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploading(true);
    setUploadError(null);
    try {
      const res = await uploadImage(file, token);
      onChange(res.url);
    } catch {
      setUploadError('Upload failed. Please try a different image.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      {value && <img src={resolveImageUrl(value)} alt="" className={styles.preview} />}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        disabled={uploading}
        className={styles.input}
      />
      {uploading && <p className={styles.status}>Uploading…</p>}
      {uploadError && <p className={styles.errorText}>{uploadError}</p>}
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}

export default ImageUploadField;
