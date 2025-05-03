"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Check } from "lucide-react";

interface Props {
  onComplete: () => void;
  onClose: () => void;
  vehicleData: {
    placa: string;
    soat: string;
    imagenes: File[];
  };
  paymentData: {
    cardNumber?: string;
    expiration?: string;
    cvv?: string;
    cardHolder?: string;
    qrImage?: File | null;
    efectivoDetalle?: string;
  };
}

const CompleteProfileModal: React.FC<Props> = ({
  onComplete,
  onClose,
  vehicleData,
  paymentData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró el token de autenticación.");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();

      // Vehículo
      formData.append("placa", vehicleData.placa);
      formData.append("soat", vehicleData.soat);
      vehicleData.imagenes.forEach((img) => formData.append("imagenes", img));

      // Método de pago
      if (paymentData.cardNumber) {
        formData.append("tipo", "card");
        formData.append("numero_tarjeta", paymentData.cardNumber);
        formData.append("fecha_expiracion", paymentData.expiration ?? "");
        formData.append("cvv", paymentData.cvv ?? "");
        formData.append("titular", paymentData.cardHolder ?? "");
      } else if (paymentData.qrImage) {
        formData.append("tipo", "qr");
        formData.append("qrImage", paymentData.qrImage);
      } else if (paymentData.efectivoDetalle) {
        formData.append("tipo", "cash");
        formData.append("detalles_metodo", paymentData.efectivoDetalle);
      }

      const response = await fetch("http://localhost:3001/api/registro-host", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        setError(result.message || "Ocurrió un error al registrar.");
      }
    } catch (err) {
      console.error("❌ Error al enviar datos:", err);
      setError("Error de red o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose, isLoading]);

  const maskedCardNumber = paymentData.cardNumber?.replace(/\s/g, "").replace(/\d(?=\d{4})/g, "•") ?? "";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white text-[#11295B] p-10 rounded-3xl shadow-2xl max-w-xl w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-2xl text-[#11295B] hover:text-red-500 transition-colors"
          disabled={isLoading}
          aria-label="Cerrar"
          type="button"
        >
          <X />
        </button>

        <h2 className="text-lg font-semibold text-center text-[#11295B]">Bienvenido a</h2>
        <h1 className="text-3xl font-bold text-center text-[#FCA311] drop-shadow-sm mb-2">REDIBO</h1>
        <h3 className="text-xl text-center font-semibold text-[#11295B] mb-1">CONFIRMAR REGISTRO DE HOST</h3>
        <p className="text-center text-sm text-gray-600 mb-6">Revisa tus datos antes de finalizar</p>

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">¡Registro completado!</h3>
            <p className="text-gray-600">Tu cuenta de host ha sido creada exitosamente.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-[#11295B]">Datos del vehículo</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-500 text-sm">Placa</p>
                  <p className="font-semibold">{vehicleData.placa}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">SOAT</p>
                  <p className="font-semibold">{vehicleData.soat}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 text-sm">Imágenes</p>
                  <p className="font-semibold">{vehicleData.imagenes.length} imágenes</p>
                </div>
              </div>
            </div>

            <div className="mb-8 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-[#11295B]">Método de pago</h3>
              {paymentData.cardNumber ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <p className="text-gray-500 text-sm">Tarjeta</p>
                    <p className="font-semibold">{maskedCardNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Expira</p>
                    <p className="font-semibold">{paymentData.expiration}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Titular</p>
                    <p className="font-semibold">{paymentData.cardHolder}</p>
                  </div>
                </div>
              ) : paymentData.qrImage ? (
                <p className="font-semibold text-sm">Pago con QR</p>
              ) : (
                <p className="font-semibold text-sm">Pago en efectivo</p>
              )}
            </div>

            {error && <div className="bg-red-100 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}

            <div className="flex gap-4">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="w-1/3 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold text-lg transition-all hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className={`w-2/3 text-white py-3 rounded-xl font-semibold text-lg transition-all ${
                  isLoading ? "bg-[#FCA311]/60 cursor-wait" : "bg-[#FCA311] hover:bg-[#e29510]"
                }`}
              >
                {isLoading ? "Procesando..." : "Confirmar y finalizar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompleteProfileModal;

