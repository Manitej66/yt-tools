export const HOST_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_URL
    : "http://localhost:3000";
export const chromePath =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
