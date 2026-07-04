
import React from 'react';

// ============================================================================
// INTERFACES
// ============================================================================

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

interface BannerProps {
  heading?: string;
  subheading?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick }) => {
  const baseStyles = "w-full sm:w-auto px-8 py-4 md:px-12 md:py-[18px] rounded-full font-bold text-[17px] md:text-[18px] transition-all duration-300";
  
  const variantStyles = {
    primary: "bg-white text-[#1A45ED] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-[2px] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.2)]",
    secondary: "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-md"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {children}
    </button>
  );
};

// ============================================================================
// MAIN COMPONENT - PRODUCTION READY
// ============================================================================

export const Banner: React.FC<BannerProps> = ({
  heading = "Ready to build the future\nof your showroom?",
  subheading = "Join 200+ luxury retailers using LuxeTile AI to revolutionize the physical shopping experience.",
  primaryButtonText = "Book Your Demo",
  secondaryButtonText = "View All Features",
  onPrimaryClick,
  onSecondaryClick
}) => {
  
  const handlePrimaryClick = () => {
    if (onPrimaryClick) onPrimaryClick();
    else console.log('Primary button clicked: Book Your Demo');
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) onSecondaryClick();
    else console.log('Secondary button clicked: View All Features');
  };

  return (
    // Outer Container: Minimum gap on left/right (px-3 md:px-5)
    <div className="w-full bg-[#F8FAFC] flex flex-col items-center justify-center pt-24 pb-16 px-3 md:pt-36 md:pb-24 md:px-5 font-['Inter',_sans-serif] antialiased selection:bg-[#1A45ED] selection:text-white">
      
      {/* Banner Box: 
        1. w-full and max-w-[1920px] for maximum width stretch.
        2. Smooth 2-color gradient (from Blue to Purple) matching the image exactly.
        3. min-h-[500px] to min-h-[700px] added to force massive inside height. 
      */}
      <div className="w-full max-w-[1920px] bg-gradient-to-r from-[#0C45F4] to-[#9327DD] rounded-[32px] md:rounded-[48px] relative overflow-hidden shadow-[0_24px_50px_-12px_rgba(75,50,200,0.3)] transition-all duration-300 hover:shadow-[0_32px_64px_-12px_rgba(75,50,200,0.4)] flex flex-col items-center justify-center min-h-[500px] md:min-h-[600px] lg:min-h-[700px] px-6 md:px-12 py-16">
        
        <div className="relative z-10 flex flex-col items-center text-center w-full">
          
          {/* Heading */}
          <h1 className="text-white text-5xl md:text-6xl lg:text-[72px] leading-[1.1] md:leading-[1.05] font-extrabold tracking-tight max-w-[1000px] mx-auto drop-shadow-sm">
            {heading.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < heading.split('\n').length - 1 && <br className="hidden sm:block" />}
              </React.Fragment>
            ))}
          </h1>

          {/* Subheading */}
          <p className="mt-8 md:mt-10 text-lg md:text-xl lg:text-[22px] leading-[1.6] md:leading-[1.7] text-white/90 font-medium max-w-[600px] md:max-w-[750px] mx-auto">
            {subheading.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < subheading.split('\n').length - 1 && <br className="hidden md:block" />}
              </React.Fragment>
            ))}
          </p>

          {/* Buttons Container */}
          <div className="mt-12 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full">
            <Button variant="primary" onClick={handlePrimaryClick}>
              {primaryButtonText}
            </Button>
            
            <Button variant="secondary" onClick={handleSecondaryClick}>
              {secondaryButtonText}
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
};