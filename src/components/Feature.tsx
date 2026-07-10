
// // // import React from 'react';

// // // // ============================================================================
// // // // INTERFACES
// // // // ============================================================================

// // // interface FeatureCardProps {
// // //   title: string;
// // //   description: string;
// // //   icon: React.ReactNode;
// // // }

// // // // ============================================================================
// // // // SVG ICONS (Scaled for a premium, compact look)
// // // // ============================================================================

// // // const QrIcon = ({ className = "" }) => (
// // //   <svg className={`w-7 h-7 xl:w-8 xl:h-8 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
// // //     <rect x="4" y="4" width="6" height="6" rx="1.5" />
// // //     <rect x="14" y="4" width="6" height="6" rx="1.5" />
// // //     <rect x="4" y="14" width="6" height="6" rx="1.5" />
// // //     <path d="M7 7h.01M17 7h.01M7 17h.01" strokeWidth="2.5" />
// // //     <path d="M14 14h.01M17 14h.01M14 17h.01M17 17h.01M14 20h.01M17 20h.01" strokeWidth="2.5" />
// // //   </svg>
// // // );

// // // const CameraIcon = ({ className = "" }) => (
// // //   <svg className={`w-7 h-7 xl:w-8 xl:h-8 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
// // //     <rect x="3" y="7" width="13" height="10" rx="2" />
// // //     <path d="M16 10l4.5-2.5A1 1 0 0 1 22 8.3v7.4a1 1 0 0 1-1.5.8L16 14" />
// // //     <path d="M9.5 9l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" strokeWidth="1" fill="white" />
// // //   </svg>
// // // );

// // // const BoxIcon = ({ className = "" }) => (
// // //   <svg className={`w-7 h-7 xl:w-8 xl:h-8 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
// // //     <rect x="3" y="6" width="18" height="5" rx="1" />
// // //     <path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" />
// // //     <line x1="10" y1="15" x2="14" y2="15" />
// // //   </svg>
// // // );

// // // // ============================================================================
// // // // FEATURE CARD COMPONENT (Proportions Fixed)
// // // // ============================================================================

// // // const FeatureCard: React.FC<FeatureCardProps> = React.memo(({ title, description, icon }) => {
// // //   return (
// // //     // Padding kam karke p-8 se p-10 (max) tak rakhi hai taaki height compact rahe
// // //     <div className="relative bg-white rounded-[32px] p-8 xl:p-10 border border-[#e8eaef] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col items-start transition-all duration-300 ease-in-out hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1">
      
// // //       {/* Decorative Top-Right Blob - Size Adjusted */}
// // //       <div className="absolute -top-12 -right-12 xl:-top-16 xl:-right-16 w-[180px] h-[180px] xl:w-[220px] xl:h-[220px] bg-gradient-to-br from-[#ebf0ff] to-[#f4e8ff] rounded-full pointer-events-none transition-all duration-300" />

// // //       {/* Icon Container - Scaled down to standard premium size (64px) */}
// // //       <div className="relative z-10 w-[56px] h-[56px] xl:w-[64px] xl:h-[64px] rounded-[18px] bg-gradient-to-br from-[#3b5cfb] to-[#8d2dee] flex items-center justify-center mb-6 xl:mb-8 shadow-[0_8px_16px_-6px_rgba(141,45,238,0.3)] shrink-0 transition-transform duration-300 hover:scale-105">
// // //         {icon}
// // //       </div>

// // //       {/* Title */}
// // //       <h3 className="relative z-10 text-[22px] xl:text-[26px] font-bold text-[#1a1a1a] mb-3 tracking-tight leading-[1.2]">
// // //         {title}
// // //       </h3>
      
// // //       {/* Description */}
// // //       <p className="relative z-10 text-[16px] xl:text-[18px] text-[#595959] leading-[1.6]">
// // //         {description}
// // //       </p>
// // //     </div>
// // //   );
// // // });
// // // FeatureCard.displayName = 'FeatureCard';

