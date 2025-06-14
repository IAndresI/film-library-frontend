import type { DayPickerProps, Modifiers } from 'react-day-picker';

import * as React from 'react';
import { differenceInCalendarDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CalendarDay,
  DayPicker,
  labelNext,
  labelPrevious,
  useDayPicker,
} from 'react-day-picker';

import { cn } from '../lib/utils';
import { Button, buttonVariants } from './button';

export type CalendarProps = DayPickerProps & {
  /**
   * In the year view, the number of years to display at once.
   * @default 12
   */
  yearRange?: number;

  /**
   * Wether to show the year switcher in the caption.
   * @default true
   */
  showYearSwitcher?: boolean;

  monthsClassName?: string;
  monthCaptionClassName?: string;
  weekdaysClassName?: string;
  weekdayClassName?: string;
  monthClassName?: string;
  captionClassName?: string;
  captionLabelClassName?: string;
  buttonNextClassName?: string;
  buttonPreviousClassName?: string;
  navClassName?: string;
  monthGridClassName?: string;
  weekClassName?: string;
  dayClassName?: string;
  dayButtonClassName?: string;
  rangeStartClassName?: string;
  rangeEndClassName?: string;
  selectedClassName?: string;
  todayClassName?: string;
  outsideClassName?: string;
  disabledClassName?: string;
  rangeMiddleClassName?: string;
  hiddenClassName?: string;
};

type NavView = 'days' | 'years';

/**
 * A custom calendar component built on top of react-day-picker.
 * @param props The props for the calendar.
 * @default yearRange 12
 * @returns
 */
