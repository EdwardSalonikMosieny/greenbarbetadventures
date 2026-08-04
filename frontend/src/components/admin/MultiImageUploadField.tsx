import { useRef, useState } from 'react';
import { resolveImageUrl, uploadImage } from '../../lib/apiClient';
import { useAuth } from '../../context/AuthContext';
import styles from './MultiImageUploadField.module.css';

interface MultiImageUploadFieldProps {
  label: string;
  values: readonly string[];
  onChange: (urls: string[]) => void;
}

function MultiImageUploadField({ label, values, onChange }: MultiImageUploadFieldProps) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0 || !token) return;

    setUploading(true);
    setUploadError(null);
    try {
      const uploaded = await Promise.all(files.map((file) => uploadImage(file, token)));
      onChange([...values, ...uploaded.map((u) => u.url)]);
    } catch {
      setUploadError('One or more uploads failed. Please try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      {values.length > 0 && (
        <div className={styles.grid}>
          {values.map((url, index) => (
            <div key={`${url}-${index}`} className={styles.item}>
              <img src={resolveImageUrl(url)} alt="" className={styles.thumb} />
              <button
                type="button"
                className={styles.remove}
                onClick={() => removeAt(index)}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        onChange={handleFileChange}
        disabled={uploading}
        className={styles.input}
      />
      {uploading && <p className={styles.status}>Uploading…</p>}
      {uploadError && <p className={styles.errorText}>{uploadError}</p>}
    </div>
  );
}

export default MultiImageUploadField;