// // // // ============================================================================
// // // // MAIN COMPONENT - PRODUCTION READY
// // // // ============================================================================

// // // export const FeatureGuide: React.FC = () => {
// // //   const features = [
// // //     {
// // //       id: 'qr-integration',
// // //       title: 'QR Integration',
// // //       description: 'Customers scan any tile in your showroom to unlock the digital twin. Instantly bridges the physical sample to their phone.',
// // //       icon: <QrIcon />
// // //     },
// // //     {
// // //       id: 'ai-room-scan',
// // //       title: 'AI Room Scan',
// // //       description: 'Using LiDAR and computer vision, we map their room dimensions and lighting conditions in real-time. No apps required.',
// // //       icon: <CameraIcon />
// // //     },
// // //     {
// // //       id: 'instant-checkout',
// // //       title: 'Instant Checkout',
// // //       description: 'Direct integration with your inventory. Customers buy the exact quantity needed based on AI-calculated measurements.',
// // //       icon: <BoxIcon />
// // //     }
// // //   ];

// // //   return (
// // //     // Outer Wrapper: Same logic as Banner (px-3 md:px-5)
// // //     // Height padding set to py-20 lg:py-28 (sleeker than min-h-screen)
// // //     <section className="w-full bg-[#f9fafb] flex flex-col items-center justify-center py-20 lg:py-28 px-3 md:px-5 font-['Inter',_sans-serif] antialiased">
      
// // //       {/* Inner Wrapper: 1920px max-width to sync with Banner & Stats */}
// // //       <div className="w-full max-w-[1920px] mx-auto">
        
// // //         {/* Header Section */}
// // //         <div className="text-center mb-16 lg:mb-20">
// // //           <h2 className="text-[#1a1a1a] text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold mb-5 tracking-tight leading-[1.1]">
// // //             Magic in Three Simple Steps
// // //           </h2>
// // //           <p className="text-[#595959] text-[18px] lg:text-[22px] xl:text-[24px] max-w-4xl mx-auto leading-relaxed">
// // //             Our proprietary AI bridges the gap between digital selection and physical reality.
// // //           </p>
// // //         </div>

// // //         {/* Feature Cards Grid - 3 Columns on desktop */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
// // //           {features.map((feature) => (
// // //             <FeatureCard
// // //               key={feature.id}
// // //               title={feature.title}
// // //               description={feature.description}
// // //               icon={feature.icon}
// // //             />
// // //           ))}
// // //         </div>

// // //       </div>
// // //     </section>
// // //   );
// // // };

// // // export default FeatureGuide; 
// // import React, { useState, useEffect, useCallback } from 'react';

// // // ============================================================================
// // // INTERFACES
// // // ============================================================================

// // interface FeatureCardProps {
// //   title: string;
// //   description: string;
// //   icon: React.ReactNode;
// // }

// // // ============================================================================
// // // SVG ICONS (Scaled for a premium, compact look)
// // // ============================================================================

// // const QrIcon = ({ className = "" }) => (
// //   <svg className={`w-8 h-8 xl:w-10 xl:h-10 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
// //     <rect x="4" y="4" width="6" height="6" rx="1.5" />
// //     <rect x="14" y="4" width="6" height="6" rx="1.5" />
// //     <rect x="4" y="14" width="6" height="6" rx="1.5" />
// //     <path d="M7 7h.01M17 7h.01M7 17h.01" strokeWidth="2.5" />
// //     <path d="M14 14h.01M17 14h.01M14 17h.01M17 17h.01M14 20h.01M17 20h.01" strokeWidth="2.5" />
// //   </svg>
// // );

// // const CameraIcon = ({ className = "" }) => (
// //   <svg className={`w-8 h-8 xl:w-10 xl:h-10 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
// //     <rect x="3" y="7" width="13" height="10" rx="2" />
// //     <path d="M16 10l4.5-2.5A1 1 0 0 1 22 8.3v7.4a1 1 0 0 1-1.5.8L16 14" />
// //     <path d="M9.5 9l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" strokeWidth="1" fill="white" />
// //   </svg>
// // );

