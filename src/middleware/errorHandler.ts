import type { ErrorRequestHandler } from "express";
import { AppError, type ErrorKind } from "../lib/errors.js";
import { z, ZodError } from "zod";

const STATUS_BY_KIND: Record<ErrorKind, number> = {
  validation: 400,
  unauthorized: 401,
  not_found: 404,
  conflict: 409,
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(STATUS_BY_KIND[err.kind]).json({ error: err.message });
  }

  if (err instanceof ZodError) {
    const { fieldErrors, formErrors } = z.flattenError(err);

    const response: Record<string, unknown> = {
      error: "Invalid request",
    };

    if (Object.keys(fieldErrors).length > 0) {
      response.fields = fieldErrors;
    }
    if (formErrors.length > 0) {
      response.errors = formErrors;
    }

    return res.status(400).json(response);
  }

  if (err.expose === true && typeof err.status === "number") {
    res.status(err.status).json({ error: err.message });
    return;
  }

  res.err = err; // pino-http includes the error in the log automatically this way
  res.status(500).json({ error: "Internal Server Error" });
};
