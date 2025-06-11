// components/modals/VerificacionPaso1Modal.tsx
import { useState, useEffect, useRef } from 'react';
import BaseModal from '@/app/components/modals/ModalBase';
import BotonConfirm from '@/app/components/botons/BotonConfirm';
import CodigoVerificacion from '@/app/components/input/CodigoVerificacíon';
import { FaKey } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";

import { send2FACode } from '@/libs/verificacionDosPasos/send2FACode';
import { verify2FACode } from '@/libs/verificacionDosPasos/verify2FACode';

export default function VerificacionPaso1Modal({ 
  onClose, onVerificacionExitosa,
  }: {
    onClose: () => void;
    onVerificacionExitosa: () => void;
  }) {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  //
  const [contador, setContador] = useState(60);
  const [puedeReenviar, setPuedeReenviar] = useState(false);

  const canceladoRef = useRef(false);
  const yaEnviadoRef = useRef(false);
  //
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const enviar = async () => {
      if (yaEnviadoRef.current) return;
      yaEnviadoRef.current = true;

      try {
        await send2FACode();
        iniciarContador();
      } catch (err: unknown) {
        if (!canceladoRef.current) {
          setError(err instanceof Error ? err.message : 'Ocurrió un error');
        }
      }
    };

    enviar();

    return () => {
      canceladoRef.current = true;
      //
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []); // 👈 solo se ejecuta una vez, incluso con StrictMode

  const iniciarContador = () => {
    setPuedeReenviar(false);
    setContador(60);
    intervalRef.current = setInterval(() => {
      setContador((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setPuedeReenviar(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleReenviarCodigo = async () => {
    try {
      await send2FACode();
      iniciarContador();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al reenviar el código');
    }
  };

  const handleConfirmar = async () => {
    try {
      await verify2FACode(codigo);
      onVerificacionExitosa();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido');
      }
    }
  };

  return (
     <BaseModal onClose={onClose}>
      <svg
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="ml-auto block w-fit h-[30px] cursor-pointer text-[var(--azul-oscuro)]"
          onClick={onClose}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"
          />
        </svg>
      <h2 className="text-2xl font-[var(--tamaña-bold)] text-center 
      text-[var(--azul-oscuro)] mb-4 mt-90 
      sm:mt-0
      md:mt-0
      lg:mt-0
      2xl:mt-0
      ">
        Revisa tu correo electronico
      </h2>
      <p className="text-left mb-6 text-[var(--azul-oscuro)]">Ingresa el código que enviamos a tu correo
      <br></br> Es posible que debas esperar hasta un minuto para recibir este código</p>

      <CodigoVerificacion
        name="Ingresa código"
        label="Ingresa código"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        
        icono={<FaKey className='text-[var(--azul-oscuro)] text-2xl ' />}
      />
      {!puedeReenviar ? (
        <p className="text-left text-[var(--azul-oscuro)] my-1 font-semibold w-full">
          Podremos enviar un nuevo código en 0:{contador < 10 ? `0${contador}` : contador}
        </p>
      ) : (
        <button
          onClick={handleReenviarCodigo}
          className="flex items-left gap-2 my-1 text-[var(--azul-oscuro)] font-semibold hover:underline w-full h-auto"
        >
          <GrPowerReset className="text-xl" /> Obtener un código nuevo
        </button>
      )}
      {error && <p className="text-[var(--rojo)] text-ms font-[var(--tamaña-bold)] mt-1">{error}</p>}
      <BotonConfirm
        texto="Continuar"
        onClick={handleConfirmar}
        disabled={codigo.length !== 6}
      />
    </BaseModal>
  );
}