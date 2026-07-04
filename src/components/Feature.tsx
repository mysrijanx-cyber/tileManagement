
// import React from 'react';

// // ============================================================================
// // INTERFACES
// // ============================================================================

// interface FeatureCardProps {
//   title: string;
//   description: string;
//   icon: React.ReactNode;
// }

// // ============================================================================
// // SVG ICONS (FIXED: Removed hardcoded sizes, made them responsive via CSS)
// // ============================================================================

// const QrIcon = ({ className = "" }) => (
//   <svg className={`w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="4" y="4" width="6" height="6" rx="1.5" />
//     <rect x="14" y="4" width="6" height="6" rx="1.5" />
//     <rect x="4" y="14" width="6" height="6" rx="1.5" />
//     <path d="M7 7h.01M17 7h.01M7 17h.01" strokeWidth="2.5" />
//     <path d="M14 14h.01M17 14h.01M14 17h.01M17 17h.01M14 20h.01M17 20h.01" strokeWidth="2.5" />
//   </svg>
// );

// const CameraIcon = ({ className = "" }) => (
//   <svg className={`w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="3" y="7" width="13" height="10" rx="2" />
//     <path d="M16 10l4.5-2.5A1 1 0 0 1 22 8.3v7.4a1 1 0 0 1-1.5.8L16 14" />
//     <path d="M9.5 9l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" strokeWidth="1" fill="white" />
//   </svg>
// );

// const BoxIcon = ({ className = "" }) => (
//   <svg className={`w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="3" y="6" width="18" height="5" rx="1" />
//     <path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" />
//     <line x1="10" y1="15" x2="14" y2="15" />
//   </svg>
// );

// // ============================================================================
// // FEATURE CARD COMPONENT
// // ============================================================================

// const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
//   return (
//     <div className="relative bg-white rounded-[32px] p-[28px] sm:p-[32px] md:p-[36px] lg:p-[44px] xl:p-[48px] 2xl:p-[52px] border border-[#e8eaef] shadow-[0_4px_24px_-10px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col items-start transition-all duration-300 ease-in-out hover:shadow-[0_8px_32px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1">
      
//       {/* Decorative Top-Right Blob */}
//       <div className="absolute -top-12 -right-12 sm:-top-16 sm:-right-16 md:-top-20 md:-right-20 lg:-top-24 lg:-right-24 xl:-top-28 xl:-right-28 w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px] xl:w-[360px] xl:h-[360px] bg-gradient-to-br from-[#ebf0ff] to-[#f4e8ff] rounded-full pointer-events-none transition-all duration-300" />

//       {/* Icon Container - SCALED UP FOR DESKTOP */}
//       <div className="relative z-10 w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] md:w-[72px] md:h-[72px] lg:w-[84px] lg:h-[84px] xl:w-[96px] xl:h-[96px] rounded-[16px] sm:rounded-[18px] lg:rounded-[22px] xl:rounded-[24px] bg-gradient-to-br from-[#3b5cfb] to-[#8d2dee] flex items-center justify-center mb-6 sm:mb-8 lg:mb-10 shadow-[0_8px_16px_-6px_rgba(141,45,238,0.4)] transition-all duration-300 ease-in-out hover:scale-105 shrink-0">
//         {icon}
//       </div>

//       {/* Title - SCALED UP FOR DESKTOP */}
//       <h3 className="relative z-10 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[26px] xl:text-[28px] 2xl:text-[32px] font-semibold text-[#1a1a1a] mb-3 lg:mb-4 tracking-tight leading-[1.3]">
//         {title}
//       </h3>
      
//       {/* Description - SCALED UP FOR DESKTOP */}
//       <p className="relative z-10 text-[14.5px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[19px] text-[#595959] leading-[1.65]">
//         {description}
//       </p>
//     </div>
//   );
// };

// // ============================================================================
// // MAIN COMPONENT - PRODUCTION READY
// // ============================================================================

// export const FeatureGuide: React.FC = () => {
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

//   return (
//     <div className="min-h-screen bg-[#f5f6f9] flex flex-col items-center justify-center py-16 sm:py-20 lg:py-28 xl:py-32 px-4 sm:px-6 font-sans antialiased">
      
//       {/* FIXED: Scaled container to 1400px to match Hero Section width */}
//       <div className="max-w-[1400px] w-full mx-auto">
        
//         {/* Header Section */}
//         <div className="text-center mb-14 sm:mb-16 md:mb-20 lg:mb-24">
          
//           {/* Main Heading - SCALED UP FOR DESKTOP */}
//           <h2 className="text-[#1a1a1a] text-[32px] sm:text-[38px] md:text-[44px] lg:text-[56px] xl:text-[64px] font-bold mb-4 sm:mb-6 tracking-tight leading-[1.15] px-4">
//             Magic in Three Simple Steps
//           </h2>
          
