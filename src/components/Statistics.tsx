
// // import React from 'react';
// // import { Check, ChevronRight } from 'lucide-react';

// // // ============================================================================
// // // STATISTICS SECTION - PRODUCTION READY
// // // Aligned with App.tsx: max-w-[1800px] + px-3 md:px-5
// // // ============================================================================

// // interface FeatureItemProps {
// //   text: string;
// // }

// // interface StatCardProps {
// //   label: string;
// //   value: string;
// //   subtitle: string;
// //   subtitleColor: string;
// // }

// // // ============================================================================
// // // FEATURE ITEM COMPONENT
// // // ============================================================================

// // const FeatureItem: React.FC<FeatureItemProps> = React.memo(({ text }) => (
// //   <li className="flex items-start gap-4 md:gap-5">
// //     <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#E5EDFF] flex items-center justify-center shrink-0 mt-1 transition-transform duration-300 hover:scale-110">
// //       <Check className="w-5 h-5 md:w-6 md:h-6 text-[#053BD8] stroke-[3]" />
// //     </div>
// //     <span className="text-lg md:text-xl lg:text-[22px] font-semibold text-[#111827] leading-relaxed">
// //       {text}
// //     </span>
// //   </li>
// // ));
// // FeatureItem.displayName = 'FeatureItem';

// // // ============================================================================
// // // STAT CARD COMPONENT
// // // ============================================================================

// // const StatCard: React.FC<StatCardProps> = React.memo(({ label, value, subtitle, subtitleColor }) => (
// //   <div className="flex flex-col transition-transform duration-300 hover:-translate-y-1">
// //     <p className="text-xs md:text-sm font-bold text-[#6B7280] tracking-[0.1em] mb-2 uppercase">
// //       {label}
// //     </p>
// //     <p className="text-4xl md:text-5xl lg:text-[56px] font-black text-[#111827] leading-none mb-2 md:mb-3">
// //       {value}
// //     </p>
// //     <p className={`text-base md:text-lg font-semibold ${subtitleColor}`}>
// //       {subtitle}
// //     </p>
// //   </div>
// // ));
// // StatCard.displayName = 'StatCard';

// // // ============================================================================
// // // CHART BAR COMPONENT
// // // ============================================================================

// // const ChartBar: React.FC<{ height: string; variant: 'primary' | 'secondary'; index: number }> = React.memo(({ 
// //   height, 
// //   variant, 
// //   index 
// // }) => {
// //   const bgColor = variant === 'primary' ? 'bg-[#053BD8]' : 'bg-[#5B85F9]';
  
// //   return (
// //     <div
// //       className={`w-8 md:w-10 lg:w-12 rounded-t-lg md:rounded-t-xl ${bgColor} transition-all duration-300 hover:opacity-80 hover:scale-105`}
// //       style={{ 
// //         height,
// //         animation: `slideUp 0.6s ease-out ${index * 0.08}s forwards`,
// //         opacity: 0,
// //         transformOrigin: 'bottom'
// //       }}
// //     />
// //   );
// // });
// // ChartBar.displayName = 'ChartBar';

// // // ============================================================================
// // // WINDOW CONTROLS (MAC STYLE)
// // // ============================================================================

// // const WindowControls: React.FC = React.memo(() => (
// //   <div className="flex gap-2">
// //     <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FF5F56] transition-transform duration-300 hover:scale-110" />
// //     <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FFBD2E] transition-transform duration-300 hover:scale-110" />
// //     <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#27C93F] transition-transform duration-300 hover:scale-110" />
// //   </div>
// // ));
// // WindowControls.displayName = 'WindowControls';

// // // ============================================================================
// // // MAIN COMPONENT - STATISTICS SECTION
// // // ✅ ALIGNED WITH APP.TSX: max-w-[1800px] + px-3 md:px-5
// // // ============================================================================

// // export const Statistics: React.FC = () => {
  
// //   const features = [
// //     'Heatmap of popular tile scans',
// //     'Conversion rate from 3D preview',
// //     'Automated stock reordering',
// //   ];

// //   const chartData = [
// //     { height: '40%', variant: 'primary' as const },
// //     { height: '60%', variant: 'secondary' as const },
// //     { height: '95%', variant: 'primary' as const },
// //     { height: '50%', variant: 'secondary' as const },
// //     { height: '80%', variant: 'primary' as const },
// //     { height: '45%', variant: 'secondary' as const },
// //     { height: '90%', variant: 'primary' as const },
// //   ];

