import React from 'react'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'

const Cta = () => {
  return (
       <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        <div className="relative max-w-screen-xl mx-auto text-center text-white px-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-display font-bold mb-3 sm:mb-4">
            Join Our Mission
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Be part of a community that&apos;s shaping the future of women
            entrepreneurship
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button className="h-10 sm:h-12 bg-white text-primary hover:bg-white/90 font-semibold px-6 sm:px-8 text-sm sm:text-base">
              Become a Member
            </Button>
            <Button
              variant="outline"
              className="h-10 sm:h-12 border-2 border-white text-primary hover:bg-white/10 font-semibold px-6 sm:px-8 text-sm sm:text-base"
            >
              Partner With Us
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </section>
  )
}

export default Cta