// // const BoxIcon = ({ className = "" }) => (
// //   <svg className={`w-8 h-8 xl:w-10 xl:h-10 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
// //     <rect x="3" y="6" width="18" height="5" rx="1" />
// //     <path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" />
// //     <line x1="10" y1="15" x2="14" y2="15" />
// //   </svg>
// // );

// // // Black Arrow Icons for Slider Navigation
// // const ChevronLeftIcon = () => (
// //   <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //     <polyline points="15 18 9 12 15 6" />
// //   </svg>
// // );

// // const ChevronRightIcon = () => (
// //   <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //     <polyline points="9 18 15 12 9 6" />
// //   </svg>
// // );

// // // ============================================================================
// // // FEATURE CARD COMPONENT (Adjusted for Single View)
// // // ============================================================================

// // const FeatureCard: React.FC<FeatureCardProps> = React.memo(({ title, description, icon }) => {
// //   return (
// //     // Single card ke liye width badha di hai, content center align kiya hai aur paddings increase ki hain
// //     <div className="relative w-full max-w-3xl mx-auto bg-white rounded-[32px] p-10 sm:p-14 md:p-16 border border-[#e8eaef] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row items-center md:text-left text-center gap-8 md:gap-12 transition-all duration-300">
      
// //       {/* Decorative Blob */}
// //       <div className="absolute -top-16 -right-16 md:-top-24 md:-right-24 w-[250px] h-[250px] md:w-[350px] md:h-[350px] bg-gradient-to-br from-[#ebf0ff] to-[#f4e8ff] rounded-full pointer-events-none opacity-60" />

// //       {/* Icon Container - Single card design ke liye slightly bada */}
// //       <div className="relative z-10 w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-[24px] bg-gradient-to-br from-[#3b5cfb] to-[#8d2dee] flex items-center justify-center shadow-[0_8px_16px_-6px_rgba(141,45,238,0.3)] shrink-0">
// //         {icon}
// //       </div>

// //       {/* Text Content */}
// //       <div className="relative z-10 flex flex-col">
// //         <h3 className="text-[28px] md:text-[36px] font-bold text-[#1a1a1a] mb-4 tracking-tight leading-[1.2]">
// //           {title}
// //         </h3>
// //         <p className="text-[18px] md:text-[22px] text-[#595959] leading-[1.6]">
// //           {description}
// //         </p>
// //       </div>
// //     </div>
// //   );
// // });
// // FeatureCard.displayName = 'FeatureCard';

// // // ============================================================================
// // // MAIN COMPONENT - PRODUCTION READY SLIDER
// // // ============================================================================

// // export const FeatureGuide: React.FC = () => {
// //   const [currentIndex, setCurrentIndex] = useState(0);

// //   const features = [
// //     {
// //       id: 'qr-integration',
// //       title: 'QR Integration',
// //       description: 'Customers scan any tile in your showroom to unlock the digital twin. Instantly bridges the physical sample to their phone.',
// //       icon: <QrIcon />
// //     },
// //     {
// //       id: 'ai-room-scan',
// //       title: 'AI Room Scan',
// //       description: 'Using LiDAR and computer vision, we map their room dimensions and lighting conditions in real-time. No apps required.',
// //       icon: <CameraIcon />
// //     },
// //     {
// //       id: 'instant-checkout',
// //       title: 'Instant Checkout',
// //       description: 'Direct integration with your inventory. Customers buy the exact quantity needed based on AI-calculated measurements.',
// //       icon: <BoxIcon />
// //     }
// //   ];

// //   // Navigation Handlers
// //   const handleNext = useCallback(() => {
// //     setCurrentIndex((prevIndex) => (prevIndex === features.length - 1 ? 0 : prevIndex + 1));
// //   }, [features.length]);

// //   const handlePrev = useCallback(() => {
// //     setCurrentIndex((prevIndex) => (prevIndex === 0 ? features.length - 1 : prevIndex - 1));
// //   }, [features.length]);

