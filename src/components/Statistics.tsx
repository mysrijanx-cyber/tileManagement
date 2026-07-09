
import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

// ============================================================================
// STATISTICS SECTION - PRODUCTION READY
// Aligned with App.tsx: max-w-[1800px] + px-3 md:px-5
// ============================================================================

interface FeatureItemProps {
  text: string;
}

interface StatCardProps {
  label: string;
  value: string;
  subtitle: string;
  subtitleColor: string;
}

// ============================================================================
// FEATURE ITEM COMPONENT
// ============================================================================

const FeatureItem: React.FC<FeatureItemProps> = React.memo(({ text }) => (
  <li className="flex items-start gap-4 md:gap-5">
    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#E5EDFF] flex items-center justify-center shrink-0 mt-1 transition-transform duration-300 hover:scale-110">
      <Check className="w-5 h-5 md:w-6 md:h-6 text-[#053BD8] stroke-[3]" />
    </div>
    <span className="text-lg md:text-xl lg:text-[22px] font-semibold text-[#111827] leading-relaxed">
      {text}
    </span>
  </li>
));
FeatureItem.displayName = 'FeatureItem';

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

const StatCard: React.FC<StatCardProps> = React.memo(({ label, value, subtitle, subtitleColor }) => (
  <div className="flex flex-col transition-transform duration-300 hover:-translate-y-1">
    <p className="text-xs md:text-sm font-bold text-[#6B7280] tracking-[0.1em] mb-2 uppercase">
      {label}
    </p>
    <p className="text-4xl md:text-5xl lg:text-[56px] font-black text-[#111827] leading-none mb-2 md:mb-3">
      {value}
    </p>
    <p className={`text-base md:text-lg font-semibold ${subtitleColor}`}>
      {subtitle}
    </p>
  </div>
));
StatCard.displayName = 'StatCard';

// ============================================================================
// CHART BAR COMPONENT
// ============================================================================

const ChartBar: React.FC<{ height: string; variant: 'primary' | 'secondary'; index: number }> = React.memo(({ 
  height, 
  variant, 
  index 
}) => {
  const bgColor = variant === 'primary' ? 'bg-[#053BD8]' : 'bg-[#5B85F9]';
  
  return (
    <div
      className={`w-8 md:w-10 lg:w-12 rounded-t-lg md:rounded-t-xl ${bgColor} transition-all duration-300 hover:opacity-80 hover:scale-105`}
      style={{ 
        height,
        animation: `slideUp 0.6s ease-out ${index * 0.08}s forwards`,
        opacity: 0,
        transformOrigin: 'bottom'
      }}
    />
  );
});
ChartBar.displayName = 'ChartBar';

// ============================================================================
// WINDOW CONTROLS (MAC STYLE)
// ============================================================================

const WindowControls: React.FC = React.memo(() => (
  <div className="flex gap-2">
    <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FF5F56] transition-transform duration-300 hover:scale-110" />
    <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FFBD2E] transition-transform duration-300 hover:scale-110" />
    <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#27C93F] transition-transform duration-300 hover:scale-110" />
  </div>
));
WindowControls.displayName = 'WindowControls';

// ============================================================================
// MAIN COMPONENT - STATISTICS SECTION
// ✅ ALIGNED WITH APP.TSX: max-w-[1800px] + px-3 md:px-5
// ============================================================================