// //   return (
// //     <>
// //       {/* Animation Keyframes */}
// //       <style dangerouslySetInnerHTML={{__html: `
// //         @keyframes slideUp {
// //           from {
// //             opacity: 0;
// //             transform: scaleY(0);
// //           }
// //           to {
// //             opacity: 1;
// //             transform: scaleY(1);
// //           }
// //         }
// //       `}} />

// //       {/* ✅ MAIN OUTER WRAPPER - ALIGNED WITH APP.TSX */}
// //       {/* Previous: max-w-[1280px] px-5 md:px-8 lg:px-12 xl:px-16 */}
// //       {/* New: max-w-[1800px] px-3 md:px-5 (SAME AS FEATUREGUIDE, NAVIGATION, HERO) */}
// //       <section className="w-full max-w-[1800px] mx-auto py-20 lg:py-28 px-3 md:px-5 font-['Inter',_sans-serif] antialiased">
        
// //         {/* ✅ INNER FLEX ROW - RESPONSIVE LAYOUT */}
// //         {/* Gap adjusted for better spacing across screens */}
// //         <div className="w-full flex flex-col lg:flex-row items-center lg:items-start gap-12 md:gap-16 lg:gap-16 xl:gap-20">
          
// //           {/* ═══════════════════════════════════════════════════════════
// //               LEFT COLUMN - TEXT & FEATURES (45% WIDTH ON DESKTOP)
// //           ═══════════════════════════════════════════════════════════ */}
// //           <div className="w-full lg:w-[45%] flex flex-col gap-6 md:gap-7 lg:gap-8">
            
// //             {/* Main Heading */}
// //             <h2 className="text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-black text-[#111827] leading-[1.1] tracking-tight">
// //               Data-Driven<br />
// //               Showroom Insights
// //             </h2>
            
// //             {/* Description */}
// //             <p className="text-base md:text-lg lg:text-[20px] xl:text-[22px] text-[#4B5563] leading-relaxed">
// //               Stop guessing what sells. Track which tiles are being scanned, visualized, and purchased in real-time across all your locations.
// //             </p>

// //             {/* Features List */}
// //             <ul className="flex flex-col gap-5 md:gap-6" role="list">
// //               {features.map((text, index) => (
// //                 <FeatureItem key={index} text={text} />
// //               ))}
// //             </ul>

// //             {/* CTA Link */}
// //             <a
// //               href="#analytics"
// //               className="inline-flex items-center gap-3 text-lg md:text-xl font-bold text-[#053BD8] hover:gap-4 transition-all duration-300 group mt-2"
// //               aria-label="Explore Analytics Platform"
// //             >
// //               Explore Analytics Platform
// //               <ChevronRight className="w-6 h-6 stroke-[3] group-hover:translate-x-1 transition-transform" />
// //             </a>

// //           </div>

// //           {/* ═══════════════════════════════════════════════════════════
// //               RIGHT COLUMN - DASHBOARD CARD (55% WIDTH ON DESKTOP)
// //           ═══════════════════════════════════════════════════════════ */}
// //           <div className="w-full lg:w-[55%]">
            
// //             {/* Glassmorphism Card */}
// //             <div className="
// //               w-full
// //               bg-white/40
// //               backdrop-blur-[20px]
// //               border border-white/60
// //               rounded-[20px] md:rounded-[24px] lg:rounded-[28px]
// //               p-6 md:p-7 lg:p-8 xl:p-10
// //               shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]
// //               flex flex-col
// //               gap-6 md:gap-7 lg:gap-8
// //               transition-all duration-300
// //               hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)]
// //             ">
              
// //               {/* Header - Window Controls + Badge */}
// //               <div className="flex items-center justify-between">
// //                 <WindowControls />
// //                 <div className="bg-[#F4F7FF] text-[#053BD8] text-xs md:text-sm font-bold px-4 py-2 rounded-full border border-[#E5EDFF] transition-transform duration-300 hover:scale-105">
// //                   LuxeTile Dashboard v2.4
// //                 </div>
// //               </div>

// //               {/* Stats Cards - Two Column Grid */}
// //               <div className="grid grid-cols-2 gap-6 md:gap-8">
// //                 <StatCard
// //                   label="TOTAL SCANS"
// //                   value="12,482"
// //                   subtitle="+18% this month"
// //                   subtitleColor="text-[#059669]"
// //                 />
// //                 <StatCard
// //                   label="AVG. VIZ TIME"
// //                   value="4m 12s"
// //                   subtitle="High Engagement"
// //                   subtitleColor="text-[#053BD8]"
// //                 />
// //               </div>

