import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import type { SelectSingleEventHandler } from "react-day-picker";
import { ru } from "date-fns/locale";

interface IDatepickerProps {
  date: Date;
  setDate: SelectSingleEventHandler;
  buttonClassName?: string;
  placeholder?: string;
}

export const DatePicker = ({
  buttonClassName,
  date,
  setDate,
  placeholder,
}: IDatepickerProps) => {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(!date && "text-muted-foreground", buttonClassName)}
        >
          <CalendarIcon />
          {date ? (
            format(date, "PPP")
          ) : (
            <span>{placeholder || "Выберите дату"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          fromYear={1867}
          toYear={new Date().getFullYear()}
          locale={ru}
        />
      </PopoverContent>
    </Popover>
  );
};
