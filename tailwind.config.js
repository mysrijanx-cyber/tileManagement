/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
theme: {
    extend: {
      colors: {
        "primary": "#0040df",
        "secondary": "#8127cf",
        "tertiary": "#4d556b",
        "background": "#f7f9fb",
        "surface": "#f7f9fb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-dim": "#d8dadc",
        "on-surface": "#191c1e",
        "on-surface-variant": "#434656",
        "on-primary": "#ffffff",
        "primary-container": "#2d5bff",
        "secondary-container": "#9c48ea",
        "tertiary-container": "#656d84",
        "outline-variant": "#c4c5d9",
        "inverse-surface": "#2d3133",
      },
      fontFamily: {
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
