

// import React from 'react';

// // ============================================================================
// // INTERFACES
// // ============================================================================

// interface FooterLink {
//   label: string;
//   href: string;
// }

// interface FooterProps {
//   logoText?: string;
//   description?: string;
//   links?: FooterLink[];
//   copyrightText?: string;
//   onVolumeClick?: () => void;
//   onLanguageClick?: () => void;
//   onShareClick?: () => void;
// }

// // ============================================================================
// // LOGO COMPONENT - LARGER & MORE VISIBLE
// // ============================================================================

// const Logo: React.FC<{ text?: string }> = ({ text = 'Tilesview360' }) => (
//   <div className="flex items-center gap-3 
//   2xl:gap-3.5
//   xl:gap-3
//   lg:gap-3
//   md:gap-2.5
//   sm:gap-2.5">
//     {/* Custom SVG Logo - LARGER */}
//     <div className="relative w-8 h-8
//     2xl:w-10 2xl:h-10
//     xl:w-9 xl:h-9
//     lg:w-8 lg:h-8
//     md:w-7 md:h-7
//     sm:w-7 sm:h-7 flex-shrink-0">
//       <div className="absolute top-0 left-0 w-5 h-5 bg-indigo-300 rounded-[3px]
//       2xl:w-6 2xl:h-6
//       xl:w-5.5 xl:h-5.5
//       lg:w-5 lg:h-5
//       md:w-4.5 md:h-4.5
//       sm:w-4 sm:h-4"></div>
//       <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#0B40E8] rounded-[3px] mix-blend-multiply
//       2xl:w-6 2xl:h-6
//       xl:w-5.5 xl:h-5.5
//       lg:w-5 lg:h-5
//       md:w-4.5 md:h-4.5
//       sm:w-4 sm:h-4"></div>
//     </div>
    
//     <span className="font-[800] text-[#111827] text-[22px] tracking-tight
//     2xl:text-[26px]
//     xl:text-[24px]
//     lg:text-[22px]
//     md:text-[20px]
//     sm:text-[19px]">
//       {text}
//     </span>
//   </div>
// );

// // ============================================================================
// // ICON COMPONENTS - LARGER & MORE VISIBLE
// // ============================================================================

// const VolumeIcon: React.FC = () => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     className="w-5 h-5 2xl:w-6 2xl:h-6 xl:w-5.5 xl:h-5.5 lg:w-5 lg:h-5 md:w-5 md:h-5 sm:w-5 sm:h-5"
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2.5" 
//     strokeLinecap="round" 
//     strokeLinejoin="round"
//   >
//     <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
//     <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
//     <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
//   </svg>
// );

// const GlobeIcon: React.FC = () => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     className="w-5 h-5 2xl:w-6 2xl:h-6 xl:w-5.5 xl:h-5.5 lg:w-5 lg:h-5 md:w-5 md:h-5 sm:w-5 sm:h-5"
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2.5" 
//     strokeLinecap="round" 
//     strokeLinejoin="round"
//   >
//     <circle cx="12" cy="12" r="10"/>
//     <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
//     <path d="M2 12h20"/>
//   </svg>
// );

// const ShareIcon: React.FC = () => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     className="w-5 h-5 2xl:w-6 2xl:h-6 xl:w-5.5 xl:h-5.5 lg:w-5 lg:h-5 md:w-5 md:h-5 sm:w-5 sm:h-5"
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2.5" 
//     strokeLinecap="round" 
//     strokeLinejoin="round"
//   >
//     <circle cx="18" cy="5" r="3"/>
//     <circle cx="6" cy="12" r="3"/>
//     <circle cx="18" cy="19" r="3"/>
//     <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
//     <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
//   </svg>
// );

// // ============================================================================
// // MAIN FOOTER COMPONENT - PRODUCTION READY WITH LARGER ELEMENTS
// // ============================================================================

