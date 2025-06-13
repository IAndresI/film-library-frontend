import { CustomApiError } from './api-error.model';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: CustomApiError;
  }
}
