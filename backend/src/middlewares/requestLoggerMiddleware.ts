import { createMiddleware } from "hono/factory";

export const requestLogglerMiddleware = createMiddleware(async (context, next) => {
    const startTime = performance.now();
    await next();
    let colorCode: string = "";
    if (context.res.status >= 500) {
      colorCode = "\x1b[35m";
    } else if (context.res.status >= 400) {
      colorCode = "\x1b[31m";
    } else if (context.res.status >= 300) {
      colorCode = "\x1b[33m";
    } else if (context.res.status >= 200) {
      colorCode = "\x1b[32m";
    }

    let logContent = `${colorCode}${context.res.status}\x1b[0m`;
    logContent += " " + context.req.method.toUpperCase();
    logContent += " " + context.req.path;

    const endTime = performance.now();
    const duration = Math.round((endTime - startTime) * 100) / 100;
    logContent += " " + `(${duration}ms)`;
    console.log(logContent);
});
