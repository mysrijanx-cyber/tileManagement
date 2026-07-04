
// // import React from 'react';
// // import { Check, ChevronRight } from 'lucide-react';

// // // ============================================================================
// // // TYPE DEFINITIONS
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

// // interface ChartBarProps {
// //   height: string;
// //   variant: 'primary' | 'secondary';
// //   delay: number;
// // }

// // // ============================================================================
// // // REUSABLE COMPONENTS
// // // ============================================================================

// // const FeatureItem: React.FC<FeatureItemProps> = React.memo(({ text }) => (
// //   <li className="flex items-center gap-5">
// //     <div 
// //       className="w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-[#E5EDFF] flex items-center justify-center shrink-0"
// //       aria-hidden="true"
// //     >
// //       <Check className="w-5 h-5 xl:w-6 xl:h-6 text-[#053BD8] stroke-[3]" />
// //     </div>
// //     <span className="text-[18px] lg:text-[20px] xl:text-[22px] font-semibold text-[#111827]">
// //       {text}
// //     </span>
// //   </li>
// // ));
// // FeatureItem.displayName = 'FeatureItem';

// // const StatCard: React.FC<StatCardProps> = React.memo(({ label, value, subtitle, subtitleColor }) => (
// //   <div className="flex flex-col">
// //     <h3 className="text-[14px] xl:text-[16px] font-bold text-[#6B7280] tracking-widest mb-3 uppercase">
// //       {label}
// //     </h3>
// //     <div className="text-[48px] lg:text-[56px] xl:text-[64px] font-extrabold text-[#111827] leading-none mb-3 tracking-tight">
// //       {value}
// //     </div>
// //     <div className={`text-[16px] xl:text-[18px] font-bold ${subtitleColor}`}>
// //       {subtitle}
// //     </div>
// //   </div>
// // ));
// // StatCard.displayName = 'StatCard';

// // const ChartBar: React.FC<ChartBarProps> = React.memo(({ height, variant, delay }) => {
// //   const bgColor = variant === 'primary' ? 'bg-[#053BD8]' : 'bg-[#5B85F9]';
// //   return (
// //     <div
// //       className={`w-[32px] md:w-[40px] lg:w-[48px] xl:w-[56px] rounded-t-xl ${bgColor} transform origin-bottom transition-all duration-700 hover:opacity-80`}
// //       style={{ 
// //         height,
// //         animation: `slideUp 0.8s ease-out ${delay}s forwards`,
// //         opacity: 0,
// //         transform: 'scaleY(0)'
// //       }}
// //       role="presentation"
// //     />
// //   );
// // });
// // ChartBar.displayName = 'ChartBar';

// // const WindowControls: React.FC = React.memo(() => (
// //   <div className="flex gap-2.5 xl:gap-3" aria-hidden="true">
// //     <div className="w-4 h-4 xl:w-5 xl:h-5 rounded-full bg-[#FF5F56]" />
// //     <div className="w-4 h-4 xl:w-5 xl:h-5 rounded-full bg-[#FFBD2E]" />
// //     <div className="w-4 h-4 xl:w-5 xl:h-5 rounded-full bg-[#27C93F]" />
// //   </div>
// // ));
// // WindowControls.displayName = 'WindowControls';

// // // ============================================================================
// // // MAIN LAYOUT SECTIONS
// // // ============================================================================

// // const ContentSection: React.FC = React.memo(() => {
// //   const features = [
// //     'Heatmap of popular tile scans',
// //     'Conversion rate from 3D preview',
// //     'Automated stock reordering',
// //   ];

// //   return (
// //     <section className="w-full lg:w-[45%] flex flex-col justify-center">
// //       <h1 className="text-5xl md:text-6xl lg:text-[64px] xl:text-[72px] font-bold text-[#111827] leading-[1.1] mb-8 tracking-tight">
// //         Data-Driven<br />Showroom Insights
// //       </h1>
      
// //       <p className="text-[18px] lg:text-[20px] xl:text-[24px] text-[#4B5563] leading-relaxed mb-12 max-w-[600px]">
// //         Stop guessing what sells. Track which tiles are being
// //         scanned, visualized, and purchased in real-time across
// //         all your locations.
// //       </p>

// //       <ul className="space-y-6 mb-14">
// //         {features.map((text, index) => (
// //           <FeatureItem key={index} text={text} />
// //         ))}
// //       </ul>

