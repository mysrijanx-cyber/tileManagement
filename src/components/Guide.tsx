
// import React from 'react';

// // ============================================================================
// // GUIDE (TESTIMONIALS) - PRODUCTION READY
// // ✅ Container: max-w-[1800px] + INCREASED HEIGHT
// // ✅ Cards: Same height maintained
// // Component Name: Guide
// // ============================================================================

// // ============================================================================
// // STAR ICON COMPONENT
// // ============================================================================

// const Star: React.FC = React.memo(() => (
//   <svg 
//     width="20" 
//     height="20" 
//     viewBox="0 0 24 24" 
//     fill="none" 
//     xmlns="http://www.w3.org/2000/svg"
//     aria-hidden="true"
//   >
//     <path 
//       d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
//       fill="#8B31FF" 
//     />
//   </svg>
// ));
// Star.displayName = 'Star';

// // ============================================================================
// // INTERFACES
// // ============================================================================

// interface Testimonial {
//   id: string;
//   quote: string;
//   author: {
//     name: string;
//     role: string;
//     image?: string;
//     initials?: string;
//     bgColor?: string;
//     textColor?: string;
//   };
// }

// interface GuideProps {
//   heading?: string;
//   subheading?: string;
//   testimonials?: Testimonial[];
// }

// // ============================================================================
// // TESTIMONIAL CARD COMPONENT
// // ============================================================================

// interface TestimonialCardProps {
//   testimonial: Testimonial;
// }

// const TestimonialCard: React.FC<TestimonialCardProps> = React.memo(({ testimonial }) => {
//   const { quote, author } = testimonial;

//   return (
//     <article className="
//       bg-white 
//       rounded-[28px]
//       p-8
//       flex flex-col 
//       shadow-lg shadow-black/5
//       transition-all duration-300
//       hover:shadow-xl hover:shadow-black/10
//       hover:-translate-y-1
//     ">
      
//       {/* Star Rating */}
//       <div className="flex gap-[3px] mb-6" role="img" aria-label="5 star rating">
//         <Star />
//         <Star />
//         <Star />
//         <Star />
//         <Star />
//       </div>

//       {/* Quote */}
//       <blockquote className="
//         italic 
//         text-[#1C1E21] 
//         text-[15.5px]
//         leading-[1.6] 
//         mb-8
//         font-normal
//       ">
//         "{quote}"
//       </blockquote>

//       {/* Author Info */}
//       <div className="mt-auto flex items-center gap-4">
//         {author.image ? (
//           <img
//             src={author.image}
//             alt={author.name}
//             className="w-[46px] h-[46px] rounded-full object-cover shrink-0"
//             loading="lazy"
//           />
//         ) : (
//           <div 
//             className="
//               w-[46px] h-[46px]
//               rounded-full 
//               flex items-center justify-center 
//               font-bold text-[15px]
//               shrink-0
//             "
//             style={{ 
//               backgroundColor: author.bgColor || '#E4E9FC',
//               color: author.textColor || '#455AF3'
//             }}
//           >
//             {author.initials}
//           </div>
//         )}
        
//         <div className="flex flex-col">
//           <span className="
//             text-[#0F172A] 
//             font-bold 
//             text-[15px]
//             leading-tight 
//             mb-1
//           ">
//             {author.name}
//           </span>
//           <span className="
//             text-[#64748B] 
//             text-[11px]
//             font-bold 
//             uppercase 
//             tracking-[0.06em]
//           ">
//             {author.role}
//           </span>
//         </div>
//       </div>
//     </article>
//   );
// });
// TestimonialCard.displayName = 'TestimonialCard';

// // ============================================================================
// // MAIN GUIDE COMPONENT (TESTIMONIALS)
// // ============================================================================

