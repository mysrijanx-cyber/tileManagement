
// // import React from 'react';

// // // ============================================================================
// // // 🎨 DESIGN TOKENS
// // // ============================================================================

// // const COLORS = {
// //   surfaceContainerLow: '#f2f4f6',
// //   inverseSurface: '#2d3133',
// //   onSurface: '#191c1e',
// //   onSurfaceVariant: '#434656',
// //   primary: '#0040df',
// //   outlineVariant: '#c4c5d9',
// // } as const;

// // // ============================================================================
// // // 🎭 MATERIAL ICONS (SVG)
// // // ============================================================================

// // const BrandAwarenessIcon: React.FC<{ className?: string }> = ({ className }) => (
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     viewBox="0 0 24 24"
// //     fill="currentColor"
// //     className={className || 'w-6 h-6'}
// //   >
// //     <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
// //   </svg>
// // );

// // const PublicIcon: React.FC<{ className?: string }> = ({ className }) => (
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     viewBox="0 0 24 24"
// //     fill="currentColor"
// //     className={className || 'w-6 h-6'}
// //   >
// //     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
// //   </svg>
// // );

// // const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     viewBox="0 0 24 24"
// //     fill="currentColor"
// //     className={className || 'w-6 h-6'}
// //   >
// //     <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
// //   </svg>
// // );

// // // ============================================================================
// // // 📦 INTERFACES
// // // ============================================================================

// // interface FooterLink {
// //   label: string;
// //   href: string;
// // }

// // interface FooterProps {
// //   logoSrc?: string;
// //   logoText?: string;
// //   description?: string;
// //   links?: FooterLink[];
// //   copyrightText?: string;
// //   darkMode?: boolean;
// //   onIconClick?: (iconName: 'brand_awareness' | 'public' | 'share') => void;
// // }

// // // ============================================================================
// // // 🏢 MAIN FOOTER COMPONENT - PRODUCTION READY
// // // ============================================================================

// // export const Footer: React.FC<FooterProps> = ({
// //   logoSrc = '',
// //   logoText = 'Tilesview360',
// //   description = "Empowering tile businesses with realstic 3D visualization.",
// //   links = [
// //     { label: 'Privacy Policy', href: '#privacy' },
// //     { label: 'Terms of Service', href: '#terms' },
// //     { label: 'Contact Support', href: '#contact' },
// //     { label: 'Refund Policy', href: '#docs' },
// //   ],
// //   copyrightText = '© 2024 Tilesview360 Platform. All rights reserved.',
// //   darkMode = false,
// //   onIconClick,
// // }) => {
// //   const handleIconClick = (iconName: 'brand_awareness' | 'public' | 'share') => {
// //     if (onIconClick) {
// //       onIconClick(iconName);
// //     } else {
// //       console.log(`${iconName} icon clicked`);
// //     }
// //   };

// //   const bgColor = darkMode ? COLORS.inverseSurface : COLORS.surfaceContainerLow;

// //   return (
// //     <footer
// //       className="w-full border-t font-['Inter',_sans-serif] antialiased"
// //       style={{ backgroundColor: bgColor, borderColor: COLORS.outlineVariant }}
// //       role="contentinfo"
// //     >
// //       {/* ✅ HEIGHT KAM KI GAYI HAI: py-12/16/20 ki jagah py-8/10/12 kar diya */}
// //       <div className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-8 md:py-10 lg:py-12">
        
// //         {/* ═══════════════════════════════════════════════════════════
// //             TOP SECTION - LOGO, DESCRIPTION & LINKS
// //         ═══════════════════════════════════════════════════════════ */}
// //         {/* ✅ Gap thoda kam kiya (gap-6/8/10) taaki zyada open na lage */}
// //         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 md:gap-8 lg:gap-10">
          
// //           {/* LEFT: Logo & Description */}
// //           <div className="flex flex-col gap-3 md:gap-4 max-w-full lg:max-w-[45%]">
            
