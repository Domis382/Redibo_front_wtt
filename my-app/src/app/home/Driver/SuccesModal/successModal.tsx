"use client";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
    onClose: () => void;
  }

export default function SuccessModal({ onClose }: SuccessModalProps) {
  const router = useRouter();

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Bienvenido a</h2>
        <h1 className="text-3xl font-bold text-orange-500 mb-4">REDIBO</h1>
        <p className="text-lg font-bold text-blue-800">CONFIRMAR REGISTRO DE DRIVER</p>
        <p className="text-sm text-gray-600 mt-2 mb-4">Revisa tus datos antes de finalizar</p>
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-3xl">✓</span>
          </div>
        </div>
        <p className="text-green-600 font-bold text-lg">¡Registro completado!</p>
        <p className="text-gray-700 text-sm mt-1">Tu cuenta de driver ha sido creada exitosamente.</p>
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => {
            localStorage.removeItem("registroExitosoDriver");
            router.push("/home/homePage");
            handleClose(); // si querés cerrar el modal antes de redirigir
          }}

        >
          Entendido
        </button>

      </div>
    </div>
  );
}

