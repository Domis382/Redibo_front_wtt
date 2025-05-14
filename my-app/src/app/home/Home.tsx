"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // ✅
import Navbar from "../components/navbar/Navbar";
import FiltersBar from "../components/filters/FiltersBar";
import Footer from "../components/footer/Footer";
import PasswordRecoveryModal from "../components/auth/authRecuperarContrasena/PasswordRecoveryModal";
import CodeVerificationModal from "../components/auth/authRecuperarContrasena/CodeVerificationModal";
import NewPasswordModal from "../components/auth/authRecuperarContrasena/NewPasswordModal";
import LoginModal from "../components/auth/authInicioSesion/LoginModal";
import styles from "./Home.module.css";
import RegisterModal from "../components/auth/authregistro/RegisterModal";

export default function HomePage() {
  const searchParams = useSearchParams();
  const [hasRedirected, setHasRedirected] = useState(false); // 👈 Evita doble redirect

  const [activeModal, setActiveModal] = useState<"login" | "register" | null>(
    null
  );
  const [modalState, setModalState] = useState<
    "passwordRecovery" | "codeVerification" | "newPassword" | null
  >(null);

  const [showToast, setShowToast] = useState(false);
  const [showToast2, setShowToast2] = useState(false); // Para el mensaje de usuario bloqueado

  const handleLoginSubmit = () => {
    setModalState("passwordRecovery");
  };

  const handlePasswordRecoverySubmit = () => {
    setModalState("codeVerification");
  };

  const handleCodeVerificationSubmit = () => {
    setModalState("newPassword");
  };

  const handleClose = () => {
    setModalState(null); // Cierra cualquier modal de recuperación
    setActiveModal("login"); // Abre el login modal
  };

  const handleBackToPasswordRecovery = () => {
    setModalState("passwordRecovery"); // Regresa al PasswordRecoveryModal desde el CodeVerificationModal
  };

  useEffect(() => {
    const autoLogin = searchParams.get("googleAutoLogin");
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const googleComplete = searchParams.get("googleComplete");
    const shouldOpen = localStorage.getItem("openCompleteProfileModal");

    if (autoLogin === "true" && token && email && !hasRedirected) {
      console.log("🌐 Detectado login automático en /home. Redirigiendo...");

      localStorage.setItem("token", token);
      localStorage.setItem("google_email", email);

      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("googleAutoLogin");
      cleanUrl.searchParams.delete("token");
      cleanUrl.searchParams.delete("email");
      window.history.replaceState({}, "", cleanUrl.toString());

      setHasRedirected(true);
      window.location.href = "/home/homePage"; // ✅ solo desde aquí
    }

    if (googleComplete === "true" && shouldOpen === "true") {
      console.log("🧩 Mostrar modal de perfil desde /home");
      localStorage.removeItem("openCompleteProfileModal");
      setActiveModal("register"); // 👈 Esto abrirá el `RegisterModal`
    }

    // Si viene con login automático NO mostrar ningún modal
    /* if (autoLogin === "true") {
      // Limpiar la URL primero (opcional pero recomendado)
      const url = new URL(window.location.href);
      url.searchParams.delete("googleAutoLogin");
      url.searchParams.delete("token");
      url.searchParams.delete("email");
      window.history.replaceState({}, "", url.toString());

      setActiveModal(null); // asegúrate de que no quede ningún modal activo
      window.location.href = "/home/homePage";
      
    } */

    // Mostrar modal solo si viene de registro con Google
    /* if (complete === "true") {
      setActiveModal("register");
    } */
  }, [searchParams, hasRedirected]);

  return (
    <div className={styles.container}>
      <header className={styles.headerTop}>
        <Navbar
          onLoginClick={() => setActiveModal("login")}
          onRegisterClick={() => setActiveModal("register")}
        />
      </header>

      <header className={styles.headerFilters}>
        <FiltersBar />
      </header>

      <main className={styles.body}>
        <div className={styles.scrollContent}>
          <p>Contenido principal del usuario (tarjetas, información, etc.).</p>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>

      {/* Mostrar los modales según el estado */}
      {/*{modalState === 'login' && (
        <LoginModal onClose={handleClose} onLoginSubmit={handleLoginSubmit} />
      )}*/}
      {modalState === "passwordRecovery" && (
        <PasswordRecoveryModal
          onClose={handleClose}
          onPasswordRecoverySubmit={handlePasswordRecoverySubmit}
        />
      )}
      {modalState === "codeVerification" && (
        <CodeVerificationModal
          onClose={handleBackToPasswordRecovery}
          onCodeVerificationSubmit={handleCodeVerificationSubmit}
          onBlocked={() => {
            setModalState(null);
            setActiveModal("login"); // Redirige al Login al finalizar
            setShowToast2(true); // muestra el pop-up

            // Ocultar el toast automáticamente después de 3 segundos
            setTimeout(() => setShowToast2(false), 10000);
          }} // ✅ Redirige al login si el backend dice "bloqueado"
        />
      )}
      {modalState === "newPassword" && (
        <NewPasswordModal
          onClose={handleClose} // Redirige al Login al cancelar o finalizar
          code="exampleCode" // Replace "exampleCode" with the actual code value
          onNewPasswordSubmit={() => {
            setModalState(null);
            setActiveModal("login"); // Redirige al Login al finalizar
            setShowToast(true); // muestra el pop-up

            // Ocultar el toast automáticamente después de 3 segundos
            setTimeout(() => setShowToast(false), 10000);
          }}
        />
      )}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[9999]">
          ¡Contraseña actualizada correctamente!
        </div>
      )}
      {showToast2 && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[9999]">
          Usuario bloqueado temporalmente. Intenta nuevamente más tarde.
        </div>
      )}

      {activeModal === "login" && (
        <LoginModal
          onClose={() => setActiveModal(null)}
          onRegisterClick={() => setActiveModal("register")}
          onPasswordRecoveryClick={handleLoginSubmit} // 👈 Aquí usas la función
        />
      )}

      {activeModal === "register" && (
        <RegisterModal
          onClose={() => setActiveModal(null)}
          onLoginClick={() => setActiveModal("login")}
        />
      )}
    </div>
  );
}
