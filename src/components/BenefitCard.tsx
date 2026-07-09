import React from 'react';
import { Check } from 'lucide-react';

// ============================================================================
// PRICING SOLUTION COMPONENT - PRODUCTION READY
// ✅ Aligned with App.tsx: max-w-[1800px] + px-3 md:px-5
// ============================================================================

interface BenefitItem {
  text: string;
}

interface CardData {
  title: string;
  subtitle: string;
  benefits: string[];
  highlighted?: boolean;
}

interface PricingSolutionProps {
  heading?: string;
  subheading?: string;
  customerCard?: CardData;
  ownerCard?: CardData;
}

// ============================================================================
// BENEFIT ITEM COMPONENT
// ============================================================================

const BenefitItem: React.FC<{ text: string }> = React.memo(({ text }) => (
  <li className="flex items-start gap-4 group">
    <div className="
      w-6 h-6 mt-0.5
      rounded-full 
      bg-[#eff6ff] 
      flex items-center justify-center 
      shrink-0
      transition-all duration-300
      group-hover:bg-[#dbeafe]
      group-hover:scale-110
    ">
      <Check className="w-3.5 h-3.5 text-[#2563eb]" strokeWidth={3} />
    </div>
    <span className="text-base md:text-[17px] lg:text-[18px] text-[#374151] font-medium leading-relaxed">
      {text}
    </span>
  </li>
));
BenefitItem.displayName = 'BenefitItem';

// ============================================================================
// BENEFIT CARD COMPONENT
// ============================================================================

interface BenefitCardProps {
  title: string;
  subtitle: string;
  benefits: string[];
  highlighted?: boolean;
}

const BenefitCard: React.FC<BenefitCardProps> = React.memo(({ 
  title, 
  subtitle, 
  benefits, 
  highlighted = false 
}) => (
  <div className={`
    flex-1 
    bg-white 
    rounded-[32px] md:rounded-[40px] lg:rounded-[48px]
    p-8 md:p-10 lg:p-12
    transition-all duration-300
    ${highlighted 
      ? 'border-2 border-[#d6e0f0] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1' 
      : 'border border-[#e5e7eb] hover:border-[#d6e0f0] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] hover:-translate-y-0.5'
    }
  `}>
    
    {/* Card Header */}
    <div className="mb-8 md:mb-9 lg:mb-10">
      <h2 className="text-[26px] md:text-[28px] lg:text-[32px] font-semibold text-[#111827] mb-2 leading-tight">
        {title}
      </h2>
      <p className="text-xs md:text-[13px] font-bold tracking-[0.08em] text-[#2563eb] uppercase">
        {subtitle}
      </p>
    </div>
    
    {/* Benefits List */}
    <ul className="space-y-5 md:space-y-6" role="list">
      {benefits.map((item, idx) => (
        <BenefitItem key={idx} text={item} />
      ))}
    </ul>
  </div>
));
BenefitCard.displayName = 'BenefitCard';

// ============================================================================
// MAIN PRICING SOLUTION COMPONENT
// ============================================================================

export const PricingSolution: React.FC<PricingSolutionProps> = ({
  heading = "Built for Everyone",
  subheading = "Measurable value for customers and showroom owners alike.",
  customerCard = {
    title: "For Customers",
    subtitle: "Empowered Buyers",
    benefits: [
      "No confusion before buying tiles",
      "See actual room look & feel",
      "Better design decisions",
      "Faster purchase confidence",
      "Compare multiple tiles side by side",
      "Share design with family"
    ]
  },
  ownerCard = {
    title: "For Showroom Owners",
    subtitle: "Grow your business",
    benefits: [
      "Increase tile sales significantly",
      "Reduce sample damage & wastage",
      "Manage stock digitally",
      "Track trending tiles in real time",
      "Capture customer leads automatically",
      "Reduce manpower effort"
    ],
    highlighted: true
  }
}) => {
  return (
    <section 
      className="w-full bg-[#f7f8fa] font-['Inter',_sans-serif] antialiased"
      aria-labelledby="pricing-solution-heading"
    >
      {/* ✅ MAIN CONTAINER - ALIGNED WITH APP.TSX */}
      {/* Previous: max-w-[1120px] px-4 md:px-8 */}
      {/* New: max-w-[1800px] px-3 md:px-5 */}
      <div className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-20 lg:py-28">
        
        {/* ═══════════════════════════════════════════════════════════
            HEADER SECTION
        ═══════════════════════════════════════════════════════════ */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20 max-w-3xl mx-auto">
          <h1 
            id="pricing-solution-heading"
            className="text-[36px] sm:text-[40px] md:text-[44px] lg:text-[48px] font-bold text-[#111827] tracking-tight mb-3 md:mb-4"
          >
            {heading}
          </h1>
          <p className="text-base md:text-[18px] lg:text-[20px] text-[#4b5563] leading-relaxed px-4">
            {subheading}
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            CARDS CONTAINER
        ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 w-full">
          
          {/* Left Card - Customers */}
          <BenefitCard
            title={customerCard.title}
            subtitle={customerCard.subtitle}
            benefits={customerCard.benefits}
            highlighted={false}
          />

          {/* Right Card - Showroom Owners */}
          <BenefitCard
            title={ownerCard.title}
            subtitle={ownerCard.subtitle}
            benefits={ownerCard.benefits}
            highlighted={ownerCard.highlighted}
          />

        </div>
      </div>
    </section>
  );
};

// ============================================================================
// NAMED EXPORTS FOR FLEXIBILITY
// ============================================================================

export const Guide = PricingSolution;

export default PricingSolution;