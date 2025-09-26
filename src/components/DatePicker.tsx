import React from 'react';
import { format } from 'date-fns@4.1.0';
import { es } from 'date-fns@4.1.0/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from './ui/utils';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface DatePickerProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({ date, onSelect, placeholder = "Seleccionar fecha", disabled }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center justify-start gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
          "h-9 px-4 py-2 w-full text-left font-normal",
          !date && "text-muted-foreground"
        )}
        disabled={disabled}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: es }) : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}