// export const Guide: React.FC<GuideProps> = ({
//   heading = "Trusted by Industry Leaders",
//   subheading = "Real results from real tile businesses.",
//   testimonials = [
//     {
//       id: '1',
//       quote: "LuxeTile AI didn't just change our showroom; it doubled our conversion rate in 6 months. Our customers no longer hesitate—they visualize and buy.",
//       author: {
//         name: "Julianne Vance",
//         role: "Director, Vance Interiors",
//         image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
//       }
//     },
//     {
//       id: '2',
//       quote: "Customers finalize tile choices faster now. Our average decision time dropped from 3 visits to just 1.",
//       author: {
//         name: "Rajesh Verma",
//         role: "Tile Dealer, Hyderabad",
//         initials: "RV",
//         bgColor: "#E4E9FC",
//         textColor: "#455AF3"
//       }
//     },
//     {
//       id: '3',
//       quote: "Our showroom engagement increased significantly. Customers spend more time exploring and buy with confidence.",
//       author: {
//         name: "Priya Nair",
//         role: "Distributor, Bangalore",
//         initials: "PN",
//         bgColor: "#F4E8FF",
//         textColor: "#A638F6"
//       }
//     }
//   ]
// }) => {
//   return (
//     <section 
//       className="
//         w-full 
//         bg-[#2D3133]
//         font-['Inter',_sans-serif] 
//         antialiased 
//         selection:bg-purple-300 
//         selection:text-purple-900
//       "
//       aria-labelledby="testimonials-heading"
//     >
//       {/* ✅ CONTAINER: max-w-[1800px] + INCREASED HEIGHT */}
//       {/* Previous: py-16 md:py-20 lg:py-24 */}
//       {/* New: py-24 md:py-28 lg:py-32 xl:py-36 (BLACK BACKGROUND AREA INCREASED) */}
//       <div className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-24 md:py-28 lg:py-32 xl:py-36">
        
//         {/* ═══════════════════════════════════════════════════════════
//             HEADER SECTION
//         ═══════════════════════════════════════════════════════════ */}
//         <div className="text-center mb-14 md:mb-16 lg:mb-20">
          
//           {/* Main Heading */}
//           <h2 
//             id="testimonials-heading"
//             className="
//               text-white 
//               text-[32px] sm:text-[36px] md:text-[40px]
//               font-bold 
//               tracking-tight 
//               mb-4
//             "
//           >
//             {heading}
//           </h2>

//           {/* Subheading Badge */}
//           <div className="flex justify-center">
//             <div className="
//               bg-[#1C212D] 
//               px-3 py-[3px]
//               rounded-[4px]
//               inline-block
//             ">
//               <p className="
//                 text-[#8392B2] 
//                 text-[15px]
//                 font-medium 
//                 tracking-wide
//               ">
//                 {subheading}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════
//             TESTIMONIAL CARDS GRID
//         ═══════════════════════════════════════════════════════════ */}
//         <div className="
//           grid 
//           grid-cols-1 
//           md:grid-cols-2 
//           lg:grid-cols-3 
//           gap-6
//           mb-20 md:mb-24 lg:mb-28
//         ">
//           {testimonials.map((testimonial) => (
//             <TestimonialCard 
//               key={testimonial.id} 
//               testimonial={testimonial} 
//             />
//           ))}
//         </div>

//         {/* ═══════════════════════════════════════════════════════════
//             BOTTOM DIVIDER LINE
//         ═══════════════════════════════════════════════════════════ */}
//         <div className="w-full">
//           <div className="border-t border-[#3A3F45] w-full"></div>
//         </div>

//       </div>
//     </section>
//   );
// };

// // ============================================================================
// // NAMED EXPORTS
// // ============================================================================

// export const Testimonials = Guide;

// export default Guide; 
import React from 'react';

// ============================================================================
// GUIDE (TESTIMONIALS) - PRODUCTION READY
// ✅ Dark black background removed from subheading
// Component Name: Guide
// ============================================================================

// ============================================================================
// STAR ICON COMPONENT
// ============================================================================

const Star: React.FC = React.memo(() => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path 
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
      fill="#8B31FF" 
    />
  </svg>
));
Star.displayName = 'Star';

// ============================================================================
// INTERFACES
// ============================================================================

interface Testimonial {
  id: string;
  quote: string;
  author: {
    name: string;
    role: string;
    image?: string;
    initials?: string;
    bgColor?: string;
    textColor?: string;
  };
}

interface GuideProps {
  heading?: string;
  subheading?: string;
  testimonials?: Testimonial[];
}