// //             {/* Logo */}
// //             <div className="flex items-center gap-3">
// //               {logoSrc ? (
// //                 <img
// //                   alt={`${logoText} Logo`}
// //                   src={logoSrc}
// //                   className="h-8 w-8 object-contain"
// //                 />
// //               ) : (
// //                 <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
// //                   <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-300 rounded-[3px]" />
// //                   <div 
// //                     className="absolute bottom-0 right-0 w-4 h-4 rounded-[3px] mix-blend-multiply"
// //                     style={{ backgroundColor: COLORS.primary }}
// //                   />
// //                 </div>
// //               )}
// //               <span 
// //                 className="text-2xl md:text-[26px] font-bold tracking-tight"
// //                 style={{ color: COLORS.onSurface }}
// //               >
// //                 {logoText}
// //               </span>
// //             </div>

// //             {/* Description */}
// //             <p 
// //               className="text-sm md:text-base leading-relaxed max-w-[384px]"
// //               style={{ color: COLORS.onSurfaceVariant }}
// //             >
// //               {description}
// //             </p>
// //           </div>

// //           {/* RIGHT: Navigation Links */}
// //           <nav 
// //             className="flex flex-wrap gap-4 md:gap-6 lg:gap-8"
// //             aria-label="Footer navigation"
// //           >
// //             {links.map((link, index) => (
// //               <a
// //                 key={index}
// //                 href={link.href}
// //                 className="text-sm md:text-base font-medium transition-colors duration-200 hover:underline"
// //                 style={{ color: COLORS.onSurfaceVariant }}
// //                 onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
// //                 onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.onSurfaceVariant)}
// //               >
// //                 {link.label}
// //               </a>
// //             ))}
// //           </nav>
// //         </div>

// //         {/* ═══════════════════════════════════════════════════════════
// //             BOTTOM SECTION - COPYRIGHT & SOCIAL ICONS
// //         ═══════════════════════════════════════════════════════════ */}
// //         {/* ✅ Upar ka margin (mt) aur border-top padding (pt) dono kam kiye hain */}
// //         <div 
// //           className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mt-8 md:mt-10 lg:mt-12 pt-5 md:pt-6 border-t"
// //           style={{ borderColor: `${COLORS.outlineVariant}4D` }}
// //         >
          
// //           {/* LEFT: Copyright */}
// //           <p 
// //             className="text-xs md:text-sm font-semibold tracking-wide uppercase"
// //             style={{ color: COLORS.onSurfaceVariant }}
// //           >
// //             {copyrightText}
// //           </p>

// //           {/* RIGHT: Social Icons */}
// //           <div className="flex gap-4 md:gap-6" role="group" aria-label="Social media links">
            
// //             {/* Brand Awareness Icon */}
// //             <button
// //               onClick={() => handleIconClick('brand_awareness')}
// //               className="p-2 rounded-full transition-all duration-200 hover:bg-black/5 active:scale-95"
// //               style={{ color: COLORS.onSurfaceVariant }}
// //               onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
// //               onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.onSurfaceVariant)}
// //               aria-label="Brand awareness"
// //               type="button"
// //             >
// //               <BrandAwarenessIcon className="w-5 h-5 md:w-6 md:h-6" />
// //             </button>

// //             {/* Globe/Public Icon */}
// //             <button
// //               onClick={() => handleIconClick('public')}
// //               className="p-2 rounded-full transition-all duration-200 hover:bg-black/5 active:scale-95"
// //               style={{ color: COLORS.onSurfaceVariant }}
// //               onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
// //               onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.onSurfaceVariant)}
// //               aria-label="Global presence"
// //               type="button"
// //             >
// //               <PublicIcon className="w-5 h-5 md:w-6 md:h-6" />
// //             </button>

// //             {/* Share Icon */}
// //             <button
// //               onClick={() => handleIconClick('share')}
// //               className="p-2 rounded-full transition-all duration-200 hover:bg-black/5 active:scale-95"
// //               style={{ color: COLORS.onSurfaceVariant }}
// //               onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
// //               onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.onSurfaceVariant)}
// //               aria-label="Share"
// //               type="button"
// //             >
// //               <ShareIcon className="w-5 h-5 md:w-6 md:h-6" />
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </footer>
// //   );
// // };

// // export default Footer;
// import React from 'react';

// // ============================================================================
// // 🎨 DESIGN TOKENS
// // ============================================================================

// const COLORS = {
//   surfaceContainerLow: '#f2f4f6',
//   inverseSurface: '#2d3133',
//   onSurface: '#191c1e',
//   onSurfaceVariant: '#434656',
//   primary: '#0040df',
//   outlineVariant: '#c4c5d9',
// } as const;

