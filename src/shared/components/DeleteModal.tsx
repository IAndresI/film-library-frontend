import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

export const DeleteModal = ({
  title,
  description,
  onDelete,
}: {
  title: string;
  description: string;
  onDelete: () => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start" variant="ghost">
          Удалить
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onDelete} type="submit">
            Удалить
          </Button>
          <Button type="submit">Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