export const Statistics: React.FC = () => {
  
  const features = [
    'Heatmap of popular tile scans',
    'Conversion rate from 3D preview',
    'Automated stock reordering',
  ];

  const chartData = [
    { height: '40%', variant: 'primary' as const },
    { height: '60%', variant: 'secondary' as const },
    { height: '95%', variant: 'primary' as const },
    { height: '50%', variant: 'secondary' as const },
    { height: '80%', variant: 'primary' as const },
    { height: '45%', variant: 'secondary' as const },
    { height: '90%', variant: 'primary' as const },
  ];

  return (
    <>
      {/* Animation Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: scaleY(0);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }
      `}} />

      {/* ✅ MAIN OUTER WRAPPER - ALIGNED WITH APP.TSX */}
      {/* Previous: max-w-[1280px] px-5 md:px-8 lg:px-12 xl:px-16 */}
      {/* New: max-w-[1800px] px-3 md:px-5 (SAME AS FEATUREGUIDE, NAVIGATION, HERO) */}
      <section className="w-full max-w-[1800px] mx-auto py-20 lg:py-28 px-3 md:px-5 font-['Inter',_sans-serif] antialiased">
        
        {/* ✅ INNER FLEX ROW - RESPONSIVE LAYOUT */}
        {/* Gap adjusted for better spacing across screens */}
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start gap-12 md:gap-16 lg:gap-16 xl:gap-20">
          
          {/* ═══════════════════════════════════════════════════════════
              LEFT COLUMN - TEXT & FEATURES (45% WIDTH ON DESKTOP)
          ═══════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[45%] flex flex-col gap-6 md:gap-7 lg:gap-8">
            
            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-black text-[#111827] leading-[1.1] tracking-tight">
              Data-Driven<br />
              Showroom Insights
            </h2>
            
            {/* Description */}
            <p className="text-base md:text-lg lg:text-[20px] xl:text-[22px] text-[#4B5563] leading-relaxed">
              Stop guessing what sells. Track which tiles are being scanned, visualized, and purchased in real-time across all your locations.
            </p>

            {/* Features List */}
            <ul className="flex flex-col gap-5 md:gap-6" role="list">
              {features.map((text, index) => (
                <FeatureItem key={index} text={text} />
              ))}
            </ul>

            {/* CTA Link */}
            <a
              href="#analytics"
              className="inline-flex items-center gap-3 text-lg md:text-xl font-bold text-[#053BD8] hover:gap-4 transition-all duration-300 group mt-2"
              aria-label="Explore Analytics Platform"
            >
              Explore Analytics Platform
              <ChevronRight className="w-6 h-6 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </a>

          </div>

          {/* ═══════════════════════════════════════════════════════════
              RIGHT COLUMN - DASHBOARD CARD (55% WIDTH ON DESKTOP)
          ═══════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[55%]">
            
            {/* Glassmorphism Card */}
            <div className="
              w-full
              bg-white/40
              backdrop-blur-[20px]
              border border-white/60
              rounded-[20px] md:rounded-[24px] lg:rounded-[28px]
              p-6 md:p-7 lg:p-8 xl:p-10
              shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]
              flex flex-col
              gap-6 md:gap-7 lg:gap-8
              transition-all duration-300
              hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)]
            ">
              
              {/* Header - Window Controls + Badge */}
              <div className="flex items-center justify-between">
                <WindowControls />
                <div className="bg-[#F4F7FF] text-[#053BD8] text-xs md:text-sm font-bold px-4 py-2 rounded-full border border-[#E5EDFF] transition-transform duration-300 hover:scale-105">
                  LuxeTile Dashboard v2.4
                </div>
              </div>

              {/* Stats Cards - Two Column Grid */}
              <div className="grid grid-cols-2 gap-6 md:gap-8">
                <StatCard
                  label="TOTAL SCANS"
                  value="12,482"
                  subtitle="+18% this month"
                  subtitleColor="text-[#059669]"
                />
                <StatCard
                  label="AVG. VIZ TIME"
                  value="4m 12s"
                  subtitle="High Engagement"
                  subtitleColor="text-[#053BD8]"
                />
              </div>

              {/* Chart Container */}
              <div className="
                w-full
                h-[180px] md:h-[220px] lg:h-[250px] xl:h-[280px]
                bg-[#F9FAFB]
                rounded-2xl
                p-5 md:p-6 lg:p-7
                flex items-end justify-between
                border border-[#E5E7EB]
                gap-2 md:gap-3
                transition-all duration-300
                hover:border-[#D1D5DB]
              ">
                {chartData.map((bar, index) => (
                  <ChartBar
                    key={index}
                    height={bar.height}
                    variant={bar.variant}
                    index={index}
                  />
                ))}
              </div>

            </div>

          </div>

        </div>

      </section>
    </>
  );
};

export default Statistics;