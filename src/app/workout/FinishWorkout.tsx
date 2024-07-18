import { BicepsFlexed } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";

export default function FinishWorkout() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <BicepsFlexed />{" "}
          <span className="hidden pl-2 sm:inline">Finish workout</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <DialogFooter>
            {/* {loading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Creating...
                </Button>
              ) : (
                <Button type="submit" onClick={handleCreateClass}>
                  Create class
                </Button>
              )} */}
            <Button variant={"default"}>Finish workout</Button>
          </DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
