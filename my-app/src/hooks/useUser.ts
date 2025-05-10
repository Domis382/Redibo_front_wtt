import { useEffect, useState } from 'react';

interface User {
  id_usuario: number;
  nombre_completo: string;
  email: string;
  telefono?: number;
  fecha_nacimiento?: string;
  foto_perfil?: string;
  ediciones_nombre: number; // 👈 AÑADIR ESTO
  ediciones_telefono: number;
  ediciones_fecha: number;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('https://redibo-back-wtt.vercel.app/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log('✅ User cargado:', data.user); // <-- DEBUG: para verificar que viene la foto
        setUser(data.user);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    };

    fetchUser();
  }, []);

  return user;
};