// //   return (
// //     <section className="w-full bg-[#f9fafb] flex flex-col items-center justify-center py-20 lg:py-28 px-3 md:px-5 font-['Inter',_sans-serif] antialiased">
// //       <div className="w-full max-w-[1920px] mx-auto overflow-hidden">
        
// //         {/* Header Section */}
// //         <div className="text-center mb-16 lg:mb-20">
// //           <h2 className="text-[#1a1a1a] text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold mb-5 tracking-tight leading-[1.1]">
// //             Magic in Three Simple Steps
// //           </h2>
// //           <p className="text-[#595959] text-[18px] lg:text-[22px] xl:text-[24px] max-w-4xl mx-auto leading-relaxed">
// //             Our proprietary AI bridges the gap between digital selection and physical reality.
// //           </p>
// //         </div>

// //         {/* SLIDER SECTION */}
// //         <div className="relative w-full max-w-5xl mx-auto px-12 sm:px-16">
          
// //           {/* Slider Track (Smooth Animation) */}
// //           <div className="overflow-hidden w-full rounded-[32px] py-4">
// //             <div 
// //               className="flex transition-transform duration-500 ease-in-out" 
// //               style={{ transform: `translateX(-${currentIndex * 100}%)` }}
// //             >
// //               {features.map((feature) => (
// //                 <div key={feature.id} className="w-full flex-shrink-0 px-2 sm:px-4">
// //                   <FeatureCard
// //                     title={feature.title}
// //                     description={feature.description}
// //                     icon={feature.icon}
// //                   />
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Left Arrow Button (Black icon, White Background for premium contrast) */}
// //           <button 
// //             onClick={handlePrev}
// //             className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] hover:scale-105 transition-all duration-200 border border-gray-100 focus:outline-none"
// //             aria-label="Previous Feature"
// //           >
// //             <ChevronLeftIcon />
// //           </button>

// //           {/* Right Arrow Button (Black icon, White Background) */}
// //           <button 
// //             onClick={handleNext}
// //             className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] hover:scale-105 transition-all duration-200 border border-gray-100 focus:outline-none"
// //             aria-label="Next Feature"
// //           >
// //             <ChevronRightIcon />
// //           </button>

// //           {/* Optional Slider Dots (Indicators) */}
// //           <div className="flex justify-center gap-3 mt-8">
// //             {features.map((_, index) => (
// //               <button
// //                 key={index}
// //                 onClick={() => setCurrentIndex(index)}
// //                 className={`w-3 h-3 rounded-full transition-all duration-300 ${
// //                   index === currentIndex ? 'bg-[#1a1a1a] w-8' : 'bg-gray-300 hover:bg-gray-400'
// //                 }`}
// //                 aria-label={`Go to slide ${index + 1}`}
// //               />
// //             ))}
// //           </div>

// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default FeatureGuide; 
// import React, { useState, useCallback } from 'react';

// // ============================================================================
// // INTERFACES
// // ============================================================================

// interface FeatureCardProps {
//   title: string;
//   description: string;
//   icon: React.ReactNode;
// }

// // ============================================================================
// // SVG ICONS (Slightly Bigger for Premium Look)
// // ============================================================================

// const QrIcon = ({ className = "" }) => (
//   <svg className={`w-10 h-10 md:w-12 md:h-12 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="4" y="4" width="6" height="6" rx="1.5" />
//     <rect x="14" y="4" width="6" height="6" rx="1.5" />
//     <rect x="4" y="14" width="6" height="6" rx="1.5" />
//     <path d="M7 7h.01M17 7h.01M7 17h.01" strokeWidth="2.5" />
//     <path d="M14 14h.01M17 14h.01M14 17h.01M17 17h.01M14 20h.01M17 20h.01" strokeWidth="2.5" />
//   </svg>
// );