// //               {/* Chart Container */}
// //               <div className="
// //                 w-full
// //                 h-[180px] md:h-[220px] lg:h-[250px] xl:h-[280px]
// //                 bg-[#F9FAFB]
// //                 rounded-2xl
// //                 p-5 md:p-6 lg:p-7
// //                 flex items-end justify-between
// //                 border border-[#E5E7EB]
// //                 gap-2 md:gap-3
// //                 transition-all duration-300
// //                 hover:border-[#D1D5DB]
// //               ">
// //                 {chartData.map((bar, index) => (
// //                   <ChartBar
// //                     key={index}
// //                     height={bar.height}
// //                     variant={bar.variant}
// //                     index={index}
// //                   />
// //                 ))}
// //               </div>

// //             </div>

// //           </div>

// //         </div>

// //       </section>
// //     </>
// //   );
// // };

// // export default Statistics; 
// import React from 'react';
// import { Check, ChevronRight } from 'lucide-react';

// // ============================================================================
// // STATISTICS SECTION - PRODUCTION READY
// // ============================================================================

// interface FeatureItemProps {
//   text: string;
// }

// interface StatCardProps {
//   label: string;
//   value: string;
//   subtitle: string;
//   subtitleColor: string;
// }

// // ============================================================================
// // FEATURE ITEM COMPONENT
// // ============================================================================

// const FeatureItem: React.FC<FeatureItemProps> = React.memo(({ text }) => (
//   <li className="flex items-start gap-3 md:gap-4">
//     <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#E5EDFF] flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300 hover:scale-110">
//       <Check className="w-4 h-4 md:w-5 md:h-5 text-[#053BD8] stroke-[3]" />
//     </div>
//     <span className="text-[17px] md:text-lg lg:text-[19px] font-semibold text-[#111827] leading-relaxed">
//       {text}
//     </span>
//   </li>
// ));
// FeatureItem.displayName = 'FeatureItem';

// // ============================================================================
// // STAT CARD COMPONENT
// // ============================================================================

// const StatCard: React.FC<StatCardProps> = React.memo(({ label, value, subtitle, subtitleColor }) => (
//   <div className="flex flex-col transition-transform duration-300 hover:-translate-y-1">
//     <p className="text-[11px] md:text-xs font-bold text-[#6B7280] tracking-wider mb-1 md:mb-1.5 uppercase">
//       {label}
//     </p>
//     <p className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#111827] leading-none mb-1.5 md:mb-2">
//       {value}
//     </p>
//     <p className={`text-sm md:text-[15px] font-semibold ${subtitleColor}`}>
//       {subtitle}
//     </p>
//   </div>
// ));
// StatCard.displayName = 'StatCard';

// // ============================================================================
// // CHART BAR COMPONENT
// // ============================================================================

// const ChartBar: React.FC<{ height: string; variant: 'primary' | 'secondary'; index: number }> = React.memo(({ 
//   height, 
//   variant, 
//   index 
// }) => {
//   const bgColor = variant === 'primary' ? 'bg-[#053BD8]' : 'bg-[#5B85F9]';
  
//   return (
//     <div
//       className={`w-7 md:w-10 lg:w-12 rounded-t-[6px] md:rounded-t-lg ${bgColor} transition-all duration-300 hover:opacity-80 hover:scale-[1.02]`}
//       style={{ 
//         height,
//         animation: `slideUp 0.6s ease-out ${index * 0.08}s forwards`,
//         opacity: 0,
//         transformOrigin: 'bottom'
//       }}
//     />
//   );
// });
// ChartBar.displayName = 'ChartBar';

// // ============================================================================
// // WINDOW CONTROLS (MAC STYLE)
// // ============================================================================

// const WindowControls: React.FC = React.memo(() => (
//   <div className="flex gap-2">
//     <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FF5F56] transition-transform duration-300 hover:scale-110" />
//     <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#FFBD2E] transition-transform duration-300 hover:scale-110" />
//     <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#27C93F] transition-transform duration-300 hover:scale-110" />
//   </div>
// ));
// WindowControls.displayName = 'WindowControls';

// // ============================================================================
// // MAIN COMPONENT - STATISTICS SECTION
// // ============================================================================

