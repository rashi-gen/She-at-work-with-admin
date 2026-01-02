"use client";

export const HeroSection = () => {
  return (
    <section className="relative w-full mt-24 sm:mt-20">
      {/* Different aspect ratios for different screens */}
      <div className="relative w-full 
        aspect-[2/1]    /* Mobile: 2:1 ratio */
        sm:aspect-[3/1]  /* Small screens: 3:1 */
        md:aspect-[4/1]  /* Tablet: 4:1 */
        lg:aspect-[5/1]  /* Desktop: 5:1 */
        overflow-hidden">
        
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center sm:bg-top bg-no-repeat"
          style={{
            backgroundImage: "url('/slide-finala.jpg')",
          }}
        />
      </div>
    </section>
  );
};