// //       <div>
// //         <a
// //           href="#analytics"
// //           className="inline-flex items-center gap-3 text-[18px] xl:text-[22px] font-bold text-[#053BD8] hover:gap-4 transition-all duration-300"
// //           aria-label="Explore Analytics Platform"
// //         >
// //           Explore Analytics Platform
// //           <ChevronRight className="w-6 h-6 xl:w-7 xl:h-7 stroke-[3]" aria-hidden="true" />
// //         </a>
// //       </div>
// //     </section>
// //   );
// // });
// // ContentSection.displayName = 'ContentSection';

// // const DashboardCard: React.FC = React.memo(() => {
// //   const chartBars: Omit<ChartBarProps, 'delay'>[] = [
// //     { height: '40%', variant: 'primary' },
// //     { height: '60%', variant: 'secondary' },
// //     { height: '100%', variant: 'primary' },
// //     { height: '50%', variant: 'secondary' },
// //     { height: '80%', variant: 'primary' },
// //     { height: '45%', variant: 'secondary' },
// //     { height: '90%', variant: 'primary' },
// //   ];

// //   return (
// //     <article className="w-full lg:w-[55%] bg-white rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.08)] p-10 lg:p-14 xl:p-16 border border-gray-50">
      
// //       {/* Header */}
// //       <header className="flex items-center justify-between mb-14 xl:mb-20">
// //         <WindowControls />
// //         <div className="bg-[#F4F7FF] text-[#053BD8] text-[14px] xl:text-[16px] font-bold px-6 py-2 xl:py-2.5 rounded-full">
// //           LuxeTile Dashboard v2.4
// //         </div>
// //       </header>

// //       {/* Stats */}
// //       <div className="grid grid-cols-2 gap-12 xl:gap-16 mb-14 xl:mb-20">
// //         <StatCard
// //           label="TOTAL SCANS"
// //           value="12,482"
// //           subtitle="+18% this month"
// //           subtitleColor="text-[#059669]"
// //         />
// //         <StatCard
// //           label="AVG. VIZ TIME"
// //           value="4m 12s"
// //           subtitle="High Engagement"
// //           subtitleColor="text-[#053BD8]"
// //         />
// //       </div>

// //       {/* Chart */}
// //       <div className="h-[300px] lg:h-[340px] xl:h-[400px] bg-[#F4F7FF] rounded-3xl p-8 xl:p-10 flex items-end justify-between gap-4 xl:gap-6 border border-[#E5EDFF]">
// //         {chartBars.map((bar, index) => (
// //           <ChartBar
// //             key={index}
// //             height={bar.height}
// //             variant={bar.variant}
// //             delay={index * 0.1}
// //           />
// //         ))}
// //       </div>
      
// //     </article>
// //   );
// // });
// // DashboardCard.displayName = 'DashboardCard';

// // // ============================================================================
// // // MAIN COMPONENT (FIXED EXPORT)
// // // ============================================================================

// // export const Statistics: React.FC = () => {
// //   return (
// //     <>
// //       <style dangerouslySetInnerHTML={{__html: `
// //         @keyframes slideUp {
// //           to {
// //             opacity: 1;
// //             transform: scaleY(1);
// //           }
// //         }
// //       `}} />
// //       {/* Changed bg to exactly match reference and added massive padding */}
// //       <main className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-8 md:p-16 lg:p-24 xl:p-32 antialiased">
// //         {/* Increased max-width to 1440px for huge screens */}
// //         <div className="max-w-[1440px] w-full flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 xl:gap-32">
// //           <ContentSection />
// //           <DashboardCard />
// //         </div>
// //       </main>
// //     </>
// //   );
// // };

// // export default Statistics; 
// import React from 'react';
// import { Check, ChevronRight } from 'lucide-react';

// // ============================================================================
// // TYPE DEFINITIONS
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

// interface ChartBarProps {
//   height: string;
//   variant: 'primary' | 'secondary';
//   delay: number;
// }

// // ============================================================================
// // REUSABLE COMPONENTS
// // ============================================================================

// const FeatureItem: React.FC<FeatureItemProps> = React.memo(({ text }) => (
//   <li className="flex items-center gap-5 xl:gap-6">
//     <div 
//       className="w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-[#E5EDFF] flex items-center justify-center shrink-0"
//       aria-hidden="true"
//     >
//       <Check className="w-5 h-5 xl:w-6 xl:h-6 text-[#053BD8] stroke-[3.5]" />
//     </div>
//     <span className="text-[20px] xl:text-[24px] font-semibold text-[#111827]">
//       {text}
//     </span>
//   </li>
// ));
// FeatureItem.displayName = 'FeatureItem';

