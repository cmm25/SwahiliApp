'use client';

import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const TypewriterText = ({ 
  text, 
  delay = 0, 
  speed = 50,
  className = "",
  onComplete
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          onComplete?.();
        }
      }, speed);
      
      return () => clearInterval(typeInterval);
    }, delay);
    
    return () => clearTimeout(startTimer);
  }, [text, delay, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {isTyping && (
        <span className="inline-block w-0.5 h-[1em] bg-current ml-1 animate-pulse" />
      )}
    </span>
  );
};

interface StaggeredTextProps {
  text: string;
  delay?: number;
  staggerDelay?: number;
  className?: string;
  wordClassName?: string;
}

export const StaggeredText = ({
  text,
  delay = 0,
  staggerDelay = 0.1,
  className = "",
  wordClassName = ""
}: StaggeredTextProps) => {
  const words = text.split(' ');
  
  return (
    <span className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline-block opacity-0 animate-fade-in-up ${wordClassName}`}
          style={{ 
            animationDelay: `${delay + (index * staggerDelay)}s`,
            animationFillMode: 'forwards'
          }}
        >
          {word}{index < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  );
};

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter = ({
  end,
  duration = 2000,
  delay = 0,
  suffix = '',
  className = ''
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let startTime: number | null = null;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [end, duration, delay]);

  return (
    <span className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};