// // ============================================================================
// // 🎭 MATERIAL ICONS (SVG)
// // ============================================================================

// const BrandAwarenessIcon: React.FC<{ className?: string }> = ({ className }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="currentColor"
//     className={className || 'w-6 h-6'}
//   >
//     <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
//   </svg>
// );

// const PublicIcon: React.FC<{ className?: string }> = ({ className }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="currentColor"
//     className={className || 'w-6 h-6'}
//   >
//     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
//   </svg>
// );

// const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="currentColor"
//     className={className || 'w-6 h-6'}
//   >
//     <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
//   </svg>
// );

// // ============================================================================
// // 📦 INTERFACES
// // ============================================================================

// interface FooterLink {
//   label: string;
//   href: string;
// }

// interface FooterProps {
//   logoSrc?: string;
//   logoText?: string;
//   description?: string;
//   links?: FooterLink[];
//   copyrightText?: string;
//   versionText?: string;
//   darkMode?: boolean;
//   onIconClick?: (iconName: 'brand_awareness' | 'public' | 'share') => void;
// }

// // ============================================================================
// // 🏢 MAIN FOOTER COMPONENT - PRODUCTION READY
// // ============================================================================

// export const Footer: React.FC<FooterProps> = ({
//   logoSrc = '',
//   logoText = 'Tilesview360',
//   description = "Empowering tile businesses with realistic 3D visualization.",
//   links = [
//     { label: 'Privacy Policy', href: '#privacy' },
//     { label: 'Terms of Service', href: '#terms' },
//     { label: 'Contact Support', href: '#contact' },
//     { label: 'Refund Policy', href: '#docs' },
//   ],
//   copyrightText = '© 2024 TILESVIEW360 PLATFORM. ALL RIGHTS RESERVED.',
//   versionText = 'Version 1.0.0',
//   darkMode = false,
//   onIconClick,
// }) => {
//   const handleIconClick = (iconName: 'brand_awareness' | 'public' | 'share') => {
//     if (onIconClick) {
//       onIconClick(iconName);
//     } else {
//       console.log(`${iconName} icon clicked`);
//     }
//   };

//   const bgColor = darkMode ? COLORS.inverseSurface : COLORS.surfaceContainerLow;

//   return (
//     <footer
//       className="w-full border-t font-['Inter',_sans-serif] antialiased"
//       style={{ backgroundColor: bgColor, borderColor: COLORS.outlineVariant }}
//       role="contentinfo"
//     >
//       {/* ✅ Thodi si height kam ki gayi hai (lg:py-12 hata kar py-8 md:py-10 kiya gaya hai) */}
//       <div className="w-full max-w-[1800px] mx-auto px-4 md:px-6 py-8 md:py-10">
        
//         {/* ═══════════════════════════════════════════════════════════
//             TOP SECTION - LOGO, DESCRIPTION & LINKS
//         ═══════════════════════════════════════════════════════════ */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 md:gap-8">
          
//           {/* LEFT: Logo & Description */}
//           <div className="flex flex-col gap-3 md:gap-4 max-w-full lg:max-w-[45%]">
            
//             {/* Logo */}
//             <div className="flex items-center gap-3">
//               {logoSrc ? (
//                 <img
//                   alt={`${logoText} Logo`}
//                   src={logoSrc}
//                   className="h-8 w-8 object-contain"
//                 />
//               ) : (
//                 <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
//                   <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-300 rounded-[3px]" />
//                   <div 
//                     className="absolute bottom-0 right-0 w-4 h-4 rounded-[3px] mix-blend-multiply"
//                     style={{ backgroundColor: COLORS.primary }}
//                   />
//                 </div>
//               )}
//               <span 
//                 className="text-2xl md:text-[26px] font-bold tracking-tight"
//                 style={{ color: COLORS.onSurface }}
//               >
//                 {logoText}
//               </span>
//             </div>

//             {/* Description */}
//             <p 
//               className="text-sm md:text-base leading-relaxed max-w-[384px]"
//               style={{ color: COLORS.onSurfaceVariant }}
//             >
//               {description}
//             </p>
//           </div>