// export const Footer: React.FC<FooterProps> = ({
//   logoText = 'Tilesview360',
//   description = "The world's leading AI engine for architectural material visualization and showroom optimization.",
//   links = [
//     { label: 'Privacy Policy', href: '#' },
//     { label: 'Terms of Service', href: '#' },
//     { label: 'Contact Support', href: '#' },
//     { label: 'Documentation', href: '#' }
//   ],
//   copyrightText = '© 2025 SrijanX Tile. All rights reserved.',
//   onVolumeClick,
//   onLanguageClick,
//   onShareClick
// }) => {

//   const handleVolumeClick = () => {
//     if (onVolumeClick) {
//       onVolumeClick();
//     } else {
//       console.log('🔊 Volume settings');
//     }
//   };

//   const handleLanguageClick = () => {
//     if (onLanguageClick) {
//       onLanguageClick();
//     } else {
//       console.log('🌐 Language selector');
//     }
//   };

//   const handleShareClick = () => {
//     if (onShareClick) {
//       onShareClick();
//     } else {
//       console.log('🔗 Share platform');
//     }
//   };

//   return (
//     // ✅ YAHAN FIX KIYA HAI: bg-white/90 aur backdrop-blur-sm hata kar pure bg-white kar diya
//     <footer className="w-full bg-white border-t border-gray-200 mt-auto">
//       <div className="w-full max-w-[1400px] mx-auto px-6 py-12 md:py-16
//       2xl:max-w-[1400px] 2xl:px-8 2xl:py-20
//       xl:max-w-[1300px] xl:px-7 xl:py-18
//       lg:max-w-[1200px] lg:px-6 lg:py-16
//       md:max-w-[1000px] md:px-6 md:py-14
//       sm:max-w-full sm:px-5 sm:py-12">
        
//         {/* Top Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-6
//         2xl:gap-8
//         xl:gap-7
//         lg:gap-6
//         md:gap-6
//         sm:gap-8">
          
//           {/* Left Column: Logo & Description */}
//           <div className="flex flex-col max-w-[550px]
//           2xl:max-w-[600px]
//           xl:max-w-[550px]
//           lg:max-w-[500px]
//           md:max-w-[450px]
//           sm:max-w-full">
            
//             {/* Logo */}
//             <Logo text={logoText} />
            
//             {/* Description - LARGER FONT */}
//             <p className="mt-4 text-[15px] text-[#6B7280] leading-[1.7] font-[400]
//             2xl:mt-5 2xl:text-[17px]
//             xl:mt-4.5 xl:text-[16px]
//             lg:mt-4 lg:text-[15px]
//             md:mt-3.5 md:text-[14px]
//             sm:mt-3 sm:text-[14px]">
//               {description}
//             </p>
//           </div>

//           {/* Right Column: Navigation Links - LARGER FONT */}
//           <div className="flex flex-wrap items-center gap-7
//           2xl:gap-8
//           xl:gap-7
//           lg:gap-6
//           md:gap-5
//           sm:gap-5">
//             {links.map((link, index) => (
//               <a 
//                 key={index}
//                 href={link.href} 
//                 className="text-[15px] font-[600] text-[#6B7280] hover:text-[#0B40E8] transition-colors duration-200
//                 2xl:text-[17px]
//                 xl:text-[16px]
//                 lg:text-[15px]
//                 md:text-[14px]
//                 sm:text-[14px]"
//               >
//                 {link.label}
//               </a>
//             ))}
//           </div>
//         </div>

//         {/* Horizontal Divider */}
//         <div className="w-full h-[1px] bg-[#E5E7EB] my-8
//         2xl:my-10
//         xl:my-9
//         lg:my-8
//         md:my-7
//         sm:my-6"></div>

//         {/* Bottom Section */}
//         <div className="flex flex-col md:flex-row justify-between items-center gap-6
//         2xl:gap-6
//         xl:gap-6
//         lg:gap-5
//         md:gap-5
//         sm:gap-5">
          
