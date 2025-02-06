export const getBaseURL = () => {
  if (typeof window !== "undefined") {
    // For client-side
    return window.location.origin;
  } else {
    // For server-side
    const protocol = process.env.VERCEL_URL ? "https" : "http";
    const host = process.env.VERCEL_URL || "localhost:3000";
    return `${protocol}://${host}`;
  }
};
