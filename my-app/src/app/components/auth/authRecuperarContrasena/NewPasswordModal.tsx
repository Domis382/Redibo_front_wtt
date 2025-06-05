'use client';

import { useState } from 'react';

const NewPasswordModal = ({
  code,
  //onPasswordResetSuccess,
  onClose, // Agregamos una función para cerrar el modal
  onNewPasswordSubmit
}: {
  code: string;
  //onPasswordResetSuccess: () => void;
  onClose: () => void; // Nueva prop para manejar el cierre del modal
  onNewPasswordSubmit: (newPassword: string) => void; // Nueva prop para manejar el envío de la nueva contraseña
}) => {
  console.log('🧠 Código recibido en NewPasswordModal:', code);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validatePassword = (password: string): boolean => {
    if (password.trim() === "") {
      setError("La contraseña no puede estar vacía");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Debe contener al menos una letra mayúscula");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setError("Debe contener al menos una letra minúscula");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setError("Debe contener al menos un número");
      return false;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      setError("Debe tener al menos un carácter especial (!@#$...)");
      return false;
    }
    if (password.includes(" ")) {
      setError("No puede contener espacios");
      return false;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    if (password.length > 25) {
      setError("No puede tener más de 25 caracteres");
      return false;
    }
    setError(""); // Limpia el error si todo es válido
    return true;
  };

  const handleConfirm = async () => {
    setError('');

    
    /*if (!code || code.length !== 6) {
      setError('Código no válido. Intenta nuevamente.');
      return;
    }*/

    if (!newPassword || !confirmPassword) {
      setError('Por favor completa ambos campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!validatePassword(newPassword)) {
      return;
    }

    setSuccessMessage('Contraseña actualizada con éxito!');
    setTimeout(() => {
      setSuccessMessage(''); // Ocultar el pop-up después de 2 segundos
    }, 2000);

    try {
      console.log('📤 Enviando al backend:', {newPassword });
      //console.log('📦 Código recibido en NewPasswordModal:', code);

      const response = await fetch('${BACK_URL}/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar la contraseña');
      }

      //alert('¡Contraseña actualizada correctamente!');
      onNewPasswordSubmit(newPassword); // Llama a la función para manejar el envío de la nueva contraseña
      //onPasswordResetSuccess();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al cambiar la contraseña');
      }
    }
    
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    validatePassword(password);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      onClose(); // Llama a la función para cerrar el modal
    }
  };

  return (
    <div
      className="fixed w-full h-full flex justify-center items-center z-[9999] left-0 top-0 bg-black/50 font-sans modal-overlay"
      onClick={handleOutsideClick} // Detecta clics fuera del modal
    >
      <div className="w-[33rem] h-auto bg-white p-10 rounded-[35px] shadow-[0_0px_20px_rgba(0,0,0,0.72)]">
        <h1 className="text-center text-[#11295B] text-[1.44rem] font-medium leading-normal mb-4 drop-shadow-md">
          Recupera tu contraseña de <br />
          <span className="text-[#FCA311] font-black text-[2.074rem] drop-shadow-sm">REDIBO</span>
        </h1>

        <p className="text-[0.9rem] text-black mb-6 text-center">
          CÓDIGO DE VERIFICACIÓN CORRECTO. Por favor establece una nueva contraseña.
        </p>

        {/* -------- Nueva contraseña -------- */}
        <div className="relative border-2 border-solid border-[#11295B] flex flex-col mb-4 rounded-lg">
          <input
            className="w-full h-16 pl-12 pr-4 font-bold text-[#11295B] rounded-2xl outline-none placeholder:text-[#11295B]/50"
            type={showPassword ? 'text' : 'password'}
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />

          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className ="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#11295B]"
          >
            <path 
              fillRule="evenodd" 
              d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" 
              clipRule="evenodd" 
            />
          </svg>
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#11295B]"
            onClick={() => setShowPassword(!showPassword)}  // Cambia el estado de visibilidad
            disabled={!setNewPassword}
          >
            <img 
              src="https://www.svgrepo.com/download/526542/eye.svg"
              alt="Mostrar contraseña"
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* Confirmar contraseña */}
        <div className="relative border-2 border-solid border-[#11295B] flex flex-col mb-2 rounded-lg">
          <input
            className="w-full h-16 pl-12 pr-4 font-bold text-[#11295B] rounded-2xl outline-none placeholder:text-[#11295B]/50"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />

          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className ="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#11295B]"
          >
            <path 
              fillRule="evenodd" 
              d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" 
              clipRule="evenodd" />
          </svg>

          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#11295B]"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={!confirmPassword}
          >
            <img
              src="https://www.svgrepo.com/download/526542/eye.svg"
              alt="Mostrar contraseña"
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* -------- Mensaje de error -------- */}
        {error && (
          <div className="text-[#F85959] text-sm font-semibold mb-4 text-center">
            {error}
          </div>
        )}

        <button
          className="w-full bg-[rgba(252,163,17,0.5)] hover:bg-[#FCA311] text-white mt-4 p-4 rounded-[40px] border-none transition-colors"
          onClick={handleConfirm}
        >
          Confirmar
        </button>

        <button
          className="w-full text-[#11295B] underline cursor-pointer my-4 hover:text-[#11295B] transition-colors"
          onClick={onClose} // Llama a la función para cerrar el modal
        >
          Cancelar
        </button>
      </div>
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default NewPasswordModal;
