export function SparkLogo({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="6" y="10" width="52" height="44" rx="16" fill="url(#specmoa-gradient)" />
      <path
        d="M23 37.5C23 30.5964 28.5964 25 35.5 25H42V31H35.5C31.9101 31 29 33.9101 29 37.5C29 41.0899 31.9101 44 35.5 44H42V50H35.5C28.5964 50 23 44.4036 23 37.5Z"
        fill="white"
      />
      <path d="M20 18L31 25L20 32V18Z" fill="#FDF2D5" />
      <defs>
        <linearGradient id="specmoa-gradient" x1="10" y1="12" x2="56" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF7B54" />
          <stop offset="1" stopColor="#F4B942" />
        </linearGradient>
      </defs>
    </svg>
  );
}
