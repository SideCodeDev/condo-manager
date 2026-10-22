type LogContext = Record<string, string | number | boolean | undefined>;

function errorName(error: unknown) {
  return error instanceof Error ? error.name : "UnknownError";
}

function write(
  level: "info" | "warn" | "error",
  event: string,
  context: LogContext,
) {
  const entry = JSON.stringify({ event, ...context });
  if (level === "error") {
    console.error(entry);
    return;
  }
  if (level === "info") {
    console.info(entry);
    return;
  }
  console.warn(entry);
}

export const log = {
  info(event: string, context: LogContext = {}) {
    write("info", event, context);
  },
  error(event: string, context: LogContext = {}) {
    write("error", event, context);
  },
  warn(event: string, context: LogContext = {}) {
    write("warn", event, context);
  },
  errorName,
};