// const StatCard: React.FC<StatCardProps> = React.memo(({ label, value, subtitle, subtitleColor }) => (
//   <div className="flex flex-col">
//     <h3 className="text-[15px] xl:text-[17px] font-bold text-[#6B7280] tracking-widest mb-2 xl:mb-3 uppercase">
//       {label}
//     </h3>
//     <div className="text-[48px] xl:text-[64px] font-extrabold text-[#111827] leading-none mb-3 xl:mb-4 tracking-tight">
//       {value}
//     </div>
//     <div className={`text-[16px] xl:text-[19px] font-bold ${subtitleColor}`}>
//       {subtitle}
//     </div>
//   </div>
// ));
// StatCard.displayName = 'StatCard';

// const ChartBar: React.FC<ChartBarProps> = React.memo(({ height, variant, delay }) => {
//   const bgColor = variant === 'primary' ? 'bg-[#053BD8]' : 'bg-[#5B85F9]';
//   return (
//     <div
//       className={`w-[36px] md:w-[48px] xl:w-[64px] rounded-t-xl xl:rounded-t-2xl ${bgColor} transform origin-bottom transition-all duration-700 hover:opacity-80 cursor-pointer`}
//       style={{ 
//         height,
//         animation: `slideUp 0.8s ease-out ${delay}s forwards`,
//         opacity: 0,
//         transform: 'scaleY(0)'
//       }}
//       role="presentation"
//     />
//   );
// });
// ChartBar.displayName = 'ChartBar';

// const WindowControls: React.FC = React.memo(() => (
//   <div className="flex gap-2.5 xl:gap-3" aria-hidden="true">
//     <div className="w-4 h-4 xl:w-5 xl:h-5 rounded-full bg-[#FF5F56]" />
//     <div className="w-4 h-4 xl:w-5 xl:h-5 rounded-full bg-[#FFBD2E]" />
//     <div className="w-4 h-4 xl:w-5 xl:h-5 rounded-full bg-[#27C93F]" />
//   </div>
// ));
// WindowControls.displayName = 'WindowControls';

// // ============================================================================
// // MAIN LAYOUT SECTIONS
// // ============================================================================

// const ContentSection: React.FC = React.memo(() => {
//   const features = [
//     'Heatmap of popular tile scans',
//     'Conversion rate from 3D preview',
//     'Automated stock reordering',
//   ];

//   return (
//     <section className="w-full lg:w-[45%] flex flex-col justify-center">
//       {/* Massive Heading */}
//       <h1 className="text-5xl md:text-6xl lg:text-[72px] xl:text-[80px] font-bold text-[#111827] leading-[1.05] mb-8 xl:mb-10 tracking-tight">
//         Data-Driven<br />Showroom Insights
//       </h1>
      
//       {/* Scaled-up Paragraph */}
//       <p className="text-[20px] lg:text-[22px] xl:text-[26px] text-[#4B5563] leading-relaxed mb-12 xl:mb-14 max-w-[650px]">
//         Stop guessing what sells. Track which tiles are being
//         scanned, visualized, and purchased in real-time across
//         all your locations.
//       </p>

//       {/* Bigger List Items */}
//       <ul className="space-y-6 xl:space-y-8 mb-14 xl:mb-16">
//         {features.map((text, index) => (
//           <FeatureItem key={index} text={text} />
//         ))}
//       </ul>

//       <div>
//         <a
//           href="#analytics"
//           className="inline-flex items-center gap-3 xl:gap-4 text-[20px] xl:text-[24px] font-bold text-[#053BD8] hover:gap-5 transition-all duration-300"
//           aria-label="Explore Analytics Platform"
//         >
//           Explore Analytics Platform
//           <ChevronRight className="w-6 h-6 xl:w-8 xl:h-8 stroke-[3]" aria-hidden="true" />
//         </a>
//       </div>
//     </section>
//   );
// });
// ContentSection.displayName = 'ContentSection';

// const DashboardCard: React.FC = React.memo(() => {
//   const chartBars: Omit<ChartBarProps, 'delay'>[] = [
//     { height: '35%', variant: 'primary' },
//     { height: '55%', variant: 'secondary' },
//     { height: '90%', variant: 'primary' },
//     { height: '45%', variant: 'secondary' },
//     { height: '75%', variant: 'primary' },
//     { height: '40%', variant: 'secondary' },
//     { height: '85%', variant: 'primary' },
//   ];

//   return (
//     <article className="w-full lg:w-[55%] bg-white rounded-[32px] xl:rounded-[48px] shadow-[0_24px_60px_rgba(0,0,0,0.06)] p-8 md:p-12 xl:p-16 border border-gray-100 flex flex-col">
      
