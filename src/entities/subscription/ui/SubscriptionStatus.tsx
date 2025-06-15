import type { SubscriptionStatusType } from '@/entities/subscription/model';

import React from 'react';

import { cn } from '@/shared/lib/utils';

const statuses = {
  active: {
    styles: 'bg-green-100 text-green-800 border-green-300',
    label: 'Активна',
  },
  cancelled: {
    styles: 'bg-red-100 text-red-800 border-red-300',
    label: 'Отменена',
  },
  expired: {
    styles: 'bg-muted text-muted-foreground border-border',
    label: 'Истекла',
  },
};

interface ISubscriptionStatusProps extends React.ComponentProps<'div'> {
  status: SubscriptionStatusType;
  size?: 'small' | 'normal';
}

export const SubscriptionStatus = ({
  status,
  size = 'normal',
  className,
  children,
  ...props
}: ISubscriptionStatusProps) => {
  const currentStatus = statuses[status];
  return (
    <div
      {...props}
      className={cn(
        'flex items-center justify-center rounded',
        currentStatus?.styles,
        size === 'small'
          ? 'h-6 w-[120px] text-xs'
          : 'h-10 w-[150px] border text-base',
        className
      )}
    >
      {children || currentStatus?.label || 'Неизвестный статус'}
    </div>
  );
};
