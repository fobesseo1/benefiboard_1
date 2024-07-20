// hooks/useDrag.ts
import { useState, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

export function useDrag(onDragEnd: (endX: number, endY: number, isDragged: boolean) => void) {
  const [startPosition, setStartPosition] = useState<Position | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const dragThreshold = 30; // 드래그로 인식할 최소 이동 거리 (픽셀)
  const dragTimeThreshold = 300; // 드래그로 인식할 최소 시간 (밀리초)

  const handleStart = useCallback((x: number, y: number) => {
    setStartPosition({ x, y });
    setCurrentPosition({ x, y });
    startTimeRef.current = Date.now();
    setIsDragging(true);
  }, []);

  const handleMove = useCallback(
    (x: number, y: number) => {
      if (isDragging) {
        setCurrentPosition({ x, y });
      }
    },
    [isDragging]
  );

  const handleEnd = useCallback(() => {
    if (startPosition && currentPosition && startTimeRef.current) {
      const dx = currentPosition.x - startPosition.x;
      const dy = currentPosition.y - startPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const duration = Date.now() - startTimeRef.current;

      const isDragged =
        distance > dragThreshold ||
        (Math.abs(dx) > Math.abs(dy) && distance > dragThreshold / 2) ||
        duration > dragTimeThreshold;

      onDragEnd(currentPosition.x, currentPosition.y, isDragged);
    }
    setStartPosition(null);
    setCurrentPosition(null);
    setIsDragging(false);
    startTimeRef.current = null;
  }, [startPosition, currentPosition, onDragEnd]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e && e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
      }
    },
    [handleStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e && e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      }
    },
    [handleMove]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleStart(e.clientX, e.clientY);
    },
    [handleStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    },
    [handleMove]
  );

  const getTransformStyle = useCallback(() => {
    if (startPosition && currentPosition) {
      const dx = currentPosition.x - startPosition.x;
      const dy = currentPosition.y - startPosition.y;
      return `translate(${dx}px, ${dy}px)`;
    }
    return '';
  }, [startPosition, currentPosition]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleMouseDown,
    handleMouseMove,
    handleEnd,
    getTransformStyle,
    isDragging,
  };
}
