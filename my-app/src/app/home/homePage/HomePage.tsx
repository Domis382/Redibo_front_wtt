'use client';
import { useState, useEffect } from 'react';

//Proteger el frontend (redireccionar si no hay token):
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

import NavbarInicioSesion from '@/app/components/navbar/NavbarInicioSesion';
import FiltersBar from '@/app/components/filters/FiltersBar';
import Footer from '@/app/components/footer/FooterLogin';
import LoginModal from '@/app/components/auth/authInicioSesion/LoginModal';
import RegisterModal from '@/app/components/auth/authregistro/RegisterModal';

export default function MainHome() {
  const [activeModal, setActiveModal] = useState<'login' | 'register' | null>(null);
  
  const router = useRouter();
  const user = useUser(); // 🚀

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [user, router]); // 🚀 Agrega user como dependencia

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-principal)]">
      <header className="border-t border-b border-[rgba(215, 30, 30, 0.1)] shadow-[0_2px_6px_rgba(0,0,0,0.1)]">

        <NavbarInicioSesion />
      </header>

      <header className="/* headerFilters */">
        <FiltersBar />
      </header>

      <main className="flex-grow p-8">
        <div className="/* scrollContent */">
          <p>Contenido principal del usuario (tarjetas, información, etc.).</p>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>

      {activeModal === 'login' && (
        <LoginModal onClose={() => setActiveModal(null)} onRegisterClick={() => setActiveModal('register')} onPasswordRecoveryClick={() => console.log('Recuperar contraseña')}/>
      )}

      {activeModal === 'register' && (
        <RegisterModal onClose={() => setActiveModal(null)} onLoginClick={() => setActiveModal('login')} />
      )}
    </div>
  );
}
