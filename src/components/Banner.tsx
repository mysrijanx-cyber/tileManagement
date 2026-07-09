
// // import React from 'react';

// // // ============================================================================
// // // INTERFACES
// // // ============================================================================

// // interface ButtonProps {
// //   children: React.ReactNode;
// //   variant?: 'primary' | 'secondary';
// //   onClick?: () => void;
// // }

// // interface BannerProps {
// //   heading?: string;
// //   subheading?: string;
// //   primaryButtonText?: string;
// //   secondaryButtonText?: string;
// //   onPrimaryClick?: () => void;
// //   onSecondaryClick?: () => void;
// // }

// // // ============================================================================
// // // BUTTON COMPONENT
// // // ============================================================================

// // const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick }) => {
// //   const baseStyles = "w-full sm:w-auto px-8 py-4 md:px-12 md:py-[18px] rounded-full font-bold text-[17px] md:text-[18px] transition-all duration-300";
  
// //   const variantStyles = {
// //     primary: "bg-white text-[#1A45ED] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-[2px] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.2)]",
// //     secondary: "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-md"
// //   };

// //   return (
// //     <button 
// //       onClick={onClick}
// //       className={`${baseStyles} ${variantStyles[variant]}`}
// //     >
// //       {children}
// //     </button>
// //   );
// // };

// // // ============================================================================
// // // MAIN COMPONENT - PRODUCTION READY
// // // ============================================================================

// // export const Banner: React.FC<BannerProps> = ({
// //   heading = "Ready to build the future\nof your showroom?",
// //   subheading = "Join 200+ luxury retailers using LuxeTile AI to revolutionize the physical shopping experience.",
// //   primaryButtonText = "Book Your Demo",
// //   secondaryButtonText = "View All Features",
// //   onPrimaryClick,
// //   onSecondaryClick
// // }) => {
  
// //   const handlePrimaryClick = () => {
// //     if (onPrimaryClick) onPrimaryClick();
// //     else console.log('Primary button clicked: Book Your Demo');
// //   };

// //   const handleSecondaryClick = () => {
// //     if (onSecondaryClick) onSecondaryClick();
// //     else console.log('Secondary button clicked: View All Features');
// //   };

// //   return (
// //     // Outer Container: Minimum gap on left/right (px-3 md:px-5)
// //     <div className="w-full bg-[#F8FAFC] flex flex-col items-center justify-center pt-24 pb-16 px-3 md:pt-36 md:pb-24 md:px-5 font-['Inter',_sans-serif] antialiased selection:bg-[#1A45ED] selection:text-white">
      
// //       {/* Banner Box: 
// //         1. w-full and max-w-[1920px] for maximum width stretch.
// //         2. Smooth 2-color gradient (from Blue to Purple) matching the image exactly.
// //         3. min-h-[500px] to min-h-[700px] added to force massive inside height. 
// //       */}
// //       <div className="w-full max-w-[1920px] bg-gradient-to-r from-[#0C45F4] to-[#9327DD] rounded-[32px] md:rounded-[48px] relative overflow-hidden shadow-[0_24px_50px_-12px_rgba(75,50,200,0.3)] transition-all duration-300 hover:shadow-[0_32px_64px_-12px_rgba(75,50,200,0.4)] flex flex-col items-center justify-center min-h-[500px] md:min-h-[600px] lg:min-h-[700px] px-6 md:px-12 py-16">
        
// //         <div className="relative z-10 flex flex-col items-center text-center w-full">
          
// //           {/* Heading */}
// //           <h1 className="text-white text-5xl md:text-6xl lg:text-[72px] leading-[1.1] md:leading-[1.05] font-extrabold tracking-tight max-w-[1000px] mx-auto drop-shadow-sm">
// //             {heading.split('\n').map((line, index) => (
// //               <React.Fragment key={index}>
// //                 {line}
// //                 {index < heading.split('\n').length - 1 && <br className="hidden sm:block" />}
// //               </React.Fragment>
// //             ))}
// //           </h1>

// //           {/* Subheading */}
// //           <p className="mt-8 md:mt-10 text-lg md:text-xl lg:text-[22px] leading-[1.6] md:leading-[1.7] text-white/90 font-medium max-w-[600px] md:max-w-[750px] mx-auto">
// //             {subheading.split('\n').map((line, index) => (
// //               <React.Fragment key={index}>
// //                 {line}
// //                 {index < subheading.split('\n').length - 1 && <br className="hidden md:block" />}
// //               </React.Fragment>
// //             ))}
// //           </p>

// //           {/* Buttons Container */}
// //           <div className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full">
// //             <Button variant="primary" onClick={handlePrimaryClick}>
// //               {primaryButtonText}
// //             </Button>
            
// //             <Button variant="secondary" onClick={handleSecondaryClick}>
// //               {secondaryButtonText}
// //             </Button>
// //           </div>
          
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }; 
// import React from 'react';

// // ============================================================================
// // CTA BANNER - PRODUCTION READY COMPONENT
// // Figma Design Implementation - Single File
// // ============================================================================

