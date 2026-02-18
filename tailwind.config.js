
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}", // Scan all files in the project root for Tailwind classes
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        danger: 'var(--danger)',
        success: 'var(--success)',
        'secondary-accent': 'var(--secondary-accent)',
        'light-text': 'var(--light-text)',
        'text-color': 'var(--text-color)',
        'border-color': 'var(--border-color)',
      },
      backgroundImage: {
        'primary-gradient': 'var(--primary-gradient)',
      },
      boxShadow: {
        'purple-md': '0 5px 15px rgba(103, 58, 183, 0.2)',
        'purple-lg': '0 8px 20px rgba(103, 58, 183, 0.25)',
        'purple-xl': '0 10px 20px rgba(103, 58, 183, 0.15)',
        'purple-nav': '0 -5px 20px rgba(103, 58, 183, 0.3)',
        'red-md': '0 4px 10px rgba(216, 67, 21, 0.4)',
        'purple-button': '0 4px 10px rgba(103, 58, 183, 0.4)',
      },
      borderRadius: {
        'mobile-container': '30px',
      },
      height: {
        'screen-mobile': '100vh',
      },
      maxHeight: {
        'mobile-container': '896px',
      },
      maxWidth: {
        'mobile-container': '414px',
      }
    },
  },
  plugins: [],
}
