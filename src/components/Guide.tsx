
// import React from 'react';

// // ============================================================================
// // INTERFACES
// // ============================================================================

// interface StatCardProps {
//   value: string;
//   label: string;
// }

// interface TestimonialProps {
//   quote: string;
//   name: string;
//   title: string;
//   image: string;
//   rating?: number;
// }

// // ============================================================================
// // STAR ICON COMPONENT (Size Increased)
// // ============================================================================

// const StarIcon: React.FC = () => (
//   <svg 
//     width="22" 
//     height="22" 
//     viewBox="0 0 24 24" 
//     fill="#d8cce8" 
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
//   </svg>
// );

// // ============================================================================
// // STAT CARD COMPONENT (Scaled Up)
// // ============================================================================

// const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
//   return (
//     <div className="bg-[#32343a] rounded-3xl p-8 md:p-10 flex flex-col justify-center shadow-lg border border-[#3b3d44]/30 transition-all duration-300 hover:border-[#3b3d44]/60 hover:shadow-2xl w-full sm:w-[240px] md:w-[260px] min-h-[160px] md:min-h-[180px]">
//       <div className="text-white text-4xl md:text-5xl lg:text-[56px] font-bold mb-2 tracking-tight">
//         {value}
//       </div>
//       <div className="text-[#848795] text-base md:text-lg font-semibold tracking-wide">
//         {label}
//       </div>
//     </div>
//   );
// };

// // ============================================================================
// // TESTIMONIAL SECTION COMPONENT (Scaled Up)
// // ============================================================================

// const TestimonialSection: React.FC<TestimonialProps> = ({ 
//   quote, 
//   name, 
//   title, 
//   image, 
//   rating = 5 
// }) => {
//   return (
//     <div className="flex-1 max-w-full lg:max-w-[700px] w-full">
      
//       {/* Stars Rating */}
//       <div className="flex gap-2 mb-8 md:mb-10">
//         {[...Array(rating)].map((_, i) => (
//           <StarIcon key={i} />
//         ))}
//       </div>

//       {/* Quote */}
//       <h2 className="text-[#f8f9fa] text-3xl md:text-4xl lg:text-[42px] leading-[1.3] md:leading-[1.25] font-bold italic tracking-tight mb-10">
//         {quote}
//       </h2>

//       {/* Profile */}
//       <div className="flex items-center gap-5 md:gap-6">
//         <img 
//           src={image}
//           alt={name}
//           className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-[#3b3d44] transition-all duration-300 hover:border-[#5c5f6b]"
//         />
//         <div className="flex flex-col justify-center">
//           <span className="text-[#f8f9fa] font-bold text-lg md:text-xl lg:text-2xl leading-tight">
//             {name}
//           </span>
//           <span className="text-[#848795] text-sm md:text-base font-bold tracking-wider uppercase mt-1.5">
//             {title}
//           </span>
//         </div>
//       </div>
      
//     </div>
//   );
// };

// // ============================================================================
// // MAIN COMPONENT - PRODUCTION READY
// // ============================================================================

// export const Guide: React.FC = () => {
//   const testimonialData = {
//     quote: '"LuxeTile AI didn\'t just change our showroom; it doubled our conversion rate in 6 months. Our customers no longer hesitate—they visualize and buy."',
//     name: 'Julianne Vance',
//     title: 'Director, Vance Interiors',
//     image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100',
//     rating: 5
//   };

//   const statsData = [
//     { value: '2.4x', label: 'Sales Velocity' },
//     { value: '98%', label: 'Client Satisfaction' }
//   ];

//   return (
//     // py-24 and md:py-36 will create the exact symmetrical large spacing you want top and bottom.
//     <div className="w-full bg-[#24252a] flex items-center justify-center py-24 px-6 md:py-36 md:px-12 font-['Inter',sans-serif]">
      
//       {/* Container width increased to 1400px to accommodate bigger text and cards */}
//       <div className="max-w-[1400px] w-full flex flex-col xl:flex-row items-start xl:items-center justify-between gap-16 xl:gap-20">
        
//         {/* Left Section - Testimonial */}
//         <TestimonialSection
//           quote={testimonialData.quote}
//           name={testimonialData.name}
//           title={testimonialData.title}
//           image={testimonialData.image}
//           rating={testimonialData.rating}
//         />

//         {/* Right Section - Stats Cards */}
//         <div className="flex flex-col sm:flex-row gap-5 w-full xl:w-auto shrink-0">
//           {statsData.map((stat, index) => (
//             <StatCard
//               key={index}
//               value={stat.value}
//               label={stat.label}
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

