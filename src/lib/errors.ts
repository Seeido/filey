export type ErrorKind =
  | "validation"
  | "unauthorized"
  | "not_found"
  | "conflict";

export class AppError extends Error {
  readonly kind: ErrorKind;

  constructor(kind: ErrorKind, message: string) {
    super(message);
    this.kind = kind;
    this.name = "AppError";
  }
}
