import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useDrag } from '@/hooks/useDrag';

interface AdContentCardProps {
  handleAdClick: () => void;
  handleAdClose: () => void;
}

export function AdContentCard({ handleAdClick, handleAdClose }: AdContentCardProps) {
  const [isDraggingFeedback, setIsDraggingFeedback] = React.useState(false);
  const [isButtonClicked, setIsButtonClicked] = React.useState(false);

  const handleDragEnd = React.useCallback(
    (endX: number, endY: number, isDragged: boolean) => {
      if (isDragged && !isButtonClicked) {
        handleAdClose();
      }
      setIsDraggingFeedback(false);
      setIsButtonClicked(false);
    },
    [handleAdClose, isButtonClicked]
  );

  const {
    handleTouchStart,
    handleTouchMove,
    handleMouseDown,
    handleMouseMove,
    handleEnd,
    getTransformStyle,
    isDragging,
  } = useDrag(handleDragEnd);

  React.useEffect(() => {
    setIsDraggingFeedback(isDragging);
  }, [isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      handleMouseDown(e as React.MouseEvent);
    } else {
      handleTouchStart(e as unknown as React.TouchEvent);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      handleMouseMove(e as React.MouseEvent);
    } else {
      handleTouchMove(e as unknown as React.TouchEvent);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsButtonClicked(true);
    handleAdClick();
  };

  return (
    <Card
      className={`w-[320px] lg:w-[400px] transition-opacity duration-300 z-[1002] ${
        isDraggingFeedback ? 'opacity-50' : 'opacity-100'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handleEnd}
      onPointerLeave={handleEnd}
      style={{ transform: getTransformStyle() }}
    >
      <CardHeader className="tracking-tighter">
        <CardDescription>[광고]좌우로 드래그하면 사라져요~</CardDescription>
        <CardTitle>클릭하면 빅보너스 포인트</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-square bg-red-200 " style={{ pointerEvents: 'none' }}>
          <img
            src="/ad-sample.jpg"
            alt="Ad"
            className="object-cover w-full h-full"
            style={{ pointerEvents: 'none' }}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          className="bg-red-600 w-full py-8 font-semibold text-lg"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleButtonClick}
        >
          광고링크 확인하고 &nbsp; <span className="text-xl font-semibold"> 빅포인트</span> &nbsp;
          받기
        </Button>
        <div className="flex w-full justify-start items-center">
          <Button
            variant="outline"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              handleAdClose();
            }}
          >
            광고닫기
          </Button>
          <p className="flex-1 text-center text-sm tracking-tighter my-2 lg:hidden">
            좌우로 스와이프하거나
            <br />
            드래그해도 닫혀요
          </p>
          <p className="flex-1 text-center text-sm tracking-tighter my-2 hidden lg:block">
            좌우로 스와이프하거나 드래그해도 닫혀요
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
