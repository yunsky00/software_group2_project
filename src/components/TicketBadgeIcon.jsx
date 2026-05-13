function TicketBadgeIcon({ size = 44 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        background: '#dde4f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      <svg width={Math.round(size * 0.52)} height={Math.round(size * 0.52)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(-35 12 12)">
          <rect x="5" y="8" width="14" height="8" rx="2.2" fill="#f14668" />
          <circle cx="9" cy="10.2" r="0.9" fill="#ffd7df" />
          <circle cx="9" cy="13.8" r="0.9" fill="#ffd7df" />
          <path d="M13.8 9.9L14.8 11.9L17 12.1L15.4 13.5L15.8 15.7L13.8 14.7L11.8 15.7L12.2 13.5L10.6 12.1L12.8 11.9L13.8 9.9Z" fill="#ffd7df" />
        </g>
      </svg>
    </div>
  );
}

export default TicketBadgeIcon;
