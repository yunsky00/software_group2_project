function SpecmoaLogo({ className = '', title = '스펙모아 로고' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <rect x="2" y="2" width="60" height="60" rx="16" fill="#0D1023" />
      <path
        d="M20 26.5C20 24.567 21.567 23 23.5 23H40.5C42.433 23 44 24.567 44 26.5V41.5C44 43.433 42.433 45 40.5 45H23.5C21.567 45 20 43.433 20 41.5V26.5Z"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 23V21.5C26 18.462 28.462 16 31.5 16H32.5C35.538 16 38 18.462 38 21.5V23"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M32 23V45" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default SpecmoaLogo;
