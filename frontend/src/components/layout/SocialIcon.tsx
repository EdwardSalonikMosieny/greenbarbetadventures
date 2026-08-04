// Minimal generic glyphs (not brand wordmarks/logos) representing each platform.
interface SocialIconProps {
  platform: 'Instagram' | 'YouTube' | 'TikTok';
}

function SocialIcon({ platform }: SocialIconProps) {
  switch (platform) {
    case 'Instagram':
      return (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'YouTube':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <rect x="3" y="6" width="18" height="12" rx="4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" />
        </svg>
      );
    case 'TikTok':
      return (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path
            d="M13 4v10.5a3.2 3.2 0 1 1 -2-3v-7.5z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M13 4c.3 1.8 1.7 3.2 3.5 3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default SocialIcon;
