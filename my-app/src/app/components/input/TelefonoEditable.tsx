'use client';
import { useState, useEffect } from 'react';
import { MdiPencil } from '@/app/components/Icons/Pencil';
import { updateUserField } from '@/libs/userService';
import PhoneIcon from '@/app/components/Icons/Phone';

interface Props {
  initialValue: string;
  campoEnEdicion: string | null;
  setCampoEnEdicion: (campo: string | null) => void;
  edicionesUsadas: number;
}

export default function TelefonoEditable({ initialValue, campoEnEdicion, setCampoEnEdicion, edicionesUsadas}: Props) {
  const [valor, setValor] = useState(initialValue);
  const [editando, setEditando] = useState(false);
  const [valorTemporal, setValorTemporal] = useState(initialValue);
  const [feedback, setFeedback] = useState('');
  const [errorMensaje, setErrorMensaje] = useState('');
  const [infoExtra, setInfoExtra] = useState('');
  const [bloqueado, setBloqueado] = useState(edicionesUsadas >= 3);
  
  useEffect(() => {
    if (bloqueado) {
      setEditando(false);
      setCampoEnEdicion(null);
    }
  }, [bloqueado]);

  const validarTelefono = (telefono: string) => {
    if (telefono.length === 0) {
      setErrorMensaje('El teléfono no puede estar vacío.');
      return false;
    }

    const soloNumeros = /^[0-9]*$/;
    if (!soloNumeros.test(telefono)) {
      setErrorMensaje('Formato inválido, ingrese solo números.');
      return false;
    }

    if (telefono.length !== 8) {
      setErrorMensaje('El teléfono debe ser de 8 dígitos.');
      return false;
    }

    if (!/^[67]/.test(telefono)) {
      setErrorMensaje('El teléfono debe comenzar con 6 o 7.');
      return false;
    }

    setErrorMensaje('');
    return true;
  };

  const handleGuardar = async () => {
    if (!validarTelefono(valorTemporal)) return;
    try {
      const response = await updateUserField('telefono', valorTemporal);

      if (response.message === 'No hubo cambios en el valor.') {
        setEditando(false);
        setCampoEnEdicion(null);
        setErrorMensaje('No se realizaron cambios.');
        return;
      }

      setValor(valorTemporal);
      setEditando(false);
      setCampoEnEdicion(null);
      setFeedback('Teléfono actualizado exitosamente.');

      if (response.edicionesRestantes === 0) {
        setBloqueado(true);
        setInfoExtra('Has alcanzado el límite de 3 ediciones para este campo. Para más cambios, contacta al soporte.');
      } else if (response.infoExtra) {
        setInfoExtra(response.infoExtra);
      }
      else if (response.edicionesRestantes > 0) setInfoExtra(`Puedes editar este campo ${response.edicionesRestantes} ${response.edicionesRestantes === 1 ? 'vez' : 'veces'} más.`);

      setTimeout(() => { setFeedback(''); setInfoExtra(''); }, 5000);
    } catch (err) {
      console.error('❌ Error al guardar:', err);
      setErrorMensaje('Hubo un error al guardar.');
    }
  };

  const handleCancelar = () => {
    setValorTemporal(valor);
    setErrorMensaje('');
    setEditando(false);
    setFeedback('');
    setCampoEnEdicion(null);
  };

  return (
    <div className="relative mb-4 font-[var(--tamaña-bold)]">
      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>

      <div className="relative">
        <input
          type="text"
          value={editando ? valorTemporal : valor}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 8) {
              setValorTemporal(value);
              validarTelefono(value); // ✅ siempre validar mientras escribe
            }
          }}
          readOnly={!editando || bloqueado}
          placeholder={editando ? 'Ingresar número de teléfono' : ''}
          className={`w-full border-2 rounded-md px-10 py-2 focus:outline-none focus:ring-1 shadow-[0_4px_10px_rgba(0,0,0,0.4)] ${
            editando
              ? 'bg-white border-[var(--azul-oscuro)] ring-[var(--azul-oscuro)]'
              : 'bg-gray-100 border-2 border-[var(--azul-oscuro)]'
          }`}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#11295B]">
          <PhoneIcon />
        </div>
        {!editando && !bloqueado &&(
          <div
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer ${
              campoEnEdicion && campoEnEdicion !== 'telefono' ? 'opacity-50 pointer-events-none' : ''
            }`}
            onClick={() => {
              if (!campoEnEdicion && !bloqueado) {
                setEditando(true);
                setCampoEnEdicion('telefono');
              }
            }}
          >
            <MdiPencil />
          </div>
        )}
      </div>

      {errorMensaje && <p className="text-[var(--rojo)] text-sm mb-1 mt-1">{errorMensaje}</p>}
      {!errorMensaje && feedback && <p className="text-[var(--verde)] text-sm mb-1 mt-1 font-semibold">{feedback}</p>}
      {!errorMensaje && infoExtra && <p className="text-[var(--rojo)] text-sm font-semibold mb-1 mt-1">{infoExtra}</p>}
       

      {editando && (
        <div className="flex gap-2 mt-2 justify-end">
          <button
            onClick={handleGuardar}
            disabled={!!errorMensaje || valorTemporal.trim() === ''} // 👈 NUEVO: error o vacío
            className={`px-4 py-1 rounded-lg transition cursor-pointer shadow-[var(--sombra)] ${
              !!errorMensaje || valorTemporal.trim() === ''
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[var(--naranja-46)] text-[var(--blanco)] hover:bg-[var(--naranja)]'
            }`}
          >
            Guardar
          </button>
          <button
            onClick={handleCancelar}
            className="px-4 py-1 bg-gray-50 text-[var(--naranja)] rounded-lg hover:bg-[var(--blanco)] transition cursor-pointer shadow-[var(--sombra)]"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