// ============================================================================
// TESTIMONIAL CARD COMPONENT
// ============================================================================

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = React.memo(({ testimonial }) => {
  const { quote, author } = testimonial;

  return (
    <article className="
      bg-white 
      rounded-[28px]
      p-8
      flex flex-col 
      shadow-lg shadow-black/5
      transition-all duration-300
      hover:shadow-xl hover:shadow-black/10
      hover:-translate-y-1
    ">
      
      {/* Star Rating */}
      <div className="flex gap-[3px] mb-6" role="img" aria-label="5 star rating">
        <Star />
        <Star />
        <Star />
        <Star />
        <Star />
      </div>

      {/* Quote */}
      <blockquote className="
        italic 
        text-[#1C1E21] 
        text-[15.5px]
        leading-[1.6] 
        mb-8
        font-normal
      ">
        "{quote}"
      </blockquote>

      {/* Author Info */}
      <div className="mt-auto flex items-center gap-4">
        {author.image ? (
          <img
            src={author.image}
            alt={author.name}
            className="w-[46px] h-[46px] rounded-full object-cover shrink-0"
            loading="lazy"
          />
        ) : (
          <div 
            className="
              w-[46px] h-[46px]
              rounded-full 
              flex items-center justify-center 
              font-bold text-[15px]
              shrink-0
            "
            style={{ 
              backgroundColor: author.bgColor || '#E4E9FC',
              color: author.textColor || '#455AF3'
            }}
          >
            {author.initials}
          </div>
        )}
        
        <div className="flex flex-col">
          <span className="
            text-[#0F172A] 
            font-bold 
            text-[15px]
            leading-tight 
            mb-1
          ">
            {author.name}
          </span>
          <span className="
            text-[#64748B] 
            text-[11px]
            font-bold 
            uppercase 
            tracking-[0.06em]
          ">
            {author.role}
          </span>
        </div>
      </div>
    </article>
  );
});
TestimonialCard.displayName = 'TestimonialCard';

// ============================================================================
// MAIN GUIDE COMPONENT (TESTIMONIALS)
// ============================================================================

export const Guide: React.FC<GuideProps> = ({
  heading = "Trusted by Industry Leaders",
  subheading = "Real results from real tile businesses.",
  testimonials = [
    {
      id: '1',
      quote: "LuxeTile AI didn't just change our showroom; it doubled our conversion rate in 6 months. Our customers no longer hesitate—they visualize and buy.",
      author: {
        name: "Julianne Vance",
        role: "Director, Vance Interiors",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
      }
    },
    {
      id: '2',
      quote: "Customers finalize tile choices faster now. Our average decision time dropped from 3 visits to just 1.",
      author: {
        name: "Rajesh Verma",
        role: "Tile Dealer, Hyderabad",
        initials: "RV",
        bgColor: "#E4E9FC",
        textColor: "#455AF3"
      }
    },
    {
      id: '3',
      quote: "Our showroom engagement increased significantly. Customers spend more time exploring and buy with confidence.",
      author: {
        name: "Priya Nair",
        role: "Distributor, Bangalore",
        initials: "PN",
        bgColor: "#F4E8FF",
        textColor: "#A638F6"
      }
    }
  ]
}) => {
  return (
    <section 
      className="
        w-full 
        bg-[#2D3133]
        font-['Inter',_sans-serif] 
        antialiased 
        selection:bg-purple-300 
        selection:text-purple-900
      "
      aria-labelledby="testimonials-heading"
    >
      <div className="w-full max-w-[1800px] mx-auto px-3 md:px-5 pt-24 md:pt-28 lg:pt-32 xl:pt-36 pb-12 md:pb-16 lg:pb-20 xl:pb-24">
        
        {/* ═══════════════════════════════════════════════════════════
            HEADER SECTION
        ═══════════════════════════════════════════════════════════ */}
        <div className="text-center mb-20 md:mb-24 lg:mb-28">
          
          <h2 
            id="testimonials-heading"
            className="
              text-white 
              text-[32px] sm:text-[36px] md:text-[40px]
              font-bold 
              tracking-tight 
              mb-4
            "
          >
            {heading}
          </h2>

          <div className="flex justify-center">
            {/* ✅ Faltu ka dark black background hata diya gaya hai */}
            <div className="
              px-3 py-[3px]
              inline-block
            ">
              <p className="
                text-white/90 
                text-[16px]
                font-medium 
                tracking-wide
              ">
                {subheading}
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            TESTIMONIAL CARDS GRID
        ═══════════════════════════════════════════════════════════ */}
        <div className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          lg:grid-cols-3 
          gap-6
          mb-10 md:mb-12 lg:mb-16
        ">
          {testimonials.map((testimonial) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
            />
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            BOTTOM DIVIDER LINE
        ═══════════════════════════════════════════════════════════ */}
        <div className="w-full">
          <div className="border-t border-[#3A3F45] w-full"></div>
        </div>

      </div>
    </section>
  );
};

// ============================================================================
// NAMED EXPORTS
// ============================================================================

export const Testimonials = Guide;

export default Guide;