//           {/* Copyright Text - LARGER FONT */}
//           <p className="text-[14px] font-[500] text-[#9CA3AF]
//           2xl:text-[16px]
//           xl:text-[15px]
//           lg:text-[14px]
//           md:text-[13px]
//           sm:text-[13px]">
//             {copyrightText}
//           </p>

//           {/* Utility Icons - LARGER BUTTONS */}
//           <div className="flex items-center gap-5
//           2xl:gap-6
//           xl:gap-5
//           lg:gap-5
//           md:gap-4
//           sm:gap-4">
            
//             {/* Volume/Sound Icon Button */}
//             <button 
//               onClick={handleVolumeClick}
//               className="p-2.5 rounded-full bg-gray-100 text-[#6B7280] hover:bg-[#0B40E8] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md
//               2xl:p-3
//               xl:p-2.5
//               lg:p-2.5
//               md:p-2
//               sm:p-2" 
//               aria-label="Volume settings"
//             >
//               <VolumeIcon />
//             </button>
            
//             {/* Globe/Language Icon Button */}
//             <button 
//               onClick={handleLanguageClick}
//               className="p-2.5 rounded-full bg-gray-100 text-[#6B7280] hover:bg-[#0B40E8] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md
//               2xl:p-3
//               xl:p-2.5
//               lg:p-2.5
//               md:p-2
//               sm:p-2" 
//               aria-label="Change language"
//             >
//               <GlobeIcon />
//             </button>
            
//             {/* Share Icon Button */}
//             <button 
//               onClick={handleShareClick}
//               className="p-2.5 rounded-full bg-gray-100 text-[#6B7280] hover:bg-[#0B40E8] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md
//               2xl:p-3
//               xl:p-2.5
//               lg:p-2.5
//               md:p-2
//               sm:p-2" 
//               aria-label="Share platform"
//             >
//               <ShareIcon />
//             </button>
//           </div>
//         </div>

//         {/* Status Indicators - LARGER */}
//         <div className="mt-6 flex items-center justify-center gap-6 text-[13px] text-gray-500
//         2xl:mt-8 2xl:gap-7 2xl:text-[15px]
//         xl:mt-7 xl:gap-6 xl:text-[14px]
//         lg:mt-6 lg:gap-6 lg:text-[13px]
//         md:mt-5 md:gap-5 md:text-[12px]
//         sm:mt-5 sm:gap-4 sm:text-[12px]">
//           <span className="flex items-center gap-2">
//             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse
//             2xl:w-2.5 2xl:h-2.5
//             xl:w-2 xl:h-2"></span>
//             Secure Platform
//           </span>
//           <span className="flex items-center gap-2">
//             <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse
//             2xl:w-2.5 2xl:h-2.5
//             xl:w-2 xl:h-2"></span>
//             Cloud Powered
//           </span>
//           <span className="flex items-center gap-2">
//             <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse
//             2xl:w-2.5 2xl:h-2.5
//             xl:w-2 xl:h-2"></span>
//             Real-time Updates
//           </span>
//         </div>

//       </div>
//     </footer>
//   );
// };

// export default Footer; 
import React from 'react';

// ============================================================================
// INTERFACES
// ============================================================================

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  logoText?: string;
  description?: string;
  links?: FooterLink[];
  copyrightText?: string;
  onVolumeClick?: () => void;
  onLanguageClick?: () => void;
  onShareClick?: () => void;
}

// ============================================================================
// LOGO COMPONENT - LARGER & MORE VISIBLE
// ============================================================================

