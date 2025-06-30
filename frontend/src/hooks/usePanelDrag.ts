import { useState, useRef, useEffect, useCallback } from "react";

enum PanelHeight {
  MINIMIZED = 5,
  EXPANDED = 30,
  FULL_SCREEN = 75,
}

const SNAP_THRESHOLDS = {
  MINIMIZED: 30,
  EXPANDED: 75,
} as const;

interface UsePanelDragProps {
  isMobile: boolean;
  selectedPlaceId: string | null;
}

export function usePanelDrag({ isMobile, selectedPlaceId }: UsePanelDragProps) {
  // panel drag state
  const [panelHeight, setPanelHeight] = useState<number>(PanelHeight.EXPANDED);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // touch event handlers for drag
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;

    // allow swipe up/down to trigger drag in the bottom 90% of the screen
    const touchY = e.touches[0].clientY;
    const screenHeight = window.innerHeight;
    const triggerZone = screenHeight * 0.1;

    if (touchY < triggerZone) return;

    // don't set isDragging immediately - wait for movement
    setStartY(e.touches[0].clientY);
    setStartHeight(panelHeight);
  }, [isMobile, panelHeight]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile || startY === 0) return;

    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY; // positive when dragging up

    if (!isDragging && Math.abs(deltaY) > 15) {
      // special handling when panel is at full screen and dragging down
      if (panelHeight >= PanelHeight.FULL_SCREEN && deltaY < 0) {
        const isContentAtTop = contentRef.current
          ? contentRef.current.scrollTop <= 5
          : false;

        console.log("Drag down attempt:", {
          isContentAtTop,
          startY,
          scrollTop: contentRef.current?.scrollTop,
        });

        // if content is NOT at top, only allow drag if touch started near handle
        if (!isContentAtTop) {
          const panelRect = panelRef.current?.getBoundingClientRect();
          const dragHandleZone = panelRect
            ? panelRect.top + 60
            : window.innerHeight * 0.3;
          const touchStartedNearHandle = startY <= dragHandleZone;

          // block drag - let content scroll instead
          if (!touchStartedNearHandle) {
            return;
          }
        }
      }

      setIsDragging(true);
    }

    if (!isDragging) return;

    const newHeight = Math.max(
      PanelHeight.MINIMIZED,
      Math.min(
        PanelHeight.FULL_SCREEN,
        startHeight + (deltaY / window.innerHeight) * 100
      )
    );

    setPanelHeight(newHeight);

    if (Math.abs(deltaY) > 10) {
      try {
        e.preventDefault();
      } catch (error) {
        console.error("Error preventing default touch event:", error);
      }
    }
  }, [isMobile, startY, isDragging, panelHeight, startHeight]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return;

    if (isDragging) {
      if (panelHeight < SNAP_THRESHOLDS.MINIMIZED) {
        setPanelHeight(PanelHeight.MINIMIZED);
      } else if (panelHeight < SNAP_THRESHOLDS.EXPANDED) {
        setPanelHeight(PanelHeight.EXPANDED);
      } else {
        setPanelHeight(PanelHeight.FULL_SCREEN);
      }
    }

    setIsDragging(false);
    setStartY(0);
  }, [isMobile, isDragging, panelHeight]);

  // expand to full screen when a place is selected
  useEffect(() => {
    if (selectedPlaceId) {
      console.log(
        "Setting panel to full screen, selectedPlaceId:",
        selectedPlaceId
      );
      setPanelHeight(PanelHeight.FULL_SCREEN);
    }
  }, [selectedPlaceId]);

  return {
    panelHeight,
    isDragging,
    panelRef,
    contentRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    PanelHeight,
  };
}