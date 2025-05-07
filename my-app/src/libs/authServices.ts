// src/libs/authService.ts

export async function login(email: string, password: string) {
  const res = await fetch("https://redibo-back-wtt.vercel.app/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Error en login");
  }

  return res.json();
}

export const backendip = () => {
  return "http://34.69.214.55:3001";
};