interface StatCardProps {
  value: string;
  label: string;
}

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  image: string;
  rating?: number;
}

// ============================================================================
// STAR ICON COMPONENT (Responsive sizes added)
// ============================================================================

const StarIcon: React.FC = () => (
  <svg 
    className="w-5 h-5 md:w-6 md:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8"
    viewBox="0 0 24 24" 
    fill="#d8cce8" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

// ============================================================================
// STAT CARD COMPONENT (Scaled Up for 1920px Grid)
// ============================================================================

const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  return (
    <div className="bg-[#32343a] rounded-[24px] xl:rounded-[32px] p-8 md:p-10 xl:p-12 flex flex-col justify-center shadow-lg border border-[#3b3d44]/30 transition-all duration-300 hover:border-[#3b3d44]/60 hover:shadow-2xl w-full sm:w-[240px] md:w-[260px] xl:w-[320px] 2xl:w-[360px] min-h-[160px] md:min-h-[180px] xl:min-h-[220px]">
      <div className="text-white text-[48px] md:text-[56px] xl:text-[72px] 2xl:text-[80px] font-bold mb-2 xl:mb-4 tracking-tight leading-none">
        {value}
      </div>
      <div className="text-[#848795] text-[16px] md:text-[18px] xl:text-[20px] 2xl:text-[22px] font-semibold tracking-wide">
        {label}
      </div>
    </div>
  );
};

// ============================================================================
// TESTIMONIAL SECTION COMPONENT (Scaled Up & Aligned)
// ============================================================================

const TestimonialSection: React.FC<TestimonialProps> = ({ 
  quote, 
  name, 
  title, 
  image, 
  rating = 5 
}) => {
  return (
    <div className="flex-1 max-w-full lg:max-w-[700px] xl:max-w-[1000px] 2xl:max-w-[1100px] w-full">
      
      {/* Stars Rating */}
      <div className="flex gap-2 xl:gap-3 mb-8 xl:mb-12">
        {[...Array(rating)].map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>

      {/* Quote - MASSIVE FONT FOR BIG SCREENS */}
      <h2 className="text-[#f8f9fa] text-[32px] md:text-[42px] lg:text-[48px] xl:text-[56px] 2xl:text-[64px] leading-[1.3] md:leading-[1.25] xl:leading-[1.15] font-bold italic tracking-tight mb-10 xl:mb-14">
        {quote}
      </h2>

      {/* Profile */}
      <div className="flex items-center gap-5 md:gap-6 xl:gap-8">
        <img 
          src={image}
          alt={name}
          className="w-16 h-16 md:w-20 md:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 rounded-full object-cover border-2 border-[#3b3d44] transition-all duration-300 hover:border-[#5c5f6b]"
        />
        <div className="flex flex-col justify-center">
          <span className="text-[#f8f9fa] font-bold text-[20px] md:text-[24px] xl:text-[28px] 2xl:text-[32px] leading-tight">
            {name}
          </span>
          <span className="text-[#848795] text-[14px] md:text-[16px] xl:text-[18px] 2xl:text-[20px] font-bold tracking-wider uppercase mt-1.5 xl:mt-2">
            {title}
          </span>
        </div>
      </div>
      
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT - PRODUCTION READY
// ============================================================================

export const Guide: React.FC = () => {
  const testimonialData = {
    quote: '"LuxeTile AI didn\'t just change our showroom; it doubled our conversion rate in 6 months. Our customers no longer hesitate—they visualize and buy."',
    name: 'Julianne Vance',
    title: 'Director, Vance Interiors',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100',
    rating: 5
  };

  const statsData = [
    { value: '2.4x', label: 'Sales Velocity' },
    { value: '98%', label: 'Client Satisfaction' }
  ];

  return (
    // ✅ YAHAN FIX KIYA HAI: Outer wrapper ab standard Banner logic par hai (px-3 md:px-5)
    <section className="w-full bg-[#24252a] flex items-center justify-center py-24 md:py-32 xl:py-40 px-3 md:px-5 font-['Inter',_sans-serif] antialiased">
      
      {/* ✅ YAHAN FIX KIYA HAI: Inner wrapper exactly 1920px tak stretch karega */}
      <div className="w-full max-w-[1920px] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-16 lg:gap-20 xl:gap-32">
        
        {/* Left Section - Testimonial */}
        <TestimonialSection
          quote={testimonialData.quote}
          name={testimonialData.name}
          title={testimonialData.title}
          image={testimonialData.image}
          rating={testimonialData.rating}
        />

        {/* Right Section - Stats Cards */}
        <div className="flex flex-col sm:flex-row gap-5 xl:gap-8 w-full lg:w-auto shrink-0">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Guide;