//       {/* Header */}
//       <header className="flex items-center justify-between mb-10 xl:mb-14">
//         <WindowControls />
//         <div className="bg-[#F4F7FF] text-[#053BD8] text-[14px] xl:text-[17px] font-bold px-5 py-2 xl:px-6 xl:py-2.5 rounded-full">
//           LuxeTile Dashboard v2.4
//         </div>
//       </header>

//       {/* Stats - Horizontal layout for landscape view */}
//       <div className="flex flex-col sm:flex-row justify-between w-full mb-10 xl:mb-16 sm:pr-8 xl:pr-16 gap-8">
//         <StatCard
//           label="TOTAL SCANS"
//           value="12,482"
//           subtitle="+18% this month"
//           subtitleColor="text-[#059669]"
//         />
//         <StatCard
//           label="AVG. VIZ TIME"
//           value="4m 12s"
//           subtitle="High Engagement"
//           subtitleColor="text-[#053BD8]"
//         />
//       </div>

//       {/* Chart - Wide and proportionately short */}
//       <div className="h-[200px] xl:h-[260px] w-full bg-[#F4F7FF] rounded-[20px] xl:rounded-[28px] p-6 xl:p-10 flex items-end justify-between border border-[#E5EDFF]">
//         {chartBars.map((bar, index) => (
//           <ChartBar
//             key={index}
//             height={bar.height}
//             variant={bar.variant}
//             delay={index * 0.1}
//           />
//         ))}
//       </div>
      
//     </article>
//   );
// });
// DashboardCard.displayName = 'DashboardCard';

// // ============================================================================
// // MAIN COMPONENT (WIDTH SYNCHRONIZED WITH BANNER)
// // ============================================================================

// export const Statistics: React.FC = () => {
//   return (
//     <>
//       <style dangerouslySetInnerHTML={{__html: `
//         @keyframes slideUp {
//           to {
//             opacity: 1;
//             transform: scaleY(1);
//           }
//         }
//       `}} />
      
//       {/* 
//         Container matching the Banner logic: 
//         1. Outer wrapper has the EXACT same `px-3 md:px-5` as Banner.
//         2. Inner wrapper is `max-w-[1920px]` to push edges out.
//       */}
//       <main className="w-full bg-[#F8FAFC] flex flex-col items-center justify-center pt-24 pb-16 px-3 md:pt-36 md:pb-24 md:px-5 font-['Inter',_sans-serif] antialiased">
//         <div className="w-full max-w-[1920px] flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20 xl:gap-32">
//           <ContentSection />
//           <DashboardCard />
//         </div>
//       </main>
//     </>
//   );
// };

// export default Statistics; 
import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
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

interface ChartBarProps {
  height: string;
  variant: 'primary' | 'secondary';
  delay: number;
}

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const FeatureItem: React.FC<FeatureItemProps> = React.memo(({ text }) => (
  <li className="flex items-center gap-5 xl:gap-6">
    <div 
      className="w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-[#E5EDFF] flex items-center justify-center shrink-0"
      aria-hidden="true"
    >
      <Check className="w-5 h-5 xl:w-6 xl:h-6 text-[#053BD8] stroke-[3.5]" />
    </div>
    <span className="text-[20px] xl:text-[24px] font-semibold text-[#111827]">
      {text}
    </span>
  </li>
));
FeatureItem.displayName = 'FeatureItem';

const StatCard: React.FC<StatCardProps> = React.memo(({ label, value, subtitle, subtitleColor }) => (
  <div className="flex flex-col">
    <h3 className="text-[15px] xl:text-[17px] font-bold text-[#6B7280] tracking-widest mb-2 xl:mb-3 uppercase">
      {label}
    </h3>
    <div className="text-[48px] xl:text-[64px] font-extrabold text-[#111827] leading-none mb-3 xl:mb-4 tracking-tight">
      {value}
    </div>
    <div className={`text-[16px] xl:text-[19px] font-bold ${subtitleColor}`}>
      {subtitle}
    </div>
  </div>
));
StatCard.displayName = 'StatCard';

const ChartBar: React.FC<ChartBarProps> = React.memo(({ height, variant, delay }) => {
  const bgColor = variant === 'primary' ? 'bg-[#053BD8]' : 'bg-[#5B85F9]';
  return (
    <div
      className={`w-[36px] md:w-[48px] xl:w-[64px] rounded-t-xl xl:rounded-t-2xl ${bgColor} transform origin-bottom transition-all duration-700 hover:opacity-80 cursor-pointer`}
      style={{ 
        height,
        animation: `slideUp 0.8s ease-out ${delay}s forwards`,
        opacity: 0,
        transform: 'scaleY(0)'
      }}
      role="presentation"
    />
  );
});
ChartBar.displayName = 'ChartBar';