// const CameraIcon = ({ className = "" }) => (
//   <svg className={`w-10 h-10 md:w-12 md:h-12 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="3" y="7" width="13" height="10" rx="2" />
//     <path d="M16 10l4.5-2.5A1 1 0 0 1 22 8.3v7.4a1 1 0 0 1-1.5.8L16 14" />
//     <path d="M9.5 9l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" strokeWidth="1" fill="white" />
//   </svg>
// );

// const BoxIcon = ({ className = "" }) => (
//   <svg className={`w-10 h-10 md:w-12 md:h-12 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="3" y="6" width="18" height="5" rx="1" />
//     <path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" />
//     <line x1="10" y1="15" x2="14" y2="15" />
//   </svg>
// );

// // Black Arrow Icons 
// const ChevronLeftIcon = () => (
//   <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="15 18 9 12 15 6" />
//   </svg>
// );

// const ChevronRightIcon = () => (
//   <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="9 18 15 12 9 6" />
//   </svg>
// );

// // ============================================================================
// // FEATURE CARD COMPONENT (The "Sweet Spot" Size)
// // ============================================================================

// const FeatureCard: React.FC<FeatureCardProps> = React.memo(({ title, description, icon }) => {
//   return (
//     // Max width 5xl (approx 1024px) - Na zyada bada, na chota
//     <div className="relative w-full max-w-5xl mx-auto bg-white rounded-[36px] p-10 md:p-14 lg:p-20 border border-[#e8eaef] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row items-center md:text-left text-center gap-10 md:gap-16 transition-all duration-300 min-h-[380px]">
      
//       {/* Decorative Blob */}
//       <div className="absolute -top-16 -right-16 md:-top-28 md:-right-28 w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-gradient-to-br from-[#ebf0ff] to-[#f4e8ff] rounded-full pointer-events-none opacity-70" />

//       {/* Icon Container */}
//       <div className="relative z-10 w-[100px] h-[100px] md:w-[128px] md:h-[128px] rounded-[28px] bg-gradient-to-br from-[#3b5cfb] to-[#8d2dee] flex items-center justify-center shadow-[0_12px_24px_-8px_rgba(141,45,238,0.3)] shrink-0">
//         {icon}
//       </div>

//       {/* Text Content */}
//       <div className="relative z-10 flex flex-col">
//         <h3 className="text-[30px] md:text-[40px] lg:text-[46px] font-extrabold text-[#1a1a1a] mb-5 tracking-tight leading-[1.2]">
//           {title}
//         </h3>
//         <p className="text-[18px] md:text-[22px] lg:text-[24px] text-[#595959] leading-[1.6]">
//           {description}
//         </p>
//       </div>
//     </div>
//   );
// });
// FeatureCard.displayName = 'FeatureCard';

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================

// export const FeatureGuide: React.FC = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const features = [
//     {
//       id: 'qr-integration',
//       title: 'QR Integration',
//       description: 'Customers scan any tile in your showroom to unlock the digital twin. Instantly bridges the physical sample to their phone.',
//       icon: <QrIcon />
//     },
//     {
//       id: 'ai-room-scan',
//       title: 'AI Room Scan',
//       description: 'Using LiDAR and computer vision, we map their room dimensions and lighting conditions in real-time. No apps required.',
//       icon: <CameraIcon />
//     },
//     {
//       id: 'instant-checkout',
//       title: 'Instant Checkout',
//       description: 'Direct integration with your inventory. Customers buy the exact quantity needed based on AI-calculated measurements.',
//       icon: <BoxIcon />
//     }
//   ];

//   const handleNext = useCallback(() => {
//     setCurrentIndex((prevIndex) => (prevIndex === features.length - 1 ? 0 : prevIndex + 1));
//   }, [features.length]);

//   const handlePrev = useCallback(() => {
//     setCurrentIndex((prevIndex) => (prevIndex === 0 ? features.length - 1 : prevIndex - 1));
//   }, [features.length]);

//   return (
//     <section className="w-full bg-[#f9fafb] flex flex-col items-center justify-center py-20 lg:py-28 px-4 md:px-6 font-['Inter',_sans-serif] antialiased">
//       <div className="w-full max-w-[1920px] mx-auto overflow-hidden">
        
