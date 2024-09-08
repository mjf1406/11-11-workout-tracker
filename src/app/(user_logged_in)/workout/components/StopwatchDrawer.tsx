import React from "react";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";

interface StopwatchDrawerProps {
  isRunning: boolean;
  time: number;
  onStop: () => void;
  onClose: () => void;
  exerciseName: string;
}

export const StopwatchDrawer: React.FC<StopwatchDrawerProps> = ({
  isRunning,
  time,
  onStop,
  onClose,
  exerciseName,
}) => {
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Drawer open={isRunning} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{exerciseName}</DrawerTitle>
          <DrawerDescription className="text-center text-9xl">
            {formatTime(time)}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex flex-row items-center justify-center">
          <Button onClick={onStop} className="w-36">
            Done
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
