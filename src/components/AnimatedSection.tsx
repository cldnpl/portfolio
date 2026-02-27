import { useEffect, useRef, useState, ReactNode, forwardRef } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedSection = forwardRef<HTMLDivElement, AnimatedSectionProps>(
  ({ children, className = "", delay = 0 }, forwardedRef) => {
    const [visible, setVisible] = useState(false);
    const internalRef = useRef<HTMLDivElement>(null);

    const setRefs = (node: HTMLDivElement | null) => {
      (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setVisible(true); },
        { threshold: 0.15 }
      );
      if (internalRef.current) observer.observe(internalRef.current);
      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={setRefs}
        className={className}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: `all 0.6s ease-out ${delay}ms`,
        }}
      >
        {children}
      </div>
    );
  }
);

AnimatedSection.displayName = "AnimatedSection";

export default AnimatedSection;
