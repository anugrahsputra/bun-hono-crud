interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error_detail?: any;
}

function createApiResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  error_detail?: any,
): ApiResponse<T> {
  const response: ApiResponse<T> = {
    success,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (error_detail !== undefined) {
    response.error_detail = error_detail;
  }

  return response;
}

function successResponse<T>(message: string, data?: T): ApiResponse<T> {
  return createApiResponse(true, message, data);
}

function errorResponse(message: string, error_detail?: any): ApiResponse {
  return createApiResponse(false, message, undefined, error_detail);
}

export { successResponse, errorResponse, ApiResponse, createApiResponse };
