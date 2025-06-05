//libs/verificacionDosPasos/send2FACode.ts
import { BACK_URL } from "@/libs/config";

export const send2FACode = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BACK_URL}/api/2fa/enviar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al enviar código 2FA');
  }

  return res.json();
};