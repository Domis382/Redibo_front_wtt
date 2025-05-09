'use client';
import { useState } from 'react';
import { MdiPencil } from '@/app/components/Icons/Pencil';
import { updateUserField } from '@/libs/userService';
import UserIcon from '@/app/components/Icons/User';

interface Props {
  initialValue: string;
  campoEnEdicion: string | null;
  setCampoEnEdicion: (campo: string | null) => void;
}

export default function NombreEditable({ initialValue, campoEnEdicion, setCampoEnEdicion }: Props) {
  const [valor, setValor] = useState(initialValue);
  const [editando, setEditando] = useState(false);
  const [valorTemporal, setValorTemporal] = useState(initialValue);
  const [feedback, setFeedback] = useState('');
  const [errorMensaje, setErrorMensaje] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let nuevoValor = e.target.value;

    // Capitalizar primera letra automáticamente
    if (nuevoValor.length > 0) {
      nuevoValor = nuevoValor.charAt(0).toUpperCase() + nuevoValor.slice(1);
    }

    setValorTemporal(nuevoValor);

    if (nuevoValor.length === 0) {
      setErrorMensaje('El nombre no puede estar vacío.');
      return;
    }

    if (nuevoValor.length > 50) {
      setErrorMensaje('El nombre no puede superar los 50 caracteres.');
      return;
    }

    if (nuevoValor.length < 3) {
      setErrorMensaje('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    const soloLetrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (!soloLetrasRegex.test(nuevoValor)) {
      setErrorMensaje('El nombre solo puede contener letras y espacios.');
      return;
    }

    if (/\s{2,}/.test(nuevoValor)) {
      setErrorMensaje('El nombre no debe contener más de un espacio entre palabras.');
      return;
    }

    if (/^\s|\s$/.test(nuevoValor)) {
      setErrorMensaje('El nombre no debe comenzar ni terminar con espacios.');
      return;
    }

    setErrorMensaje('');
  };

  const handleGuardar = async () => {
    const nombreAValidar = valorTemporal.trim();

    try {
      const response = await updateUserField('nombre_completo', nombreAValidar);
      console.log('✅ Nombre actualizado en la base de datos:', response);
      setValor(nombreAValidar);
      setEditando(false);
      setCampoEnEdicion(null);
      setFeedback('Nombre actualizado exitosamente.');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('❌ Error al actualizar:', err.message);
        setErrorMensaje(err.message || 'Hubo un error al guardar.');
      } else {
        console.error('❌ Error desconocido:', err);
        setErrorMensaje('Hubo un error desconocido al guardar.');
      }
    }
  };

  const handleCancelar = () => {
    setValorTemporal(valor);
    setEditando(false);
    setErrorMensaje('');
    setFeedback('');
    setCampoEnEdicion(null);
  };

  return (
    <div className="relative mb-4 font-[var(--tamaña-bold)]">
      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>

      <div className="relative">
        <input
          type="text"
          value={editando ? valorTemporal : valor}
          onChange={handleInputChange}
          readOnly={!editando}
          placeholder={editando ? 'Ingresar nombre completo' : ''}
          className={`w-full border-2 rounded-md px-10 py-2 focus:outline-none focus:ring-1 shadow-[0_4px_10px_rgba(0,0,0,0.4)] ${
            editando
              ? 'bg-white border-[var(--azul-oscuro)] ring-[var(--azul-oscuro)]'
              : 'bg-gray-100 border-2 border-[var(--azul-oscuro)]'
          }`}
        />

        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#11295B]">
          <UserIcon />
        </div>

        {!editando && (
          <div
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer ${
              campoEnEdicion && campoEnEdicion !== 'nombre' ? 'opacity-50 pointer-events-none' : ''
            }`}
            onClick={() => {
              if (!campoEnEdicion) {
                setEditando(true);
                setCampoEnEdicion('nombre');
              }
            }}
          >
            <MdiPencil />
          </div>
        )}
      </div>

      {errorMensaje && (
        <p className="text-red-500 text-sm mt-1">{errorMensaje}</p>
      )}
      {feedback && !errorMensaje && (
        <p className="text-green-600 text-sm mt-1">{feedback}</p>
      )}

      {editando && (
        <div className="flex gap-2 mt-2 justify-end">
          <button
            onClick={handleGuardar}
            disabled={!!errorMensaje || valorTemporal.trim() === ''} // 👈 NUEVO: deshabilita si hay error o está vacío
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
