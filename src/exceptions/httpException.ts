class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

function notFoundException(message = "Resource not found") {
  return new HttpException(404, message);
}

export { HttpException, notFoundException };