//           {/* RIGHT: Navigation Links */}
//           <nav 
//             className="flex flex-wrap gap-4 md:gap-6 lg:gap-8"
//             aria-label="Footer navigation"
//           >
//             {links.map((link, index) => (
//               <a
//                 key={index}
//                 href={link.href}
//                 className="text-sm md:text-base font-medium transition-colors duration-200 hover:underline"
//                 style={{ color: COLORS.onSurfaceVariant }}
//                 onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
//                 onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.onSurfaceVariant)}
//               >
//                 {link.label}
//               </a>
//             ))}
//           </nav>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════
//             BOTTOM SECTION - COPYRIGHT, VERSION & SOCIAL ICONS
//         ═══════════════════════════════════════════════════════════ */}
//         {/* ✅ Mt aur pt ko balance kiya gaya hai */}
//         <div 
//           className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mt-8 md:mt-10 pt-5 md:pt-6 border-t"
//           style={{ borderColor: `${COLORS.outlineVariant}4D` }}
//         >
          
//           {/* LEFT: Copyright & Version Text */}
//           <div className="flex flex-col gap-1">
//             <p 
//               className="text-xs md:text-sm font-semibold tracking-wide uppercase"
//               style={{ color: COLORS.onSurfaceVariant }}
//             >
//               {copyrightText}
//             </p>
//             <p 
//               className="text-xs md:text-sm font-medium tracking-wide uppercase opacity-75"
//               style={{ color: COLORS.onSurfaceVariant }}
//             >
//               {versionText}
//             </p>
//           </div>

//           {/* RIGHT: Social Icons */}
//           <div className="flex gap-4 md:gap-6" role="group" aria-label="Social media links">
            
//             {/* Brand Awareness Icon */}
//             <button
//               onClick={() => handleIconClick('brand_awareness')}
//               className="p-2 rounded-full transition-all duration-200 hover:bg-black/5 active:scale-95"
//               style={{ color: COLORS.onSurfaceVariant }}
//               onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
//               onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.onSurfaceVariant)}
//               aria-label="Brand awareness"
//               type="button"
//             >
//               <BrandAwarenessIcon className="w-5 h-5 md:w-6 md:h-6" />
//             </button>

//             {/* Globe/Public Icon */}
//             <button
//               onClick={() => handleIconClick('public')}
//               className="p-2 rounded-full transition-all duration-200 hover:bg-black/5 active:scale-95"
//               style={{ color: COLORS.onSurfaceVariant }}
//               onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
//               onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.onSurfaceVariant)}
//               aria-label="Global presence"
//               type="button"
//             >
//               <PublicIcon className="w-5 h-5 md:w-6 md:h-6" />
//             </button>

//             {/* Share Icon */}
//             <button
//               onClick={() => handleIconClick('share')}
//               className="p-2 rounded-full transition-all duration-200 hover:bg-black/5 active:scale-95"
//               style={{ color: COLORS.onSurfaceVariant }}
//               onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
//               onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.onSurfaceVariant)}
//               aria-label="Share"
//               type="button"
//             >
//               <ShareIcon className="w-5 h-5 md:w-6 md:h-6" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer; 
import React from 'react';

// ============================================================================
// 🎨 DESIGN TOKENS
// ============================================================================

const COLORS = {
  surfaceContainerLow: '#f2f4f6',
  inverseSurface: '#2d3133',
  onSurface: '#191c1e',
  onSurfaceVariant: '#434656',
  primary: '#0040df',
  outlineVariant: '#c4c5d9',
} as const;

// ============================================================================
// 🎭 MATERIAL ICONS (SVG)
// ============================================================================

const BrandAwarenessIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || 'w-6 h-6'}
  >
    <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
  </svg>
);

const PublicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || 'w-6 h-6'}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || 'w-6 h-6'}
  >
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
  </svg>
);

// ============================================================================
// 📦 INTERFACES
// ============================================================================

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  logoSrc?: string;
  logoText?: string;
  description?: string;
  links?: FooterLink[];
  copyrightText?: string;
  versionText?: string;
  darkMode?: boolean;
  onIconClick?: (iconName: 'brand_awareness' | 'public' | 'share') => void;
}

// ============================================================================
// 🏢 MAIN FOOTER COMPONENT - PRODUCTION READY
// ============================================================================

