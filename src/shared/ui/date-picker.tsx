import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import type { SelectSingleEventHandler } from "react-day-picker";

interface IDatepickerProps {
  date: Date;
  setDate: SelectSingleEventHandler;
  buttonClassName?: string;
}

export const DatePicker = ({
  buttonClassName,
  date,
  setDate,
}: IDatepickerProps) => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(!date && "text-muted-foreground", buttonClassName)}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          captionLayout="dropdown-months"
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          fromYear={1867}
          toYear={new Date().getFullYear()}
          className="w-[305px]"
          classNames={{
            dropdown:
              "dark:[&_option]:bg-neutral-950 text-xs [&_option]:white flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-neutral-200 bg-transparent px-1 py-2 text-sm shadow-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:border-neutral-800 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300",
            dropdown_year: "flex w-full",
            dropdown_month: "flex w-full",
            caption_dropdowns: "grid grid-cols-2 gap-2 max-w-[200px] w-full",
            vhidden: "col-span-2 hidden text-center",
            caption_label: "hidden",
            table: "[&_td]:w-full [&_th]:w-full [&_button]:w-full w-full",
            caption_end: "w-full",
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
