import { apiInstance } from '@/shared/api/base';

export const filmPurchaseApi = {
  createFilmPayment: (data: {
    userId: number;
    filmId: number;
    redirectUrl?: string;
  }) =>
    apiInstance.post<{
      success: true;
      message: string;
      paymentUrl: string;
      orderId: string;
    }>('/payments/film/create', data),
};
