import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
  }

  /* Prevent white flash + match theme background */
  html {
    background-color: var(--color-grey-50);
  }

  body {
    margin: 0;
    background-color: var(--color-grey-50);
    color: var(--color-grey-900);
  }

  /* Makes native UI (inputs/scrollbars) match your forced toggle */
  html { color-scheme: light; }
  html.dark { color-scheme: dark; }

  :root {
    /* Indigo (kept from your file) */
    --color-brand-50: #eef2ff;
    --color-brand-100: #e0e7ff;
    --color-brand-200: #c7d2fe;
    --color-brand-500: #6366f1;
    --color-brand-600: #4f46e5;
    --color-brand-700: #4338ca;
    --color-brand-800: #3730a3;
    --color-brand-900: #312e81;

    /* Grey (LIGHT) — pure white base, neutral (not bluish) */
    --color-grey-0: #ffffff;   /* surfaces/cards */
    --color-grey-50: #ffffff;  /* page background */
    --color-grey-100: #f5f5f5; /* hover surface */
    --color-grey-200: #e6e6e6; /* borders */
    --color-grey-300: #d4d4d4;
    --color-grey-400: #a3a3a3;
    --color-grey-500: #737373; /* muted text */
    --color-grey-600: #525252;
    --color-grey-700: #404040;
    --color-grey-800: #262626;
    --color-grey-900: #0a0a0a; /* primary text */

    /* Other colors (kept from your file) */
    --color-blue-100: #e0f2fe;
    --color-blue-700: #0369a1;
    --color-green-100: #dcfce7;
    --color-green-700: #15803d;
    --color-yellow-100: #fef9c3;
    --color-yellow-700: #a16207;
    --color-silver-100: #e5e7eb;
    --color-silver-700: #374151;
    --color-indigo-100: #e0e7ff;
    --color-indigo-700: #4338ca;

    --color-red-100: #fee2e2;
    --color-red-700: #b91c1c;
    --color-red-800: #991b1b;

    --backdrop-color: rgba(255, 255, 255, 0.1);

    /* ✅ Accent (use these everywhere instead of Tailwind amber classes) */
    --color-accent: #f59e0b; /* amber-500 */
    --color-accent-80: rgba(245, 158, 11, 0.80);
    --color-accent-25: rgba(245, 158, 11, 0.25);
    --shadow-accent: 0 0 25px -10px rgba(245, 158, 11, 1);

    --overlay-bg: rgba(0, 0, 0, 0.35); /* light mode dim */

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);

    /* For dark mode */
    --image-grayscale: 0;
    --image-opacity: 100%;
    --surface: 0 0% 100%;
  }

  /* DARK MODE — true black + slightly lifted surfaces */
  .dark {
    --color-grey-50: #000000;  /* page background */
    --color-grey-0:  #0b0b0b;  /* surfaces/cards */
    --color-grey-100:#141414;  /* hover surface */
    --color-grey-200:#242424;  /* borders */
    --color-grey-300:#2f2f2f;
    --color-grey-400:#525252;
    --color-grey-500:#a3a3a3;  /* muted text */
    --color-grey-600:#d4d4d4;
    --color-grey-700:#e5e5e5;
    --color-grey-800:#f5f5f5;
    --color-grey-900:#ffffff;  /* primary text */

    /* Keep your other color mappings (you can adjust later if needed) */
    --color-blue-100: #075985;
    --color-blue-700: #e0f2fe;
    --color-green-100: #166534;
    --color-green-700: #dcfce7;
    --color-yellow-100: #854d0e;
    --color-yellow-700: #fef9c3;
    --color-silver-100: #374151;
    --color-silver-700: #f3f4f6;
    --color-indigo-100: #3730a3;
    --color-indigo-700: #e0e7ff;

    --color-red-100: #fee2e2;
    --color-red-700: #b91c1c;
    --color-red-800: #991b1b;

    --backdrop-color: rgba(0, 0, 0, 0.3);

    --overlay-bg: rgba(0, 0, 0, 0.70); /* dark mode dim */

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
    --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

    --image-grayscale: 10%;
    --image-opacity: 90%;
    --surface: 217 33% 10%;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .shimmer {
    animation: shimmer 1.6s infinite;
    background-image: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
  }
`;

export default GlobalStyles;