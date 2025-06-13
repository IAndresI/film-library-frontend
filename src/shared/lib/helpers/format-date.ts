import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatDate(input: string | number, withTime?: boolean): string {
  const date = new Date(input);

  const formatString = withTime ? 'PPP HH:mm:ss' : 'PPP';

  return format(date, formatString, {
    locale: ru,
  });
}
