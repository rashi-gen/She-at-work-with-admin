export const HeroStats = () => {
  return (
    <section className=" border-t border-border">
      <div className="mx-auto px-5 py-10">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-10 sm:gap-24">

          {/* Stories */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-end text-foreground">
              <span className="text-4xl sm:text-6xl font-normal">8</span>
              <span className="text-3xl sm:text-5xl font-medium ml-0.5">75</span>
              <span className="text-3xl sm:text-5xl font-medium ml-0.5">+</span>
            </div>
            <span className="mt-3 text-md font-medium text-muted-foreground">
              Stories
            </span>
          </div>

          {/* Contributors */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-end text-foreground">
              <span className="text-3xl sm:text-5xl font-medium">1</span>
              <span className="text-3xl sm:text-5xl font-medium ml-0.5">21</span>
              <span className="text-3xl sm:text-5xl font-medium ml-0.5">+</span>
            </div>
            <span className="mt-4 text-md font-medium text-muted-foreground">
              Contributors
            </span>
          </div>

          {/* Community */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-end text-foreground">
              <span className="text-4xl sm:text-6xl font-normal">5</span>
              <span className="text-3xl sm:text-5xl font-medium ml-0.5">0</span>
              <span className="text-3xl sm:text-5xl font-medium ml-0.5">k+</span>
            </div>
            <span className="mt-3 text-md font-medium text-muted-foreground">
              Community Members
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
