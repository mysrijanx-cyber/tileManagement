
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