export const Footer: React.FC<FooterProps> = ({
  logoSrc = '',
  logoText = 'Tilesview360',
  description = "Empowering tile businesses with realistic 3D visualization.",
  links = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Contact Support', href: '#contact' },
    { label: 'Refund Policy', href: '#docs' },
  ],
  copyrightText = '© 2024 TILESVIEW360 PLATFORM. ALL RIGHTS RESERVED.',
  versionText = 'Version 1.0.0',
  darkMode = false,
  onIconClick,
}) => {
  const handleIconClick = (iconName: 'brand_awareness' | 'public' | 'share') => {
    if (onIconClick) {
      onIconClick(iconName);
    } else {
      console.log(`${iconName} icon clicked`);
    }
  };

  const bgColor = darkMode ? COLORS.inverseSurface : COLORS.surfaceContainerLow;

  return (
    <footer
      className="w-full border-t font-['Inter',_sans-serif] antialiased"
      style={{ backgroundColor: bgColor, borderColor: COLORS.outlineVariant }}
      role="contentinfo"
    >
      {/* Space compact rakhi hai, par items clear rahenge */}
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-6 py-6 md:py-8">
        
        {/* ═══════════════════════════════════════════════════════════
            TOP SECTION - LOGO, DESCRIPTION & LINKS
        ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 md:gap-6">
          
          {/* LEFT: Logo & Description */}
          <div className="flex flex-col gap-3 md:gap-4 max-w-full lg:max-w-[45%]">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              {logoSrc ? (
                <img
                  alt={`${logoText} Logo`}
                  src={logoSrc}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-300 rounded-[3px]" />
                  <div 
                    className="absolute bottom-0 right-0 w-4 h-4 rounded-[3px] mix-blend-multiply"
                    style={{ backgroundColor: COLORS.primary }}
                  />
                </div>
              )}
              <span 
                className="text-2xl md:text-[26px] font-bold tracking-tight"
                style={{ color: COLORS.onSurface }}
              >
                {logoText}
              </span>
            </div>

            {/* Description (Font size restored to original) */}
            <p 
              className="text-sm md:text-base leading-relaxed max-w-[384px]"
              style={{ color: COLORS.onSurfaceVariant }}
            >
              {description}
            </p>
          </div>

          {/* RIGHT: Navigation Links (Font size restored) */}
          <nav 
            className="flex flex-wrap gap-4 md:gap-6 lg:gap-8"
            aria-label="Footer navigation"
          >
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm md:text-base font-medium transition-colors duration-200 hover:underline"
                style={{ color: COLORS.onSurfaceVariant }}
                onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.onSurfaceVariant)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            BOTTOM SECTION - COPYRIGHT, VERSION & SOCIAL ICONS
        ═══════════════════════════════════════════════════════════ */}
        <div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mt-6 md:mt-8 pt-4 md:pt-5 border-t"
          style={{ borderColor: `${COLORS.outlineVariant}4D` }}
        >
          
          {/* LEFT: Copyright & Version Text (Font sizes restored) */}
          <div className="flex flex-col gap-1">
            <p 
              className="text-xs md:text-sm font-semibold tracking-wide uppercase"
              style={{ color: COLORS.onSurfaceVariant }}
            >
              {copyrightText}
            </p>
            <p 
              className="text-xs md:text-sm font-medium tracking-wide uppercase opacity-75"
              style={{ color: COLORS.onSurfaceVariant }}
            >
              {versionText}
            </p>
          </div>

          {/* RIGHT: Social Icons (Icon sizes restored to w-6 h-6 on desktop) */}
          <div className="flex gap-4 md:gap-6" role="group" aria-label="Social media links">
            
            <button
              onClick={() => handleIconClick('brand_awareness')}
              className="p-2 rounded-full transition-all duration-200 hover:bg-black/5 active:scale-95"
              style={{ color: COLORS.onSurfaceVariant }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.onSurfaceVariant)}
              aria-label="Brand awareness"
              type="button"
            >
              <BrandAwarenessIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              onClick={() => handleIconClick('public')}
              className="p-2 rounded-full transition-all duration-200 hover:bg-black/5 active:scale-95"
              style={{ color: COLORS.onSurfaceVariant }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.onSurfaceVariant)}
              aria-label="Global presence"
              type="button"
            >
              <PublicIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              onClick={() => handleIconClick('share')}
              className="p-2 rounded-full transition-all duration-200 hover:bg-black/5 active:scale-95"
              style={{ color: COLORS.onSurfaceVariant }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.onSurfaceVariant)}
              aria-label="Share"
              type="button"
            >
              <ShareIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;