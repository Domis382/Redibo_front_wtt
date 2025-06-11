// src/libs/authService.ts

export async function login(email: string, password: string) {
  const res = await fetch("https://redibo-back-wtt.vercel.app/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText ||"Error en login");
  }

  return res.json();
}

export const backendip = () => {
  return "https://redibo-back-wtt.vercel.app";
};
