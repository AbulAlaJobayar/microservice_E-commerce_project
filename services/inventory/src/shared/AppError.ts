class AppError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string, stuck = "") {
    super(message);
    this.statusCode = statusCode;
    if (stuck) {
      this.stack = stuck;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export default AppError
