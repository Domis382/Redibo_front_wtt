/* import { backendip } from "@/libs/authServices"; */
import styles from "./RegisterModal.module.css";
import { useState } from "react";

export default function CompleteProfileModal({
  onComplete,
  onClose,
  onSuccess,
}: {
  onComplete: (data: { name: string; birthDate: string }) => void;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [name, setName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [error, setError] = useState("");
  const userEmail = localStorage.getItem("google_email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    if (!birthDay || !birthMonth || !birthYear) {
      setError("Completa la fecha de nacimiento");
      return;
    }

    const birthDate = new Date(
      Number(birthYear),
      Number(birthMonth) - 1,
      Number(birthDay)
    );

    if (birthDate > new Date()) {
      setError("La fecha de nacimiento no puede ser futura");
      return;
    }

    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      setError("Debes tener al menos 18 años");
      return;
    }

    setError("");

    try {
      const res = await fetch("http://34.69.214.55:3001/api/register", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: userEmail,
          nombre_completo: name.trim(),
          fecha_nacimiento: birthDate.toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();

        
        if (data.message?.includes("registrado con email")) {
            alert("Esta cuenta ya fue registrada con correo y contraseña. Por favor inicia sesión manualmente.");
            return; // No continuar ni cerrar el modal
          }
        
          throw new Error(data.message || "No se pudo actualizar el perfil");
      }

      onComplete({ name: name.trim(), birthDate: birthDate.toISOString() });

      if (onSuccess) {
        onSuccess(); // ✅ activa el modal de éxito
      }
    } catch (err) {
      console.error("Error al guardar datos de perfil", err);
      setError("No se pudo guardar los datos. Intenta nuevamente.");
    }

    /*  onComplete({
      name: name.trim(),
      birthDate: birthDate.toISOString(),
    });

    if (onSuccess) onSuccess();
    onClose(); */
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>REGISTRARSE</h2>
        <p
          style={{ textAlign: "center", marginBottom: "1rem", fontWeight: 500 }}
        >
          ¡Ya casi acabas!
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Campo nombre completo */}
          <div className={styles.halfInput}>
            <label htmlFor="name">Nombre completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              placeholder="Ingrese su nombre completo"
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Fecha de nacimiento */}
          <div className={styles.halfInput}>
            <label>Fecha de nacimiento</label>
            <div className={styles.birthInputs}>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className={styles.select}
              >
                <option value="">DD</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className={styles.select}
              >
                <option value="">MM</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className={styles.select}
              >
                <option value="">AAAA</option>
                {[...Array(100)].map((_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {error && (
            <p
              style={{ color: "red", fontSize: "0.75rem", marginTop: "0.5rem" }}
            >
              {error}
            </p>
          )}

          <button type="submit" className={styles.button}>
            ¡Registrarme!
          </button>
        </form>

        <button className={styles.close} onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