// export const Statistics: React.FC = () => {
  
//   const features = [
//     'Heatmap of popular tile scans',
//     'Conversion rate from 3D preview',
//     'Automated stock reordering',
//   ];

//   // Adjusted heights to visually match the provided reference image
//   const chartData = [
//     { height: '40%', variant: 'primary' as const },
//     { height: '55%', variant: 'secondary' as const },
//     { height: '85%', variant: 'primary' as const },
//     { height: '50%', variant: 'secondary' as const },
//     { height: '75%', variant: 'primary' as const },
//     { height: '45%', variant: 'secondary' as const },
//     { height: '80%', variant: 'primary' as const },
//   ];

//   return (
//     <>
//       {/* Animation Keyframes */}
//       <style dangerouslySetInnerHTML={{__html: `
//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: scaleY(0);
//           }
//           to {
//             opacity: 1;
//             transform: scaleY(1);
//           }
//         }
//       `}} />

//       <section className="w-full max-w-[1800px] mx-auto py-16 md:py-20 lg:py-28 px-4 md:px-5 font-['Inter',_sans-serif] antialiased bg-[#FAFBFD]">
        
//         <div className="w-full flex flex-col lg:flex-row items-center justify-between lg:items-start gap-12 md:gap-16 lg:gap-8 xl:gap-20">
          
//           {/* ═══════════════════════════════════════════════════════════
//               LEFT COLUMN - TEXT & FEATURES (Max 45% WIDTH ON DESKTOP)
//           ═══════════════════════════════════════════════════════════ */}
//           <div className="w-full lg:w-[45%] flex flex-col gap-6 md:gap-7 lg:gap-8 max-w-2xl">
            
//             {/* Main Heading */}
//             <h2 className="text-[36px] md:text-5xl lg:text-[56px] xl:text-[60px] font-black text-[#111827] leading-[1.15] tracking-tight">
//               Data-Driven<br />
//               Showroom Insights
//             </h2>
            
//             {/* Description (Added max-w to force 3 lines as requested) */}
//             <p className="text-base md:text-[18px] lg:text-[19px] text-[#4B5563] leading-relaxed max-w-[420px]">
//               Stop guessing what sells. Track which tiles are being scanned, visualized, and purchased in real-time across all your locations.
//             </p>

//             {/* Features List */}
//             <ul className="flex flex-col gap-4 md:gap-5 mt-2" role="list">
//               {features.map((text, index) => (
//                 <FeatureItem key={index} text={text} />
//               ))}
//             </ul>

//             {/* CTA Link */}
//             <a
//               href="#analytics"
//               className="inline-flex items-center gap-2 text-[17px] md:text-[19px] font-bold text-[#053BD8] hover:gap-3 transition-all duration-300 group mt-4 md:mt-6"
//               aria-label="Explore Analytics Platform"
//             >
//               Explore Analytics Platform
//               <ChevronRight className="w-5 h-5 md:w-6 md:h-6 stroke-[3] group-hover:translate-x-1 transition-transform" />
//             </a>

//           </div>

//           {/* ═══════════════════════════════════════════════════════════
//               RIGHT COLUMN - DASHBOARD CARD (55% WIDTH ON DESKTOP)
//           ═══════════════════════════════════════════════════════════ */}
//           <div className="w-full lg:w-[55%] max-w-3xl">
            
//             {/* Solid Card with Soft Premium Shadow */}
//             <div className="
//               w-full
//               bg-white
//               border border-gray-100
//               rounded-[24px] lg:rounded-[28px]
//               p-6 md:p-8 lg:p-10
//               shadow-[0_12px_40px_rgba(0,0,0,0.06)] /* Clean, soft shadow */
//               flex flex-col
//               gap-6 md:gap-8 /* Reduced gap between top and graph */
//               transition-all duration-300
//               hover:shadow-[0_16px_50px_rgba(0,0,0,0.08)]
//             ">
              
//               {/* Header - Window Controls + Badge */}
//               <div className="flex items-center justify-between">
//                 <WindowControls />
//                 <div className="bg-[#F4F7FF] text-[#053BD8] text-[11px] md:text-sm font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-[#E5EDFF] transition-transform duration-300 hover:scale-105">
//                   LuxeTile Dashboard v2.4
//                 </div>
//               </div>