function Calendar({
  className,
  showOutsideDays = true,
  showYearSwitcher = true,
  yearRange = 12,
  numberOfMonths,
  ...props
}: CalendarProps) {
  const [navView, setNavView] = React.useState<NavView>('days');
  const [displayYears, setDisplayYears] = React.useState<{
    from: number;
    to: number;
  }>(
    React.useMemo(() => {
      const currentYear = new Date().getFullYear();
      return {
        from: currentYear - Math.floor(yearRange / 2 - 1),
        to: currentYear + Math.ceil(yearRange / 2),
      };
    }, [yearRange])
  );

  // Определяем начальный месяц на основе выбранной даты
  const defaultMonth = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const selected = (props as any).selected;
    if (selected) {
      if (
        typeof selected === 'object' &&
        selected !== null &&
        'from' in selected
      ) {
        // Range selection
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (selected as any).from || (selected as any).to || new Date();
      } else if (selected instanceof Date) {
        // Single date selection
        return selected;
      }
    }
    return undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, [(props as any).selected]);

  const {
    // onNextClick,
    onPrevClick,
    startMonth,
    endMonth,
  } = props;

  const columnsDisplayed = navView === 'years' ? 1 : numberOfMonths;

  const _monthsClassName = cn('relative flex', props.monthsClassName);
  const _monthCaptionClassName = cn(
    'relative mx-10 flex h-7 items-center justify-center',
    props.monthCaptionClassName
  );
  const _weekdaysClassName = cn('flex flex-row', props.weekdaysClassName);
  const _weekdayClassName = cn(
    'w-8 text-sm font-normal capitalize text-muted-foreground',
    props.weekdayClassName
  );
  const _monthClassName = cn('w-full', props.monthClassName);
  const _captionClassName = cn(
    'relative flex items-center justify-center pt-1',
    props.captionClassName
  );
  const _captionLabelClassName = cn(
    'truncate text-sm font-medium',
    props.captionLabelClassName
  );
  const buttonNavClassName = buttonVariants({
    variant: 'outline',
    className:
      'absolute h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
  });
  const _buttonNextClassName = cn(
    buttonNavClassName,
    'right-0',
    props.buttonNextClassName
  );
  const _buttonPreviousClassName = cn(
    buttonNavClassName,
    'left-0',
    props.buttonPreviousClassName
  );
  const _navClassName = cn('flex items-start', props.navClassName);
  const _monthGridClassName = cn('mx-auto mt-4', props.monthGridClassName);
  const _weekClassName = cn('mt-2 flex w-max items-start', props.weekClassName);
  const _dayClassName = cn(
    'flex size-8 flex-1 items-center justify-center p-0 text-sm ',
    props.dayClassName
  );
  const _dayButtonClassName = cn(
    'size-8 cursor-pointer transition rounded font-medium leading-[18px] hover:bg-accent-100 text-base',
    props.dayButtonClassName
  );
  const buttonRangeClassName =
    '[&>button]:bg-accent [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground';
  const _rangeStartClassName = cn(
    buttonRangeClassName,
    'day-range-start aria-selected:bg-accent rounded-l aria-selected:text-primary-foreground',
    props.rangeStartClassName
  );
  const _rangeEndClassName = cn(
    buttonRangeClassName,
    'day-range-end aria-selected:bg-accent rounded-r aria-selected:text-primary-foreground',
    props.rangeEndClassName
  );
  const _rangeMiddleClassName = cn(
    'bg-accent-100 !text-foreground [&>button]:bg-transparent [&>button]:!text-foreground [&>button]:hover:bg-transparent [&>button]:hover:!text-foreground',
    props.rangeMiddleClassName
  );
  const _selectedClassName = cn(
    '[&>button]:bg-accent [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground',
    props.selectedClassName
  );
  const _todayClassName = cn(
    '[&>button]:bg-accent-100 [&>button]:text-accent-foreground',
    props.todayClassName
  );
  const _outsideClassName = cn(
    'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
    props.outsideClassName
  );
  const _disabledClassName = cn(
    'text-muted-foreground opacity-50',
    props.disabledClassName
  );
  const _hiddenClassName = cn('invisible flex-1', props.hiddenClassName);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      defaultMonth={defaultMonth}
      className={cn('px-4 pb-6', className)}
      style={{
        width: 248.8 * (columnsDisplayed ?? 1) + 'px',
      }}
      classNames={{
        months: _monthsClassName,
        month_caption: _monthCaptionClassName,
        weekdays: _weekdaysClassName,
        weekday: _weekdayClassName,
        month: _monthClassName,
        caption: _captionClassName,
        caption_label: _captionLabelClassName,
        button_next: _buttonNextClassName,
        button_previous: _buttonPreviousClassName,
        nav: _navClassName,
        month_grid: _monthGridClassName,
        week: _weekClassName,
        day: _dayClassName,
        day_button: _dayButtonClassName,
        range_start: _rangeStartClassName,
        range_middle: _rangeMiddleClassName,
        range_end: _rangeEndClassName,
        selected: _selectedClassName,
        today: _todayClassName,
        outside: _outsideClassName,
        disabled: _disabledClassName,
        hidden: _hiddenClassName,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
        Nav: ({ className }) => (
          <Nav
            className={className}
            displayYears={displayYears}
            navView={navView}
            setDisplayYears={setDisplayYears}
            startMonth={startMonth}
            endMonth={endMonth}
            onPrevClick={onPrevClick}
          />
        ),
        CaptionLabel: (props) => (
          <CaptionLabel
            showYearSwitcher={showYearSwitcher}
            navView={navView}
            setNavView={setNavView}
            displayYears={displayYears}
            {...props}
          />
        ),
        MonthGrid: ({ className, children, ...props }) => (
          <MonthGrid
            children={children}
            className={className}
            displayYears={displayYears}
            startMonth={startMonth}
            endMonth={endMonth}
            navView={navView}
            setNavView={setNavView}
            {...props}
          />
        ),
        Day: Day,
        Weekday: Weekday,
      }}
      numberOfMonths={columnsDisplayed}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

