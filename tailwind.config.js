// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
// theme: {
//     extend: {
//       colors: {
//         "primary": "#0040df",
//         "secondary": "#8127cf",
//         "tertiary": "#4d556b",
//         "background": "#f7f9fb",
//         "surface": "#f7f9fb",
//         "surface-container-lowest": "#ffffff",
//         "surface-container-low": "#f2f4f6",
//         "surface-container": "#eceef0",
//         "surface-dim": "#d8dadc",
//         "on-surface": "#191c1e",
//         "on-surface-variant": "#434656",
//         "on-primary": "#ffffff",
//         "primary-container": "#2d5bff",
//         "secondary-container": "#9c48ea",
//         "tertiary-container": "#656d84",
//         "outline-variant": "#c4c5d9",
//         "inverse-surface": "#2d3133",
//       },
//       fontFamily: {
//         body: ["Inter", "sans-serif"],
//       },
//     },
//   },
//   plugins: [],
// };

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
        // Niche ke kuch extra colors jo dummy mein the
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
      },
      fontFamily: {
        body: ["Inter", "sans-serif"],
        // Dummy UI ki exact font families
        "body-md": ["Inter"],
        "display-lg": ["Inter"],
        "headline-xl": ["Inter"],
        "body-lg": ["Inter"],
        "label-sm": ["Inter"],
        "headline-md": ["Inter"],
        "display-lg-mobile": ["Inter"]
      },
      fontSize: {
        // Dummy UI ki exact font sizes aur weights
        "body-md": ["16px", {lineHeight: "24px", fontWeight: "400"}],
        "display-lg": ["64px", {lineHeight: "72px", letterSpacing: "-0.02em", fontWeight: "600"}],
        "headline-xl": ["36px", {lineHeight: "44px", letterSpacing: "-0.01em", fontWeight: "600"}],
        "body-lg": ["18px", {lineHeight: "28px", fontWeight: "400"}],
        "label-sm": ["12px", {lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600"}],
        "headline-md": ["24px", {lineHeight: "32px", fontWeight: "500"}],
        "display-lg-mobile": ["40px", {lineHeight: "48px", letterSpacing: "-0.01em", fontWeight: "600"}]
      }
    },
  },
  plugins: [],
};