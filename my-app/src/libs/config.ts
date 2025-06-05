export const BACK_URL =
  typeof window !== "undefined"
    ? "https://redibo-back-wtt.vercel.app" // cuando se ejecuta en navegador
    : "http://localhost:3000/api"; // cuando se ejecuta en servidor o desarrollo