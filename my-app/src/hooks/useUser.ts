//hooks/useUser.ts
import { useEffect, useState, useCallback } from 'react';

interface User {
  idUsuario: number;
  nombreCompleto: string;
  email: string;
  telefono?: number;
  fechaNacimiento?: string;
  fotoPerfil?: string;
  edicionesNombre: number; // 👈 AÑADIR ESTO
  edicionesTelefono: number;
  edicionesFecha: number;

  driverBool: boolean;
  host: boolean
  verificacionDosPasos: boolean; 
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

export const useUserWithRefetch = () => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('https://redibo-back-wtt.vercel.app/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, refetchUser: fetchUser };
};