function Nav({
  className,
  navView,
  startMonth,
  endMonth,
  displayYears,
  setDisplayYears,
  onPrevClick,
  onNextClick,
}: {
  className?: string;
  navView: NavView;
  startMonth?: Date;
  endMonth?: Date;
  displayYears: { from: number; to: number };
  setDisplayYears: React.Dispatch<
    React.SetStateAction<{ from: number; to: number }>
  >;
  onPrevClick?: (date: Date) => void;
  onNextClick?: (date: Date) => void;
}) {
  const { nextMonth, previousMonth, goToMonth } = useDayPicker();

  const isPreviousDisabled = (() => {
    if (navView === 'years') {
      return (
        (startMonth &&
          differenceInCalendarDays(
            new Date(displayYears.from - 1, 0, 1),
            startMonth
          ) < 0) ||
        (endMonth &&
          differenceInCalendarDays(
            new Date(displayYears.from - 1, 0, 1),
            endMonth
          ) > 0)
      );
    }
    return !previousMonth;
  })();

  const isNextDisabled = (() => {
    if (navView === 'years') {
      return (
        (startMonth &&
          differenceInCalendarDays(
            new Date(displayYears.to + 1, 0, 1),
            startMonth
          ) < 0) ||
        (endMonth &&
          differenceInCalendarDays(
            new Date(displayYears.to + 1, 0, 1),
            endMonth
          ) > 0)
      );
    }
    return !nextMonth;
  })();

  const handlePreviousClick = React.useCallback(() => {
    if (!previousMonth) return;
    if (navView === 'years') {
      setDisplayYears((prev) => ({
        from: prev.from - (prev.to - prev.from + 1),
        to: prev.to - (prev.to - prev.from + 1),
      }));
      onPrevClick?.(
        new Date(
          displayYears.from - (displayYears.to - displayYears.from),
          0,
          1
        )
      );
      return;
    }
    goToMonth(previousMonth);
    onPrevClick?.(previousMonth);
  }, [previousMonth, goToMonth]);

  const handleNextClick = React.useCallback(() => {
    if (!nextMonth) return;
    if (navView === 'years') {
      setDisplayYears((prev) => ({
        from: prev.from + (prev.to - prev.from + 1),
        to: prev.to + (prev.to - prev.from + 1),
      }));
      onNextClick?.(
        new Date(
          displayYears.from + (displayYears.to - displayYears.from),
          0,
          1
        )
      );
      return;
    }
    goToMonth(nextMonth);
    onNextClick?.(nextMonth);
  }, [goToMonth, nextMonth]);
  return (
    <nav className={cn('flex items-center', className)}>
      <Button
        className="absolute top-[2px] left-0 size-6 min-h-[24px] min-w-[24px] border-none bg-transparent p-0 text-[#ACB5BD] opacity-80 hover:opacity-100"
        type="button"
        variant="outline"
        tabIndex={isPreviousDisabled ? undefined : -1}
        disabled={isPreviousDisabled}
        aria-label={
          navView === 'years'
            ? `Go to the previous ${
                displayYears.to - displayYears.from + 1
              } years`
            : labelPrevious(previousMonth)
        }
        onClick={handlePreviousClick}
      >
        <ChevronLeft />
      </Button>

      <Button
        className="absolute top-[2px] right-0 size-6 min-h-[24px] min-w-[24px] border-none bg-transparent p-0 text-[#ACB5BD] opacity-80 hover:opacity-100"
        type="button"
        variant="outline"
        tabIndex={isNextDisabled ? undefined : -1}
        disabled={isNextDisabled}
        aria-label={
          navView === 'years'
            ? `Go to the next ${displayYears.to - displayYears.from + 1} years`
            : labelNext(nextMonth)
        }
        onClick={handleNextClick}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}

function CaptionLabel({
  children,
  showYearSwitcher,
  navView,
  setNavView,
  displayYears,
  ...props
}: {
  showYearSwitcher?: boolean;
  navView: NavView;
  setNavView: React.Dispatch<React.SetStateAction<NavView>>;
  displayYears: { from: number; to: number };
} & React.HTMLAttributes<HTMLSpanElement>) {
  if (!showYearSwitcher) return <span {...props}>{children}</span>;
  return (
    <Button
      className="h-7 w-full truncate border-none text-sm font-medium capitalize"
      variant="outline"
      size="sm"
      onClick={() => setNavView((prev) => (prev === 'days' ? 'years' : 'days'))}
    >
      {navView === 'days'
        ? children
        : displayYears.from + ' - ' + displayYears.to}
    </Button>
  );
}

function MonthGrid({
  className,
  children,
  displayYears,
  startMonth,
  endMonth,
  navView,
  setNavView,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  displayYears: { from: number; to: number };
  startMonth?: Date;
  endMonth?: Date;
  navView: NavView;
  setNavView: React.Dispatch<React.SetStateAction<NavView>>;
} & React.TableHTMLAttributes<HTMLTableElement>) {
  if (navView === 'years') {
    return (
      <YearGrid
        displayYears={displayYears}
        startMonth={startMonth}
        endMonth={endMonth}
        setNavView={setNavView}
        navView={navView}
        className={className}
        {...props}
      />
    );
  }
  return (
    <table
      className={className}
      {...props}
    >
      {children}
    </table>
  );
}

function YearGrid({
  className,
  displayYears,
  startMonth,
  endMonth,
  setNavView,
  navView,
  ...props
}: {
  className?: string;
  displayYears: { from: number; to: number };
  startMonth?: Date;
  endMonth?: Date;
  setNavView: React.Dispatch<React.SetStateAction<NavView>>;
  navView: NavView;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { goToMonth, selected } = useDayPicker();

  return (
    <div
      className={cn('grid grid-cols-4 gap-y-2', className)}
      {...props}
    >
      {Array.from(
        { length: displayYears.to - displayYears.from + 1 },
        (_, i) => {
          const isBefore =
            differenceInCalendarDays(
              new Date(displayYears.from + i, 11, 31),
              startMonth!
            ) < 0;

          const isAfter =
            differenceInCalendarDays(
              new Date(displayYears.from + i, 0, 0),
              endMonth!
            ) > 0;

          const isDisabled = isBefore || isAfter;
          return (
            <Button
              key={i}
              className={cn(
                'h-7 w-full border-none text-sm font-normal',
                displayYears.from + i === new Date().getFullYear() &&
                  'bg-accent text-white'
              )}
              variant="outline"
              onClick={() => {
                setNavView('days');
                if (selected) {
                  if ('to' in selected) {
                    const selectedDate =
                      (selected as { from?: Date; to?: Date })?.from ||
                      (selected as { from?: Date; to?: Date })?.to;
                    goToMonth(
                      new Date(
                        displayYears.from + i,
                        selectedDate?.getMonth() ?? 0,
                        1
                      )
                    );
                  } else {
                    goToMonth(
                      new Date(
                        displayYears.from + i,
                        (selected as Date)?.getMonth() ?? 0,
                        1
                      )
                    );
                  }
                } else {
                  goToMonth(new Date(displayYears.from + i, 0, 1));
                }
              }}
              disabled={navView === 'years' ? isDisabled : undefined}
            >
              {displayYears.from + i}
            </Button>
          );
        }
      )}
    </div>
  );
}

function Weekday({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(className, {
        'text-critic-200': props.children === 'вс' || props.children === 'сб',
      })}
      {...props}
    />
  );
}

function Day(
  props: {
    day: CalendarDay;
    modifiers: Modifiers;
  } & React.HTMLAttributes<HTMLDivElement>
) {
  const { day, className, ...tdProps } = props;

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <td
      className={cn(className, isWeekend(day.date) ? 'text-critic' : 'inherit')}
      {...tdProps}
    />
  );
}

export { Calendar };
