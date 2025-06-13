import { QueryClient } from '@tanstack/react-query';

import { CustomApiError } from '../model/api-error.model';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        // console.log({ ...error });

        if (error instanceof CustomApiError && error.code === 401) {
          return false;
        }

        // Для других ошибок - до 2 повторных попыток
        return failureCount < 1;
      },
    },
    mutations: {
      retry: (failureCount, error) => {
        if (error instanceof CustomApiError && error.code === 401) {
          return false;
        }

        // Для других ошибок - до 2 повторных попыток
        return failureCount < 1;
      },
    },
  },
});
