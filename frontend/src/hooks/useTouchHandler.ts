import { useRef } from "react";

interface UseTouchHandlerProps {
  onClick: (event?: any) => void;
}

export const useTouchHandler = ({ onClick }: UseTouchHandlerProps) => {
  const touchStartedRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartedRef.current = true;
    e.preventDefault();
    // Immediate visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.transform = 'scale(0.95)';
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      const target = e.currentTarget as HTMLElement;
      target.style.transform = '';
      // Trigger click immediately on touch end
      setTimeout(() => {
        onClick({} as any);
      }, 0);
      touchStartedRef.current = false;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only handle if not from touch
    if (!touchStartedRef.current) {
      e.preventDefault();
      onClick(e);
    }
  };

  return {
    handleTouchStart,
    handleTouchEnd,
    handleClick
  };
};