//           {/* Subheading - SCALED UP FOR DESKTOP */}
//    <p className="text-[#595959] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] max-w-4xl lg:max-w-5xl xl:max-w-[1200px] mx-auto leading-[1.6] px-4">
//   Our proprietary AI bridges the gap between digital selection and physical reality.
// </p>
//         </div>

//         {/* Feature Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
//           {features.map((feature) => (
//             <FeatureCard
//               key={feature.id}
//               title={feature.title}
//               description={feature.description}
//               icon={feature.icon}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }; 
import React from 'react';

// ============================================================================
// INTERFACES
// ============================================================================

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

// ============================================================================
// SVG ICONS (Scaled for a premium, compact look)
// ============================================================================

const QrIcon = ({ className = "" }) => (
  <svg className={`w-7 h-7 xl:w-8 xl:h-8 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="6" height="6" rx="1.5" />
    <rect x="14" y="4" width="6" height="6" rx="1.5" />
    <rect x="4" y="14" width="6" height="6" rx="1.5" />
    <path d="M7 7h.01M17 7h.01M7 17h.01" strokeWidth="2.5" />
    <path d="M14 14h.01M17 14h.01M14 17h.01M17 17h.01M14 20h.01M17 20h.01" strokeWidth="2.5" />
  </svg>
);

const CameraIcon = ({ className = "" }) => (
  <svg className={`w-7 h-7 xl:w-8 xl:h-8 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="13" height="10" rx="2" />
    <path d="M16 10l4.5-2.5A1 1 0 0 1 22 8.3v7.4a1 1 0 0 1-1.5.8L16 14" />
    <path d="M9.5 9l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" strokeWidth="1" fill="white" />
  </svg>
);

const BoxIcon = ({ className = "" }) => (
  <svg className={`w-7 h-7 xl:w-8 xl:h-8 ${className}`} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="18" height="5" rx="1" />
    <path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" />
    <line x1="10" y1="15" x2="14" y2="15" />
  </svg>
);

// ============================================================================
// FEATURE CARD COMPONENT (Proportions Fixed)
// ============================================================================

const FeatureCard: React.FC<FeatureCardProps> = React.memo(({ title, description, icon }) => {
  return (
    // Padding kam karke p-8 se p-10 (max) tak rakhi hai taaki height compact rahe
    <div className="relative bg-white rounded-[32px] p-8 xl:p-10 border border-[#e8eaef] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col items-start transition-all duration-300 ease-in-out hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1">
      
      {/* Decorative Top-Right Blob - Size Adjusted */}
      <div className="absolute -top-12 -right-12 xl:-top-16 xl:-right-16 w-[180px] h-[180px] xl:w-[220px] xl:h-[220px] bg-gradient-to-br from-[#ebf0ff] to-[#f4e8ff] rounded-full pointer-events-none transition-all duration-300" />

      {/* Icon Container - Scaled down to standard premium size (64px) */}
      <div className="relative z-10 w-[56px] h-[56px] xl:w-[64px] xl:h-[64px] rounded-[18px] bg-gradient-to-br from-[#3b5cfb] to-[#8d2dee] flex items-center justify-center mb-6 xl:mb-8 shadow-[0_8px_16px_-6px_rgba(141,45,238,0.3)] shrink-0 transition-transform duration-300 hover:scale-105">
        {icon}
      </div>

      {/* Title */}
      <h3 className="relative z-10 text-[22px] xl:text-[26px] font-bold text-[#1a1a1a] mb-3 tracking-tight leading-[1.2]">
        {title}
      </h3>
      
      {/* Description */}
      <p className="relative z-10 text-[16px] xl:text-[18px] text-[#595959] leading-[1.6]">
        {description}
      </p>
    </div>
  );
});
FeatureCard.displayName = 'FeatureCard';

// ============================================================================
// MAIN COMPONENT - PRODUCTION READY
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
    // Outer Wrapper: Same logic as Banner (px-3 md:px-5)
    // Height padding set to py-20 lg:py-28 (sleeker than min-h-screen)
    <section className="w-full bg-[#f9fafb] flex flex-col items-center justify-center py-20 lg:py-28 px-3 md:px-5 font-['Inter',_sans-serif] antialiased">
      
      {/* Inner Wrapper: 1920px max-width to sync with Banner & Stats */}
      <div className="w-full max-w-[1920px] mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-[#1a1a1a] text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold mb-5 tracking-tight leading-[1.1]">
            Magic in Three Simple Steps
          </h2>
          <p className="text-[#595959] text-[18px] lg:text-[22px] xl:text-[24px] max-w-4xl mx-auto leading-relaxed">
            Our proprietary AI bridges the gap between digital selection and physical reality.
          </p>
        </div>

        {/* Feature Cards Grid - 3 Columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeatureGuide;