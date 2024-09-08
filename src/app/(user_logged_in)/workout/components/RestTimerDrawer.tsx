import React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import { Button } from "~/components/ui/button";
import { Timer } from "lucide-react";
import { SECOND } from "~/lib/constants";

interface RestTimerDrawerProps {
  isResting: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  restTimer: number;
  onAdjustRest: (adjustment: number) => void;
  onSkipRest: () => void;
}

export const RestTimerDrawer: React.FC<RestTimerDrawerProps> = ({
  isResting,
  isOpen,
  onOpenChange,
  restTimer,
  onAdjustRest,
  onSkipRest,
}) => {
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSkipRest = () => {
    onSkipRest();
    onOpenChange(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="p-4 text-center">
          <h2 className="mb-4 text-2xl font-bold">Rest Timer</h2>
          <div className="mb-4 text-4xl">
            {formatTime(Math.max(0, restTimer))}
          </div>
          <div className="mb-4 flex justify-center space-x-2">
            <Button
              variant={"secondary"}
              onClick={() => onAdjustRest(-SECOND * 30)}
              disabled={restTimer <= 0}
            >
              -30s
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => onAdjustRest(-SECOND * 10)}
              disabled={restTimer <= 0}
            >
              -10s
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => onAdjustRest(SECOND * 10)}
            >
              +10s
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => onAdjustRest(SECOND * 30)}
            >
              +30s
            </Button>
          </div>
          <Button onClick={handleSkipRest}>Skip Rest</Button>
        </div>
      </DrawerContent>
      {isResting && !isOpen && (
        <DrawerTrigger asChild>
          <Button
            className="fixed bottom-4 right-4 rounded-full p-3"
            onClick={() => onOpenChange(true)}
          >
            <Timer className="h-6 w-6" />
            <span className="ml-2">{formatTime(Math.max(0, restTimer))}</span>
          </Button>
        </DrawerTrigger>
      )}
    </Drawer>
  );
};
