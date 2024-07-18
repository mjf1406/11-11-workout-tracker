import { Ban } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "~/components/ui/dialog";

export default function CancelWorkout() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>
          <Ban /> <span className="hidden pl-2 sm:inline">Cancel workout</span>
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
            <Button variant={"destructive"} asChild>
              <Link href="/">Cancel workout</Link>
            </Button>
          </DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