const Logo: React.FC<{ text?: string }> = ({ text = 'Tilesview360' }) => (
  <div className="flex items-center gap-3 
  2xl:gap-3.5
  xl:gap-3
  lg:gap-3
  md:gap-2.5
  sm:gap-2.5">
    {/* Custom SVG Logo - LARGER */}
    <div className="relative w-8 h-8
    2xl:w-10 2xl:h-10
    xl:w-9 xl:h-9
    lg:w-8 lg:h-8
    md:w-7 md:h-7
    sm:w-7 sm:h-7 flex-shrink-0">
      <div className="absolute top-0 left-0 w-5 h-5 bg-indigo-300 rounded-[3px]
      2xl:w-6 2xl:h-6
      xl:w-5.5 xl:h-5.5
      lg:w-5 lg:h-5
      md:w-4.5 md:h-4.5
      sm:w-4 sm:h-4"></div>
      <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#0B40E8] rounded-[3px] mix-blend-multiply
      2xl:w-6 2xl:h-6
      xl:w-5.5 xl:h-5.5
      lg:w-5 lg:h-5
      md:w-4.5 md:h-4.5
      sm:w-4 sm:h-4"></div>
    </div>
    
    <span className="font-[800] text-[#111827] text-[22px] tracking-tight
    2xl:text-[26px]
    xl:text-[24px]
    lg:text-[22px]
    md:text-[20px]
    sm:text-[19px]">
      {text}
    </span>
  </div>
);

// ============================================================================
// ICON COMPONENTS - LARGER & MORE VISIBLE
// ============================================================================

const VolumeIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="w-5 h-5 2xl:w-6 2xl:h-6 xl:w-5.5 xl:h-5.5 lg:w-5 lg:h-5 md:w-5 md:h-5 sm:w-5 sm:h-5"
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>
);

const GlobeIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="w-5 h-5 2xl:w-6 2xl:h-6 xl:w-5.5 xl:h-5.5 lg:w-5 lg:h-5 md:w-5 md:h-5 sm:w-5 sm:h-5"
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    <path d="M2 12h20"/>
  </svg>
);

const ShareIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="w-5 h-5 2xl:w-6 2xl:h-6 xl:w-5.5 xl:h-5.5 lg:w-5 lg:h-5 md:w-5 md:h-5 sm:w-5 sm:h-5"
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

// ============================================================================
// MAIN FOOTER COMPONENT - PRODUCTION READY
// ============================================================================