//               {/* Stats Cards - Two Column Grid */}
//               <div className="grid grid-cols-2 gap-4 md:gap-8 mt-2">
//                 <StatCard
//                   label="TOTAL SCANS"
//                   value="12,482"
//                   subtitle="+18% this month"
//                   subtitleColor="text-[#059669]"
//                 />
//                 <StatCard
//                   label="AVG. VIZ TIME"
//                   value="4m 12s"
//                   subtitle="High Engagement"
//                   subtitleColor="text-[#053BD8]"
//                 />
//               </div>

//               {/* Chart Container (Increased Height) */}
//               <div className="
//                 w-full
//                 h-[200px] md:h-[260px] lg:h-[290px] /* Increased overall height */
//                 bg-[#F4F6FB] /* Light blue tinted background matching design */
//                 rounded-xl md:rounded-2xl
//                 p-4 md:p-6 lg:p-8
//                 flex items-end justify-between
//                 border border-[#E5E7EB]/60
//                 gap-2 md:gap-4
//                 transition-all duration-300
//                 hover:border-[#D1D5DB]
//               ">
//                 {chartData.map((bar, index) => (
//                   <ChartBar
//                     key={index}
//                     height={bar.height}
//                     variant={bar.variant}
//                     index={index}
//                   />
//                 ))}
//               </div>

//             </div>

//           </div>

//         </div>

//       </section>
//     </>
//   );
// };

// export default Statistics; 
import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

// ============================================================================
// STATISTICS SECTION - PRODUCTION READY
// ✅ Aligned with App.tsx: max-w-[1800px] + px-3 md:px-5
// Component Name: Statistics
// ============================================================================

// ============================================================================
// INTERFACES
// ============================================================================

interface FeatureItem {
  text: string;
}

interface StatCard {
  label: string;
  value: string;
  subtitle: string;
  subtitleColor: string;
}

interface ChartBar {
  height: string;
  variant: 'primary' | 'secondary';
}

interface StatisticsProps {
  heading?: string;
  description?: string;
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
  stats?: StatCard[];
  chartBars?: ChartBar[];
}

// ============================================================================
// FEATURE LIST ITEM COMPONENT
// ============================================================================

