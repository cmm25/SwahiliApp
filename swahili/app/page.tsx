import {
  DrawingCanvas,
  AnimatedBrain,
  AnimatedBook,
  AnimatedPlant,
  AnimatedStar,
  AnimatedSparkle,
  FloatingElement
} from '@/components/features/landingpage/AnimatedDoodles';
import { HandDrawnButton } from '@/components/features/landingpage/HandDrawnButton';
import { AnimatedCounter } from '@/components/features/landingpage/TextAnimations';
import { MouseFollower, CursorGlow, ParallaxElement } from '@/components/features/landingpage/InteractiveEffects';

const Index = () => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative">
      {/* Cursor glow effect */}
      <CursorGlow />

      {/* Animated drawing canvas background */}
      <DrawingCanvas className="z-0" />

      {/* Hand-drawn border frame with animation */}
      <svg
        className="absolute inset-4 md:inset-8 lg:inset-12 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] h-[calc(100%-2rem)] md:h-[calc(100%-4rem)] lg:h-[calc(100%-6rem)] pointer-events-none z-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M1 1.5 Q 0.5 0, 99 1 Q 100 0.5, 99.5 99 Q 100 100, 1 99.5 Q 0 100, 1 1.5"
          stroke="currentColor"
          strokeWidth="0.2"
          fill="none"
          vectorEffect="non-scaling-stroke"
          className="text-foreground/40"
          strokeDasharray="1000"
          strokeDashoffset="0"
          style={{
            animation: 'draw-in 2s ease-out forwards',
          }}
        />
      </svg>

      {/* Navigation */}
      <nav className="absolute top-6 md:top-10 lg:top-14 left-6 md:left-12 lg:left-16 right-6 md:right-12 lg:right-16 flex justify-between items-center z-20">
        <div className="font-hand text-2xl md:text-3xl text-foreground flex items-center gap-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <AnimatedStar delay={0.5} className="w-6 h-6 md:w-8 md:h-8 text-foreground" />
          <span>Swahili</span>
        </div>

        <div className="hidden md:flex gap-6 lg:gap-10 font-hand-secondary text-base lg:text-lg text-foreground">
          {['Nyumbani', 'Jifunze', 'Kuhusu', 'Wasiliana'].map((item, i) => (
            <a
              key={item}
              href="#"
              className="relative group opacity-0 animate-fade-in-up hover:text-accent transition-colors duration-300"
              style={{ animationDelay: `${0.3 + i * 0.1}s`, animationFillMode: 'forwards' }}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-foreground transition-all duration-300 group-hover:w-full" style={{ borderRadius: '2px' }} />
            </a>
          ))}
        </div>

        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
          <HandDrawnButton variant="primary" className="hidden md:block text-base lg:text-lg">
            Anza Sasa
          </HandDrawnButton>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-foreground p-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Main content */}
      <main className="h-full flex flex-col lg:flex-row items-center justify-center px-6 md:px-12 lg:px-20 xl:px-32 pt-20 lg:pt-0 gap-12 lg:gap-20">
        {/* Left side - Hero text */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl z-10 lg:pr-8 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4 lg:mb-6 animate-fade-in-up stagger-1" style={{ animationFillMode: 'backwards' }}>
            <span className="font-hand-secondary text-xs md:text-sm text-muted-foreground px-3 py-1.5 border border-border bg-card/50 backdrop-blur-sm flex items-center gap-2" style={{ borderRadius: '4px 10px 4px 10px' }}>
              <AnimatedSparkle delay={1.2} size={12} className="text-accent" />
              AI Powered
            </span>
          </div>

          {/* Main headline with staggered animation */}
          <h1 className="font-hand text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-8xl text-foreground leading-[0.85] mb-4 lg:mb-6">
            <span className="block animate-fade-in-up stagger-2" style={{ animationFillMode: 'backwards' }}>
              Jifunze
            </span>
            <span className="block relative animate-fade-in-up stagger-3" style={{ animationFillMode: 'backwards' }}>
              <span className="relative inline-block">
                Kiswahili
                {/* Animated underline */}
                <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-3 md:h-4 overflow-visible" viewBox="0 0 200 15" fill="none" preserveAspectRatio="none">
                  <path
                    d="M0 8 Q 40 2, 80 10 T 160 8 T 200 10"
                    stroke="hsl(var(--accent))"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    style={{
                      strokeDasharray: 300,
                      strokeDashoffset: 0,
                    }}
                  />
                </svg>
              </span>
            </span>
            <span className="block animate-fade-in-up stagger-4" style={{ animationFillMode: 'backwards' }}>
              kwa Urahisi
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-hand-secondary text-base md:text-lg lg:text-xl text-muted-foreground mb-6 lg:mb-8 max-w-md leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '1.3s', animationFillMode: 'forwards' }}>
            Kujifunza lugha ya Kiswahili kupitia AI ambayo inakuelewa na kukusaidia hatua kwa hatua.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-start opacity-0 animate-fade-in-up" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
            <HandDrawnButton variant="primary" size="lg" className="group">
              <span className="flex items-center gap-3">
                Jaribu Bure
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </HandDrawnButton>
          </div>

          {/* Social proof with animated counter */}
          {/* <div className="mt-8 lg:mt-12 flex items-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.7s', animationFillMode: 'forwards' }}>
            <div className="flex -space-x-3">
              {['👨🏿', '👩🏾', '👨🏽', '👩🏿'].map((emoji, i) => (
                <div
                  key={i}
                  className="w-9 h-9 md:w-11 md:h-11 bg-secondary border-2 border-background flex items-center justify-center font-hand text-base md:text-lg text-foreground shadow-sm transition-transform duration-300 hover:scale-110 hover:z-10"
                  style={{
                    borderRadius: '50%',
                    animationDelay: `${1.8 + i * 0.1}s`
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div className="font-hand-secondary text-sm md:text-base text-muted-foreground">
              <span className="text-foreground font-semibold">
                <AnimatedCounter end={2847} delay={2000} suffix="+" />
              </span>
              {' '}wanajifunza tayari
            </div>
          </div> */}
        </div>

        {/* Right side - Animated Illustrations */}
        <div className="hidden lg:flex flex-1 items-center justify-center relative max-w-lg xl:max-w-xl">
          <MouseFollower intensity={0.015} className="relative w-full aspect-square">
            {/* Central brain illustration */}
            <ParallaxElement speed={0.3} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <AnimatedBrain className="w-52 xl:w-64 h-52 xl:h-64 text-foreground" />
            </ParallaxElement>

            {/* Floating book */}
            <FloatingElement delay={0} amplitude={8} duration={4}>
              <ParallaxElement speed={-0.5} className="absolute -top-4 left-4">
                <AnimatedBook className="w-20 xl:w-24 h-24 xl:h-28 text-foreground transform -rotate-12" />
              </ParallaxElement>
            </FloatingElement>

            {/* Floating plant */}
            <FloatingElement delay={1} amplitude={6} duration={3.5}>
              <ParallaxElement speed={0.4} className="absolute bottom-0 right-0">
                <AnimatedPlant className="w-24 xl:w-28 h-28 xl:h-32 text-foreground" />
              </ParallaxElement>
            </FloatingElement>

            {/* Animated stars */}
            <FloatingElement delay={0.5} amplitude={5} duration={3}>
              <AnimatedStar delay={2} className="absolute top-8 right-8 w-8 xl:w-10 h-8 xl:h-10 text-accent animate-pulse-glow" />
            </FloatingElement>
            <FloatingElement delay={1.5} amplitude={4} duration={2.5}>
              <AnimatedStar delay={2.3} className="absolute bottom-28 left-8 w-6 h-6 text-accent/70" />
            </FloatingElement>
            <FloatingElement delay={2} amplitude={3} duration={4}>
              <AnimatedStar delay={2.6} className="absolute top-1/3 -right-4 w-5 h-5 text-foreground/50" />
            </FloatingElement>

            {/* Speech bubbles */}
            <FloatingElement delay={0.3} amplitude={5} duration={3.5}>
              <div
                className="absolute top-1/4 right-1/4 bg-card border-2 border-foreground p-3 transform rotate-3 shadow-md opacity-0 animate-fade-in-scale"
                style={{
                  borderRadius: '8px 14px 8px 4px',
                  animationDelay: '2s',
                  animationFillMode: 'forwards'
                }}
              >
                <p className="font-hand text-lg xl:text-xl text-foreground whitespace-nowrap">Habari!</p>
                {/* Speech bubble tail */}
                <svg className="absolute -bottom-3 left-4 w-6 h-4" viewBox="0 0 24 16" fill="none">
                  <path d="M0 0 Q 8 0, 12 16 Q 8 8, 24 4 L 0 0" fill="hsl(var(--card))" stroke="hsl(var(--foreground))" strokeWidth="2" />
                </svg>
              </div>
            </FloatingElement>

            <FloatingElement delay={0.8} amplitude={6} duration={4}>
              <div
                className="absolute bottom-1/4 left-1/6 bg-accent text-accent-foreground border-2 border-foreground p-3 transform -rotate-3 shadow-md opacity-0 animate-fade-in-scale"
                style={{
                  borderRadius: '4px 8px 14px 8px',
                  animationDelay: '2.3s',
                  animationFillMode: 'forwards'
                }}
              >
                <p className="font-hand text-lg xl:text-xl whitespace-nowrap">Karibu!</p>
                {/* Speech bubble tail */}
                <svg className="absolute -top-3 right-4 w-6 h-4 rotate-180" viewBox="0 0 24 16" fill="none">
                  <path d="M0 0 Q 8 0, 12 16 Q 8 8, 24 4 L 0 0" fill="hsl(var(--accent))" stroke="hsl(var(--foreground))" strokeWidth="2" />
                </svg>
              </div>
            </FloatingElement>

            {/* Additional decorative sparkles */}
            <AnimatedSparkle delay={2.5} size={16} className="absolute top-16 left-1/3 text-accent/60" />
            <AnimatedSparkle delay={2.8} size={12} className="absolute bottom-1/3 right-1/4 text-foreground/40" />
          </MouseFollower>
        </div>
      </main>

      {/* Bottom tagline */}
      <div className="absolute bottom-4 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '2.2s', animationFillMode: 'forwards' }}>
        <span className="font-hand-secondary text-xs md:text-sm text-muted-foreground tracking-wide">
          Made with ♥
        </span>
      </div>
    </div>
  );
};

export default Index;