// interface CTABannerProps {
//   heading?: string;
//   subheading?: string;
//   primaryButtonText?: string;
//   secondaryButtonText?: string;
//   onPrimaryClick?: () => void;
//   onSecondaryClick?: () => void;
// }

// export const CTABanner: React.FC<CTABannerProps> = ({
//   heading = "Ready to build the future of your showroom?",
//   subheading = "Join 3,200+ showrooms already using LuxeTile to transform customer experience and boost sales.",
//   primaryButtonText = "Book Your Demo",
//   secondaryButtonText = "View All Features",
//   onPrimaryClick,
//   onSecondaryClick
// }) => {

//   const handlePrimaryClick = () => {
//     if (onPrimaryClick) {
//       onPrimaryClick();
//     } else {
//       console.log('Primary button clicked: Book Your Demo');
//     }
//   };

//   const handleSecondaryClick = () => {
//     if (onSecondaryClick) {
//       onSecondaryClick();
//     } else {
//       console.log('Secondary button clicked: View All Features');
//     }
//   };

//   return (
//     <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 flex items-center justify-center bg-gray-50">
      
//       {/* Main Outer Wrapper - Figma: 1152px max-width, gradient background, 48px radius */}
//       <div className="w-full max-w-[1152px] rounded-[24px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] bg-gradient-to-b from-[#0040DF] to-[#8127CF] shadow-[0_20px_40px_-10px_rgba(0,64,223,0.3)] md:shadow-[0_35px_60px_-15px_rgba(0,64,223,0.3)] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_70px_-15px_rgba(0,64,223,0.4)]">
        
//         {/* Inner Container - Figma: 96px padding all sides, 32px gap between elements */}
//         <div className="px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-12 sm:py-14 md:py-18 lg:py-20 xl:py-24 flex flex-col items-center justify-center gap-6 sm:gap-7 md:gap-8">
          
//           {/* Heading - Figma: 56px font, 900 weight, white color, -0.56px letter spacing */}
//           <h2 className="text-white font-extrabold sm:font-black text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] xl:text-[56px] leading-[1.2] sm:leading-[1.2] md:leading-[1.25] lg:leading-[1.25] tracking-[-0.01em] md:tracking-[-0.01em] text-center max-w-[280px] sm:max-w-[420px] md:max-w-[540px] lg:max-w-[640px] xl:max-w-[675px]">
//             {heading}
//           </h2>

//           {/* Subheading - Figma: 16px font, 400 weight, white 80% opacity */}
//           <p className="text-white/80 font-normal text-[14px] sm:text-[15px] md:text-[16px] leading-[1.5] md:leading-[1.5] text-center max-w-[300px] sm:max-w-[460px] md:max-w-[560px] lg:max-w-[640px] xl:max-w-[672px] px-2 sm:px-0">
//             {subheading}
//           </p>

//           {/* Buttons Container - Figma: Horizontal layout, 24px gap */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full mt-2 sm:mt-3 md:mt-4">
            
//             {/* Primary Button - Figma: White bg, blue text, 40px horizontal padding, 21px vertical padding */}
//             <button
//               onClick={handlePrimaryClick}
//               className="w-full sm:w-auto px-8 sm:px-9 md:px-10 py-[18px] sm:py-[19px] md:py-[21px] rounded-full bg-white text-[#0040DF] font-semibold text-[15px] sm:text-[16px] md:text-[17px] leading-[28px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.15)] active:scale-[0.98] whitespace-nowrap"
//             >
//               {primaryButtonText}
//             </button>

//             {/* Secondary Button - Figma: Black 20% opacity bg, white 30% border, backdrop blur 12px */}
//             <button
//               onClick={handleSecondaryClick}
//               className="w-full sm:w-auto px-8 sm:px-9 md:px-10 py-[17px] sm:py-[18px] md:py-[20px] rounded-full bg-black/20 border border-white/30 text-white font-semibold text-[15px] sm:text-[16px] md:text-[17px] leading-[28px] backdrop-blur-[12px] transition-all duration-300 hover:bg-black/30 hover:border-white/40 active:scale-[0.98] whitespace-nowrap"
//             >
//               {secondaryButtonText}
//             </button>

//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default CTABanner; 
import React from 'react';

// ============================================================================
// CTA BANNER - PRODUCTION READY COMPONENT
// ✅ Aligned with App.tsx: max-w-[1800px] + px-3 md:px-5
// ============================================================================

interface CTABannerProps {
  heading?: string;
  subheading?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export const CTABanner: React.FC<CTABannerProps> = ({
  heading = "Ready to build the future of your showroom?",
  subheading = "Join 3,200+ showrooms already using LuxeTile to transform customer experience and boost sales.",
  primaryButtonText = "Book Your Demo",
  secondaryButtonText = "View All Features",
  onPrimaryClick,
  onSecondaryClick
}) => {

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else {
      console.log('Primary button clicked: Book Your Demo');
      // Scroll to contact or demo section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      console.log('Secondary button clicked: View All Features');
      // Scroll to features section
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Animation Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}} />

