export interface ApiError {
  code: number;
  message: string;
}

export class CustomApiError extends Error {
  code: number;
  message: string;

  constructor(error: ApiError) {
    super(error.message);
    this.code = error.code;
    this.message = error.message;
  }
}