//         {/* Header Section */}
//         <div className="text-center mb-16 lg:mb-24">
//           <h2 className="text-[#1a1a1a] text-4xl md:text-5xl lg:text-[60px] font-extrabold mb-6 tracking-tight leading-[1.1]">
//             Magic in Three Simple Steps
//           </h2>
//           <p className="text-[#595959] text-[20px] lg:text-[24px] max-w-4xl mx-auto leading-relaxed">
//             Our proprietary AI bridges the gap between digital selection and physical reality.
//           </p>
//         </div>

//         {/* SLIDER SECTION */}
//         <div className="relative w-full max-w-6xl mx-auto px-14 md:px-24">
          
//           {/* Slider Track */}
//           <div className="overflow-hidden w-full rounded-[36px] py-4">
//             <div 
//               className="flex transition-transform duration-500 ease-out" 
//               style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//             >
//               {features.map((feature) => (
//                 <div key={feature.id} className="w-full flex-shrink-0 px-2 sm:px-4">
//                   <FeatureCard
//                     title={feature.title}
//                     description={feature.description}
//                     icon={feature.icon}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Left Arrow Button */}
//           <button 
//             onClick={handlePrev}
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:scale-105 transition-all duration-200 border border-gray-100 focus:outline-none"
//             aria-label="Previous Feature"
//           >
//             <ChevronLeftIcon />
//           </button>

//           {/* Right Arrow Button */}
//           <button 
//             onClick={handleNext}
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:scale-105 transition-all duration-200 border border-gray-100 focus:outline-none"
//             aria-label="Next Feature"
//           >
//             <ChevronRightIcon />
//           </button>

//           {/* Slider Dots */}
//           <div className="flex justify-center gap-3 mt-12">
//             {features.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentIndex(index)}
//                 className={`h-3.5 rounded-full transition-all duration-300 ${
//                   index === currentIndex ? 'bg-[#1a1a1a] w-12' : 'bg-gray-300 hover:bg-gray-400 w-3.5'
//                 }`}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             ))}
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeatureGuide; 

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Swiper modules
import { Navigation } from 'swiper/modules';

// ============================================================================
// SVG ICONS (Premium Proportions)
// ============================================================================

