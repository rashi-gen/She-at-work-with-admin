export const HeroWaves = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 600"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pink wave 1 */}
      <path
        d="M0,300 C240,220 480,380 720,330 960,280 1200,200 1440,260 L1440,0 L0,0 Z"
        fill="rgba(255, 200, 220, 0.12)"
      />

      {/* Magenta wave 2 */}
      <path
        d="M0,360 C260,300 520,420 780,360 1040,300 1260,260 1440,300 L1440,0 L0,0 Z"
        fill="rgba(255, 150, 200, 0.10)"
      />

      {/* Rose wave 3 */}
      <path
        d="M0,420 C300,360 600,460 900,400 1200,340 1320,300 1440,340 L1440,0 L0,0 Z"
        fill="rgba(255, 120, 170, 0.08)"
      />
    </svg>
  );
};
