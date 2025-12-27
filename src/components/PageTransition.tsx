import { useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [displayKey, setDisplayKey] = useState(location.key);

  useEffect(() => {
    if (location.key !== displayKey) {
      setIsVisible(false);
      const timeout = setTimeout(() => {
        setDisplayKey(location.key);
        setIsVisible(true);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [location.key, displayKey]);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2"
      )}
    >
      {children}
    </div>
  );
}