const QrIcon = ({ className = "" }) => (
  <svg className={`w-10 h-10 md:w-12 md:h-12 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="6" height="6" rx="1.5" />
    <rect x="14" y="4" width="6" height="6" rx="1.5" />
    <rect x="4" y="14" width="6" height="6" rx="1.5" />
    <path d="M7 7h.01M17 7h.01M7 17h.01" strokeWidth="2.5" />
    <path d="M14 14h.01M17 14h.01M14 17h.01M17 17h.01M14 20h.01M17 20h.01" strokeWidth="2.5" />
  </svg>
);

const CameraIcon = ({ className = "" }) => (
  <svg className={`w-10 h-10 md:w-12 md:h-12 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="13" height="10" rx="2" />
    <path d="M16 10l4.5-2.5A1 1 0 0 1 22 8.3v7.4a1 1 0 0 1-1.5.8L16 14" />
    <path d="M9.5 9l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" strokeWidth="1" fill="white" />
  </svg>
);

const BoxIcon = ({ className = "" }) => (
  <svg className={`w-10 h-10 md:w-12 md:h-12 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="18" height="5" rx="1" />
    <path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" />
    <line x1="10" y1="15" x2="14" y2="15" />
  </svg>
);

// ============================================================================
// FEATURE CARD COMPONENT
// ============================================================================

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = React.memo(({ title, description, icon }) => {
  return (
    // Card ki max-width fix rakhi hai taaki stretch hokar kharab na lage
    // Slider ka outer container 1800px hoga, par ye card centered rahega (max-w-5xl)
    <div className="relative w-full max-w-5xl mx-auto bg-white rounded-[36px] p-10 md:p-14 lg:p-20 border border-[#e8eaef] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row items-center md:text-left text-center gap-10 md:gap-16 transition-all duration-300 min-h-[400px]">
      
      {/* Decorative Blob */}
      <div className="absolute -top-16 -right-16 md:-top-28 md:-right-28 w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-gradient-to-br from-[#ebf0ff] to-[#f4e8ff] rounded-full pointer-events-none opacity-70" />

      {/* Icon Container */}
      <div className="relative z-10 w-[100px] h-[100px] md:w-[128px] md:h-[128px] rounded-[28px] bg-gradient-to-br from-[#3b5cfb] to-[#8d2dee] flex items-center justify-center shadow-[0_12px_24px_-8px_rgba(141,45,238,0.3)] shrink-0">
        {icon}
      </div>

      {/* Text Content */}
      <div className="relative z-10 flex flex-col">
        <h3 className="text-[30px] md:text-[40px] lg:text-[46px] font-extrabold text-[#1a1a1a] mb-5 tracking-tight leading-[1.2]">
          {title}
        </h3>
        <p className="text-[18px] md:text-[22px] lg:text-[24px] text-[#595959] leading-[1.6]">
          {description}
        </p>
      </div>
    </div>
  );
});
FeatureCard.displayName = 'FeatureCard';

// ============================================================================
// MAIN COMPONENT - PERFECTLY ALIGNED WITH FOOTER
// ============================================================================

export const FeatureGuide: React.FC = () => {
  const features = [
    {
      id: 'qr-integration',
      title: 'QR Integration',
      description: 'Customers scan any tile in your showroom to unlock the digital twin. Instantly bridges the physical sample to their phone.',
      icon: <QrIcon />
    },
    {
      id: 'ai-room-scan',
      title: 'AI Room Scan',
      description: 'Using LiDAR and computer vision, we map their room dimensions and lighting conditions in real-time. No apps required.',
      icon: <CameraIcon />
    },
    {
      id: 'instant-checkout',
      title: 'Instant Checkout',
      description: 'Direct integration with your inventory. Customers buy the exact quantity needed based on AI-calculated measurements.',
      icon: <BoxIcon />
    }
  ];

  return (
    // Outer section wrapper
    <section className="w-full bg-[#f9fafb] flex flex-col items-center justify-center py-20 lg:py-28 font-['Inter',_sans-serif] antialiased">
      
      {/* ✅ THE SECRET SAUCE: Same grid as Footer 
        max-w-[1800px] aur px-3 md:px-5 lagaya hai 
      */}
      <div className="w-full max-w-[1800px] mx-auto px-3 md:px-5">
        
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-24">
          <h2 className="text-[#1a1a1a] text-4xl md:text-5xl lg:text-[60px] font-extrabold mb-6 tracking-tight leading-[1.1]">
            Magic in Three Simple Steps
          </h2>
          <p className="text-[#595959] text-[20px] lg:text-[24px] max-w-4xl mx-auto leading-relaxed">
            Our proprietary AI bridges the gap between digital selection and physical reality.
          </p>
        </div>

        {/* SWIPER SLIDER SECTION */}
        {/* Container ab full width (1800px) lega jisse arrows bilkul edge par rahenge */}
        <div className="relative w-full">
          <Swiper 
            navigation={true} 
            modules={[Navigation]} 
            loop={true} 
            grabCursor={true} // Mouse cursor swipe feel ke liye
            className="mySwiper !pb-12 !px-12 md:!px-20 lg:!px-24" // Padding taaki card arrows ke upar na aaye
            style={{
              '--swiper-navigation-color': '#000000',
              '--swiper-navigation-size': '28px', // Arrows ko zyada bada nahi rakha hai (pro look)
              '--swiper-navigation-sides-offset': '0px' // Edge to edge alignment
            } as React.CSSProperties}
          >
            {features.map((feature) => (
              <SwiperSlide key={feature.id} className="pt-4 flex justify-center">
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
};

export default FeatureGuide;