const FeatureListItem: React.FC<{ text: string }> = React.memo(({ text }) => (
  <li className="flex items-center gap-3.5 group">
    <div className="
      w-5 h-5 
      rounded-full 
      bg-[#e8edfb] 
      flex items-center justify-center 
      shrink-0
      transition-all duration-300
      group-hover:bg-[#d6e0f9]
      group-hover:scale-110
    ">
      <Check className="w-3.5 h-3.5 text-[#183cbd] stroke-[3]" />
    </div>
    <span className="text-[15.5px] font-semibold text-[#111827]">
      {text}
    </span>
  </li>
));
FeatureListItem.displayName = 'FeatureListItem';

// ============================================================================
// MAIN STATISTICS COMPONENT
// ============================================================================

export const Statistics: React.FC<StatisticsProps> = ({
  heading = "Data-Driven Showroom Insights",
  description = "Stop guessing what sells. Track which tiles are being scanned, visualized, and purchased in real-time across all your locations.",
  features = [
    "Heatmap of popular tile scans",
    "Conversion rate from 3D preview",
    "Automated stock reordering"
  ],
  ctaText = "Explore Analytics Platform",
  ctaLink = "#analytics",
  stats = [
    {
      label: "TOTAL SCANS",
      value: "12,482",
      subtitle: "+18% this month",
      subtitleColor: "text-[#10b981]"
    },
    {
      label: "AVG. VIZ TIME",
      value: "4m 12s",
      subtitle: "High Engagement",
      subtitleColor: "text-[#2563eb]"
    }
  ],
  chartBars = [
    { height: '30%', variant: 'primary' as const },
    { height: '55%', variant: 'secondary' as const },
    { height: '85%', variant: 'primary' as const },
    { height: '45%', variant: 'secondary' as const },
    { height: '65%', variant: 'primary' as const },
    { height: '40%', variant: 'secondary' as const },
    { height: '78%', variant: 'primary' as const }
  ]
}) => {
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

      <section 
        className="w-full bg-[#f9f9fb] font-['Inter',_sans-serif] antialiased"
        aria-labelledby="statistics-heading"
      >
        {/* ✅ MAIN CONTAINER - ALIGNED WITH APP.TSX */}
        <div className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-20 lg:py-28">
          
          {/* ✅ TWO COLUMN GRID */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 md:gap-12 lg:gap-16 xl:gap-20 items-center">

            {/* ═══════════════════════════════════════════════════════════
                LEFT COLUMN - CONTENT
            ═══════════════════════════════════════════════════════════ */}
            <div className="flex flex-col gap-6 lg:gap-7">
              
              {/* Heading */}
              <h2 
                id="statistics-heading"
                className="
                  text-[36px] sm:text-[42px] md:text-[48px] lg:text-[52px]
                  leading-[1.15] 
                  font-bold 
                  text-[#111827] 
                  tracking-[-0.02em]
                "
              >
                {heading.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < heading.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>

              {/* Description */}
              <p className="text-[16px] md:text-[17px] lg:text-[18px] leading-[1.6] text-[#4b5563] mb-1">
                {description}
              </p>

              {/* Features List */}
              <ul className="flex flex-col gap-4" role="list">
                {features.map((text, i) => (
                  <FeatureListItem key={i} text={text} />
                ))}
              </ul>

              {/* CTA Link */}
              <div className="mt-3">
                <a 
                  href={ctaLink}
                  className="
                    inline-flex items-center 
                    text-[15.5px] 
                    font-bold 
                    text-[#0c2e9b] 
                    hover:text-blue-800 
                    transition-colors 
                    duration-200
                    group
                  "
                >
                  {ctaText}
                  <ChevronRight className="w-[18px] h-[18px] ml-1.5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                RIGHT COLUMN - DASHBOARD MOCKUP
            ═══════════════════════════════════════════════════════════ */}
            <div className="relative w-full">
              <div className="
                bg-white 
                rounded-[24px] md:rounded-[28px]
                p-6 md:p-8
                shadow-[0_24px_80px_rgba(0,0,0,0.05)] 
                border border-[#f5f6f9]
                transition-all duration-300
                hover:shadow-[0_30px_90px_rgba(0,0,0,0.08)]
              ">

                {/* Header - Window Controls + Badge */}
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  {/* Mac Window Controls */}
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] transition-transform duration-300 hover:scale-110"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] transition-transform duration-300 hover:scale-110"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] transition-transform duration-300 hover:scale-110"></div>
                  </div>
                  
                  {/* Version Badge */}
                  <div className="
                    bg-[#eff3fc] 
                    text-[#1a3da9] 
                    text-[11px] 
                    font-bold 
                    px-3.5 py-1.5 
                    rounded-full 
                    tracking-wide
                    transition-transform duration-300
                    hover:scale-105
                  ">
                    LuxeTile Dashboard v2.4
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mb-5 md:mb-6">
                  {stats.map((stat, index) => (
                    <div 
                      key={index}
                      className="
                        rounded-[18px] md:rounded-[20px]
                        p-5 md:p-6
                        border border-[#f0f2f8]
                        transition-all duration-300
                        hover:border-[#e0e4f0]
                        hover:shadow-sm
                        hover:-translate-y-0.5
                      "
                    >
                      <div className="text-[11px] font-bold text-[#6b7280] tracking-wider mb-2">
                        {stat.label}
                      </div>
                      <div className="text-[30px] md:text-[34px] font-bold text-[#111827] leading-none mb-2.5 tracking-tight">
                        {stat.value}
                      </div>
                      <div className={`text-[12px] font-semibold ${stat.subtitleColor}`}>
                        {stat.subtitle}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="
                  bg-[#f4f6fc] 
                  rounded-[18px] md:rounded-[20px]
                  border border-[#e8ecf6] 
                  p-5 md:p-6
                  h-[180px] sm:h-[200px] md:h-[210px]
                  flex items-end justify-between 
                  px-6 md:px-8
                  gap-2
                  transition-all duration-300
                  hover:border-[#d8dff0]
                ">
                  {/* Chart Bars */}
                  {chartBars.map((bar, index) => (
                    <div
                      key={index}
                      className={`
                        w-[18px] sm:w-[20px] md:w-[22px]
                        rounded-t-md
                        transition-all duration-300
                        hover:opacity-80
                        ${bar.variant === 'primary' ? 'bg-[#0c3feb]' : 'bg-[#678cf0]'}
                      `}
                      style={{ 
                        height: bar.height,
                        animation: `slideUp 0.6s ease-out ${index * 0.08}s forwards`,
                        opacity: 0,
                        transformOrigin: 'bottom'
                      }}
                    />
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

// ============================================================================
// NAMED EXPORTS
// ============================================================================

export default Statistics;