      {/* ✅ OUTER WRAPPER - ALIGNED WITH APP.TSX */}
      {/* Previous: px-4 sm:px-6 md:px-8 */}
      {/* New: px-3 md:px-5 (MATCHES FEATUREGUIDE, STATISTICS) */}
      <section 
        className="w-full max-w-[1800px] mx-auto py-20 lg:py-28 px-3 md:px-5 flex items-center justify-center font-['Inter',_sans-serif] antialiased"
        aria-label="Call to action banner"
      >
        
        {/* ✅ GRADIENT CARD CONTAINER */}
        {/* Responsive border-radius & enhanced gradient */}
        <div 
          className="
            w-full 
            rounded-[24px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[48px] 
            bg-gradient-to-br from-[#0040DF] via-[#5B3DD9] to-[#8127CF]
            shadow-[0_20px_40px_-10px_rgba(0,64,223,0.3)] 
            md:shadow-[0_35px_60px_-15px_rgba(0,64,223,0.35)]
            overflow-hidden 
            transition-all duration-500 
            hover:shadow-[0_40px_70px_-15px_rgba(0,64,223,0.45)]
            hover:scale-[1.01]
            relative
            group
          "
          style={{
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 8s ease infinite'
          }}
        >
          
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
            <div className="absolute bottom-10 left-10 w-60 h-60 bg-white rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite 1s' }} />
          </div>

          {/* ✅ INNER CONTENT CONTAINER */}
          {/* Responsive padding matching design system */}
          <div className="
            relative z-10
            px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 
            py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 
            flex flex-col items-center justify-center 
            gap-6 sm:gap-7 md:gap-8
          ">
            
            {/* ✅ HEADING - RESPONSIVE & BOLD */}
            <h2 className="
              text-white 
              font-extrabold sm:font-black 
              text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] xl:text-[56px] 
              leading-[1.15] sm:leading-[1.2] 
              tracking-[-0.02em] 
              text-center 
              max-w-[280px] sm:max-w-[420px] md:max-w-[540px] lg:max-w-[640px] xl:max-w-[700px]
              transition-all duration-300
              group-hover:scale-[1.02]
            ">
              {heading}
            </h2>

            {/* ✅ SUBHEADING - READABLE & PROFESSIONAL */}
            <p className="
              text-white/90 
              font-normal 
              text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px]
              leading-[1.6] 
              text-center 
              max-w-[300px] sm:max-w-[460px] md:max-w-[560px] lg:max-w-[640px] xl:max-w-[720px] 
              px-2 sm:px-0
            ">
              {subheading}
            </p>

            {/* ✅ BUTTONS CONTAINER - FLEXIBLE LAYOUT */}
            <div className="
              flex flex-col sm:flex-row 
              items-center justify-center 
              gap-3 sm:gap-4 md:gap-5 lg:gap-6 
              w-full 
              mt-2 sm:mt-3 md:mt-4
            ">
              
              {/* ✅ PRIMARY BUTTON - WHITE SOLID */}
              <button
                onClick={handlePrimaryClick}
                className="
                  w-full sm:w-auto 
                  px-9 sm:px-10 md:px-11 lg:px-12 
                  py-[18px] sm:py-[19px] md:py-[20px] lg:py-[21px] 
                  rounded-full 
                  bg-white 
                  text-[#0040DF] 
                  font-bold 
                  text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px]
                  leading-tight
                  shadow-[0_4px_14px_rgba(0,0,0,0.1)]
                  transition-all duration-300 
                  hover:scale-[1.03] 
                  hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]
                  active:scale-[0.98]
                  focus:outline-none 
                  focus:ring-4 
                  focus:ring-white/30
                  whitespace-nowrap
                "
                aria-label={primaryButtonText}
              >
                {primaryButtonText}
              </button>

              {/* ✅ SECONDARY BUTTON - GLASS EFFECT */}
              <button
                onClick={handleSecondaryClick}
                className="
                  w-full sm:w-auto 
                  px-9 sm:px-10 md:px-11 lg:px-12 
                  py-[17px] sm:py-[18px] md:py-[19px] lg:py-[20px] 
                  rounded-full 
                  bg-white/10 
                  border-2 border-white/40 
                  text-white 
                  font-semibold 
                  text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px]
                  leading-tight
                  backdrop-blur-[12px] 
                  transition-all duration-300 
                  hover:bg-white/20 
                  hover:border-white/60
                  hover:scale-[1.03]
                  active:scale-[0.98]
                  focus:outline-none 
                  focus:ring-4 
                  focus:ring-white/30
                  whitespace-nowrap
                "
                aria-label={secondaryButtonText}
              >
                {secondaryButtonText}
              </button>

            </div>

          </div>
        </div>
      </section>
    </>
  );
};

// ============================================================================
// NAMED EXPORT FOR FLEXIBILITY
// ============================================================================

export const Banner = CTABanner;

export default CTABanner;