const WindowControls: React.FC = React.memo(() => (
  <div className="flex gap-2.5 xl:gap-3" aria-hidden="true">
    <div className="w-4 h-4 xl:w-5 xl:h-5 rounded-full bg-[#FF5F56]" />
    <div className="w-4 h-4 xl:w-5 xl:h-5 rounded-full bg-[#FFBD2E]" />
    <div className="w-4 h-4 xl:w-5 xl:h-5 rounded-full bg-[#27C93F]" />
  </div>
));
WindowControls.displayName = 'WindowControls';

// ============================================================================
// MAIN LAYOUT SECTIONS
// ============================================================================

const ContentSection: React.FC = React.memo(() => {
  const features = [
    'Heatmap of popular tile scans',
    'Conversion rate from 3D preview',
    'Automated stock reordering',
  ];

  return (
    <section className="w-full lg:w-[45%] flex flex-col justify-center">
      <h1 className="text-5xl md:text-6xl lg:text-[72px] xl:text-[80px] font-bold text-[#111827] leading-[1.05] mb-8 xl:mb-10 tracking-tight">
        Data-Driven<br />Showroom Insights
      </h1>
      
      <p className="text-[20px] lg:text-[22px] xl:text-[26px] text-[#4B5563] leading-relaxed mb-12 xl:mb-14 max-w-[650px]">
        Stop guessing what sells. Track which tiles are being
        scanned, visualized, and purchased in real-time across
        all your locations.
      </p>

      <ul className="space-y-6 xl:space-y-8 mb-14 xl:mb-16">
        {features.map((text, index) => (
          <FeatureItem key={index} text={text} />
        ))}
      </ul>

      <div>
        <a
          href="#analytics"
          className="inline-flex items-center gap-3 xl:gap-4 text-[20px] xl:text-[24px] font-bold text-[#053BD8] hover:gap-5 transition-all duration-300"
          aria-label="Explore Analytics Platform"
        >
          Explore Analytics Platform
          <ChevronRight className="w-6 h-6 xl:w-8 xl:h-8 stroke-[3]" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
});
ContentSection.displayName = 'ContentSection';

const DashboardCard: React.FC = React.memo(() => {
  const chartBars: Omit<ChartBarProps, 'delay'>[] = [
    { height: '35%', variant: 'primary' },
    { height: '55%', variant: 'secondary' },
    { height: '90%', variant: 'primary' },
    { height: '45%', variant: 'secondary' },
    { height: '75%', variant: 'primary' },
    { height: '40%', variant: 'secondary' },
    { height: '85%', variant: 'primary' },
  ];

  return (
    <article className="w-full lg:w-[55%] bg-white rounded-[32px] xl:rounded-[48px] shadow-[0_24px_60px_rgba(0,0,0,0.06)] p-8 md:p-12 xl:p-16 border border-gray-100 flex flex-col">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-10 xl:mb-14">
        <WindowControls />
        <div className="bg-[#F4F7FF] text-[#053BD8] text-[14px] xl:text-[17px] font-bold px-5 py-2 xl:px-6 xl:py-2.5 rounded-full">
          LuxeTile Dashboard v2.4
        </div>
      </header>

      {/* Stats - Horizontal layout for landscape view */}
      <div className="flex flex-col sm:flex-row justify-between w-full mb-10 xl:mb-16 sm:pr-8 xl:pr-16 gap-8">
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

      {/* Chart - Wide and proportionately short */}
      <div className="h-[200px] xl:h-[260px] w-full bg-[#F4F7FF] rounded-[20px] xl:rounded-[28px] p-6 xl:p-10 flex items-end justify-between border border-[#E5EDFF]">
        {chartBars.map((bar, index) => (
          <ChartBar
            key={index}
            height={bar.height}
            variant={bar.variant}
            delay={index * 0.1}
          />
        ))}
      </div>
      
    </article>
  );
});
DashboardCard.displayName = 'DashboardCard';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const Statistics: React.FC = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }
      `}} />
      
      {/* Yahan par main container ki class bg-white kar di gayi hai */}
      <main className="w-full bg-white flex flex-col items-center justify-center pt-24 pb-16 px-3 md:pt-36 md:pb-24 md:px-5 font-['Inter',_sans-serif] antialiased">
        <div className="w-full max-w-[1920px] flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20 xl:gap-32">
          <ContentSection />
          <DashboardCard />
        </div>
      </main>
    </>
  );
};

export default Statistics;