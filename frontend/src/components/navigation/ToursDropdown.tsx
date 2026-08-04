import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { TOUR_CATEGORIES } from '../../data/navigation';
import styles from './ToursDropdown.module.css';

// Opens on hover (desktop discoverability) and on click/Enter/Space (keyboard + touch).
// Click always opens rather than toggling — toggling would immediately re-close a menu
// a mouse user had just opened by hovering. Closes on Escape, outside click, or selecting
// a link; focus returns to the trigger on Escape.
function ToursDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={styles.wrapper}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(true)}
      >
        Tours <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className={styles.menu}>
          <ul id={menuId} role="menu" className={styles.menuList}>
            {TOUR_CATEGORIES.map((category) => (
              <li key={category.slug} role="none">
                <Link
                  role="menuitem"
                  to={`/tours/${category.slug}`}
                  className={styles.menuItem}
                  onClick={() => setOpen(false)}
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ToursDropdown;
