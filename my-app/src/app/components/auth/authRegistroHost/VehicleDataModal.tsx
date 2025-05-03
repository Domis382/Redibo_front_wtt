"use client";

import React, { useState, useRef } from "react";
import { X, Upload } from "lucide-react";

interface Props {
  onNext: (data: {
    placa: string;
    soat: string;
    imagenes: File[];
  }) => void;
  onClose: () => void;
}

const VehicleDataModal: React.FC<Props> = ({ onNext, onClose }) => {
  const [placa, setPlaca] = useState("");
  const [soat, setSoat] = useState("");
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [errors, setErrors] = useState<{
    placa?: string;
    soat?: string;
    imagenes?: string;
  }>({});
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validarPlaca = (valor: string) => {
    const match = valor.match(/^(\d{3,4})([A-Z]{3})$/);
    if (!match) return false;
    const numero = parseInt(match[1], 10);
    return numero >= 0 && numero <= 6399;
  };

  const validarSOAT = (valor: string) => /^[A-Z0-9]{8,12}$/.test(valor);

  const camposValidos = () =>
    validarPlaca(placa) &&
    validarSOAT(soat) &&
    imagenes.length >= 3 &&
    imagenes.length <= 6 &&
    imagenes.every((file) => ["image/jpeg", "image/png"].includes(file.type));

  const validarYActualizarPlaca = (valor: string) => {
    setPlaca(valor);
    setErrors((prev) => ({
      ...prev,
      placa: validarPlaca(valor) ? undefined : "Formato de placa inválido",
    }));
  };

  const validarYActualizarSOAT = (valor: string) => {
    setSoat(valor);
    setErrors((prev) => ({
      ...prev,
      soat: validarSOAT(valor) ? undefined : "Formato de seguro inválido",
    }));
  };

  const agregarImagenes = (files: File[]) => {
    const validFiles = files.filter(
      (file) =>
        ["image/jpeg", "image/png"].includes(file.type) &&
        file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      setErrors((prev) => ({
        ...prev,
        imagenes: "Solo se permiten imágenes JPG/PNG de hasta 5MB"
      }));
    }

    const totalImagenes = [...imagenes, ...validFiles];

    if (totalImagenes.length > 6) {
      setErrors((prev) => ({
        ...prev,
        imagenes: "Solo puedes subir hasta 6 imágenes del auto",
      }));
      return;
    }

    setImagenes(totalImagenes);

    setErrors((prev) => ({
      ...prev,
      imagenes:
        totalImagenes.length < 3
          ? "Debes subir al menos 3 imágenes del auto (frontal, lateral y trasera)"
          : undefined,
    }));
  };

  const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      agregarImagenes(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      agregarImagenes(Array.from(e.dataTransfer.files));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const nuevasImagenes = imagenes.filter((_, i) => i !== index);
    setImagenes(nuevasImagenes);

    setErrors((prev) => ({
      ...prev,
      imagenes:
        nuevasImagenes.length < 3
          ? "Debes subir al menos 3 imágenes del auto (frontal, lateral y trasera)"
          : undefined,
    }));
  };

  const handleSubmit = () => {
    const nuevosErrores: typeof errors = {};

    if (!validarPlaca(placa)) nuevosErrores.placa = "Formato de placa inválido";
    if (!validarSOAT(soat)) nuevosErrores.soat = "Formato de seguro inválido";
    if (imagenes.length < 3 || imagenes.length > 6) {
      nuevosErrores.imagenes = "Debes subir entre 3 y 6 imágenes";
    }

    setErrors(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    onNext({ placa, soat, imagenes });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white text-[#11295B] p-10 rounded-3xl shadow-2xl max-w-xl w-full relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-2xl text-[#11295B]">
          <X />
        </button>

        <h2 className="text-lg font-semibold text-center text-[#11295B]">Bienvenido a</h2>
        <h1 className="text-3xl font-bold text-center text-[#FCA311] drop-shadow-sm mb-2">REDIBO</h1>
        <h3 className="text-xl text-center font-semibold text-[#11295B] mb-1">REGISTRARSE COMO HOST</h3>
        <p className="text-center text-sm text-gray-600 mb-6">Ingresa datos de tu vehículo</p>

        {/* Campo Placa */}
        <div className="mb-4">
          <div className="relative flex items-center">
            <img src="/placa.svg" alt="icono placa" className="absolute left-3 w-6 h-6" />
            <input
              type="text"
              placeholder="Placa"
              value={placa}
              onChange={(e) => validarYActualizarPlaca(e.target.value.toUpperCase())}
              className={`pl-12 w-full border-2 rounded-lg px-4 py-3 outline-none text-lg placeholder:text-[#11295B]/50 font-semibold ${
                errors.placa ? "border-red-500 text-red-500 placeholder-red-400" : "border-[#11295B]"
              }`}
            />
          </div>
          {errors.placa && <p className="text-sm text-red-500 mt-1">{errors.placa}</p>}
        </div>

        {/* Campo SOAT */}
        <div className="mb-4">
          <div className="relative flex items-center">
            <img src="/seguro.svg" alt="icono seguro" className="absolute left-3 w-6 h-6" />
            <input
              type="text"
              placeholder="Número de seguro"
              value={soat}
              onChange={(e) => validarYActualizarSOAT(e.target.value.toUpperCase())}
              className={`pl-12 w-full border-2 rounded-lg px-4 py-3 outline-none text-lg placeholder:text-[#11295B]/50 font-semibold ${
                errors.soat ? "border-red-500 text-red-500 placeholder-red-400" : "border-[#11295B]"
              }`}
            />
          </div>
          {errors.soat && <p className="text-sm text-red-500 mt-1">{errors.soat}</p>}
        </div>

        {/* Campo Imágenes */}
        <div className={`mb-4 bg-gray-100 rounded-xl p-4 ${errors.imagenes ? "border-2 border-red-500" : ""}`}>
          <label className="block font-semibold mb-1 text-[#11295B]">Imágenes del auto</label>
          <p className="text-sm text-gray-600 mb-2">Asegúrate de tomar las fotos en un lugar bien iluminado</p>

          <div
            className={`border border-dashed rounded p-4 text-center cursor-pointer transition-all duration-200 ${
              isDragging ? "bg-gray-300" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto mb-2 w-6 h-6" />
            <p className="font-medium">Subir imágenes del vehículo</p>
            <p className="text-xs text-gray-500">Haz clic o arrastra aquí tus imágenes</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg, image/png"
            onChange={handleImagenesChange}
            className="hidden"
          />

          {errors.imagenes ? (
            <p className="text-sm text-red-500 mt-2">{errors.imagenes}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-2">*Mínimo 3 fotos del vehículo: frontal, lateral y trasera</p>
          )}

          {/* Vista previa */}
          {imagenes.length > 0 && (
            <div className="flex flex-wrap mt-3 gap-3">
              {imagenes.map((img, idx) => {
                const src = URL.createObjectURL(img);
                return (
                  <div key={`${idx}-${img.name}`} className="relative w-20 h-20">
                    <img
                      src={src}
                      alt={`imagen-${idx}`}
                      onClick={() => setPreviewImg(src)}
                      className="object-cover w-full h-full rounded border border-gray-300 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      title="Eliminar imagen"
                      className="absolute -top-2 -right-2 bg-[#11295B] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={handleSubmit}
          className={`w-full text-white py-3 rounded-xl font-semibold text-lg mt-2 transition-all duration-200 ${
            camposValidos()
              ? "bg-[#FCA311] hover:bg-[#e29510]"
              : "bg-[#FCA311]/60 cursor-not-allowed"
          }`}
          disabled={!camposValidos()}
        >
          Siguiente
        </button>
      </div>

      {/* Modal de Previsualización */}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center"
          onClick={() => setPreviewImg(null)}
        >
          <div className="relative max-w-3xl w-full mx-4">
            <img
              src={previewImg}
              alt="Previsualización"
              className="w-full h-auto rounded-xl shadow-xl"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImg(null);
              }}
              title="Cerrar imagen"
              className="absolute top-2 right-2 text-white text-xl bg-[#11295B]/70 hover:bg-[#11295B] rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDataModal;