export const Footer: React.FC<FooterProps> = ({
  logoText = 'Tilesview360',
  description = "The world's leading AI engine for architectural material visualization and showroom optimization.",
  links = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Contact Support', href: '#' },
    { label: 'Documentation', href: '#' }
  ],
  copyrightText = '© 2025 SrijanX Tile. All rights reserved.',
  onVolumeClick,
  onLanguageClick,
  onShareClick
}) => {

  const handleVolumeClick = () => {
    if (onVolumeClick) {
      onVolumeClick();
    } else {
      console.log('🔊 Volume settings');
    }
  };

  const handleLanguageClick = () => {
    if (onLanguageClick) {
      onLanguageClick();
    } else {
      console.log('🌐 Language selector');
    }
  };

  const handleShareClick = () => {
    if (onShareClick) {
      onShareClick();
    } else {
      console.log('🔗 Share platform');
    }
  };

  return (
    // ✅ YAHAN FIX KIYA HAI: Outer footer ab exactly baaki sections ki tarah px-3 md:px-5 aur flex-center par hai
    <footer className="w-full bg-white border-t border-gray-200 mt-auto px-3 md:px-5 flex justify-center">
      
      {/* ✅ YAHAN FIX KIYA HAI: Inner container strictly max-w-[1920px] hai bina kisi unnecessary responsive width limits ke */}
      <div className="w-full max-w-[1920px] py-12 md:py-16 2xl:py-20">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-6
        2xl:gap-8
        xl:gap-7
        lg:gap-6
        md:gap-6
        sm:gap-8">
          
          {/* Left Column: Logo & Description */}
          <div className="flex flex-col max-w-[550px]
          2xl:max-w-[600px]
          xl:max-w-[550px]
          lg:max-w-[500px]
          md:max-w-[450px]
          sm:max-w-full">
            
            {/* Logo */}
            <Logo text={logoText} />
            
            {/* Description - LARGER FONT */}
            <p className="mt-4 text-[15px] text-[#6B7280] leading-[1.7] font-[400]
            2xl:mt-5 2xl:text-[17px]
            xl:mt-4.5 xl:text-[16px]
            lg:mt-4 lg:text-[15px]
            md:mt-3.5 md:text-[14px]
            sm:mt-3 sm:text-[14px]">
              {description}
            </p>
          </div>

          {/* Right Column: Navigation Links - LARGER FONT */}
          <div className="flex flex-wrap items-center gap-7
          2xl:gap-8
          xl:gap-7
          lg:gap-6
          md:gap-5
          sm:gap-5">
            {links.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                className="text-[15px] font-[600] text-[#6B7280] hover:text-[#0B40E8] transition-colors duration-200
                2xl:text-[17px]
                xl:text-[16px]
                lg:text-[15px]
                md:text-[14px]
                sm:text-[14px]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="w-full h-[1px] bg-[#E5E7EB] my-8
        2xl:my-10
        xl:my-9
        lg:my-8
        md:my-7
        sm:my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6
        2xl:gap-6
        xl:gap-6
        lg:gap-5
        md:gap-5
        sm:gap-5">
          
          {/* Copyright Text - LARGER FONT */}
          <p className="text-[14px] font-[500] text-[#9CA3AF]
          2xl:text-[16px]
          xl:text-[15px]
          lg:text-[14px]
          md:text-[13px]
          sm:text-[13px]">
            {copyrightText}
          </p>

          {/* Utility Icons - LARGER BUTTONS */}
          <div className="flex items-center gap-5
          2xl:gap-6
          xl:gap-5
          lg:gap-5
          md:gap-4
          sm:gap-4">
            
            {/* Volume/Sound Icon Button */}
            <button 
              onClick={handleVolumeClick}
              className="p-2.5 rounded-full bg-gray-100 text-[#6B7280] hover:bg-[#0B40E8] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md
              2xl:p-3
              xl:p-2.5
              lg:p-2.5
              md:p-2
              sm:p-2" 
              aria-label="Volume settings"
            >
              <VolumeIcon />
            </button>
            
            {/* Globe/Language Icon Button */}
            <button 
              onClick={handleLanguageClick}
              className="p-2.5 rounded-full bg-gray-100 text-[#6B7280] hover:bg-[#0B40E8] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md
              2xl:p-3
              xl:p-2.5
              lg:p-2.5
              md:p-2
              sm:p-2" 
              aria-label="Change language"
            >
              <GlobeIcon />
            </button>
            
            {/* Share Icon Button */}
            <button 
              onClick={handleShareClick}
              className="p-2.5 rounded-full bg-gray-100 text-[#6B7280] hover:bg-[#0B40E8] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md
              2xl:p-3
              xl:p-2.5
              lg:p-2.5
              md:p-2
              sm:p-2" 
              aria-label="Share platform"
            >
              <ShareIcon />
            </button>
          </div>
        </div>

        {/* Status Indicators - LARGER */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[13px] text-gray-500
        2xl:mt-8 2xl:gap-7 2xl:text-[15px]
        xl:mt-7 xl:gap-6 xl:text-[14px]
        lg:mt-6 lg:gap-6 lg:text-[13px]
        md:mt-5 md:gap-5 md:text-[12px]
        sm:mt-5 sm:gap-4 sm:text-[12px]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse
            2xl:w-2.5 2xl:h-2.5
            xl:w-2 xl:h-2"></span>
            Secure Platform
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse
            2xl:w-2.5 2xl:h-2.5
            xl:w-2 xl:h-2"></span>
            Cloud Powered
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse
            2xl:w-2.5 2xl:h-2.5
            xl:w-2 xl:h-2"></span>
            Real-time Updates
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;