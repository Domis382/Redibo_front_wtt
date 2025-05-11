/* import { backendip } from "@/libs/authServices"; */
import styles from "./RegisterModal.module.css";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [nameError, setNameError] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthError, setBirthError] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState("");
  const [error, setError] = useState("");
  const userEmail = localStorage.getItem("google_email");

  useEffect(() => {
    if (!birthDay || !birthMonth || !birthYear) {
      setBirthError("");
      return;
    }

    const selectedDate = new Date(
      Number(birthYear),
      Number(birthMonth) - 1,
      Number(birthDay)
    );

    const today = new Date();

    if (selectedDate > today) {
      setBirthError("La fecha no puede ser futura");
      return;
    }

    let age = today.getFullYear() - selectedDate.getFullYear();
    const m = today.getMonth() - selectedDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setBirthError("Debes tener al menos 18 años");
    } else if (age > 85) {
      setBirthError("La edad máxima permitida es 85 años");
    } else {
      setBirthError("");
    }
  }, [birthDay, birthMonth, birthYear]); // 🔁 DEPENDENCIAS

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    if (name.trim().length < 3) {
      setNameError("El nombre debe tener al menos 3 caracteres");
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
    //Validaciones Fecha de nacimiento
    if (birthDate > new Date()) {
      setError("La fecha de nacimiento no puede ser futura");
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setError("Debes tener al menos 18 años");
      return;
    } else if (age > 85) {
      setError("La edad máxima permitida es de 85 años");
      return;
    }

    const cleanPhone = phoneValue.replace(/\D/g, "");

    if (!/^[67]/.test(cleanPhone)) {
      setPhoneError(true);
      setPhoneMessage("El número debe comenzar con 6 o 7");
      return;
    } else if (!/^\d{8}$/.test(cleanPhone)) {
      setPhoneError(true);
      setPhoneMessage("El número debe tener exactamente 8 dígitos");
      return;
    } else {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://redibo-back-wtt.vercel.app/api/check-phone",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            credentials: "include",
            body: JSON.stringify({ telefono: parseInt(cleanPhone) }),
          }
        );

        const data = await res.json();
        if (data.exists) {
          setPhoneError(true);
          setPhoneMessage("Este número ya está registrado");
          return;
        } else {
          setPhoneError(false);
          setPhoneMessage("");
        }
      } catch (err) {
        console.error("Error al verificar teléfono:", err);
        setPhoneError(true);
        setPhoneMessage("No se pudo validar el número");
        return;
      }
    }

    setError("");

    try {
      const token = localStorage.getItem("token");
      console.log("Token a enviar (CompleteProfileModal):", token);
      const res = await fetch(
        "https://redibo-back-wtt.vercel.app/api/update-profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ AQUÍ ESTÁ LA CLAVE
          },
          credentials: "include",
          body: JSON.stringify({
            email: userEmail,
            nombre_completo: name.trim(),
            fecha_nacimiento: birthDate.toISOString(),
            telefono: "+591" + cleanPhone,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();

        if (data.message?.includes("registrado con email")) {
          alert(
            "Esta cuenta ya fue registrada con correo y contraseña. Por favor inicia sesión manualmente."
          );
          return; //No continuar ni cerrar el modal
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
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            fontWeight: 500,
            color: "blue",
          }}
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
              maxLength={50}
              onChange={(e) => {
                const input = e.target.value;
                const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;

                if (regex.test(input) || input === "") {
                  setName(input);

                  if (input.trim().length > 0 && input.trim().length < 3) {
                    setNameError("El nombre debe tener al menos 3 caracteres");
                  } else if (input.trim().length > 49) {
                    setNameError("El nombre no debe exceder los 50 caracteres");
                  } else {
                    setNameError("");
                  }
                }
              }}
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
              title="Solo se permiten letras y espacios"
              className={styles.input}
              required
            />
            {nameError && (
              <p
                style={{
                  color: "#E30000",
                  fontSize: "0.75rem",
                  marginTop: "0.5rem",
                }}
              >
                {nameError}
              </p>
            )}
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
          {birthError && (
            <p
              style={{
                color: "#E30000",
                fontSize: "0.75rem",
                marginTop: "0.25rem",
              }}
            >
              {birthError}
            </p>
          )}

          {/* Teléfono */}
          <div className={styles.halfInput}>
            <label htmlFor="phone">Teléfono</label>
            <div className={styles.phoneWrapper}>
              <span className={styles.prefix}>+591</span>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phoneValue}
                onChange={(e) => {
                  const newValue = e.target.value;

                  if (!/^\d*$/.test(newValue)) {
                    setPhoneError(true);
                    setPhoneMessage("Solo se permiten números");
                    return;
                  }

                  setPhoneValue(newValue);
                  localStorage.setItem("register_phone", newValue);
                  setPhoneError(false);
                  setPhoneMessage("");
                }}
                maxLength={8}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={
                  phoneError ? "Número inválido" : "Ingrese número de teléfono"
                }
                className={`${styles.input3} ${
                  phoneError ? styles.errorInput : ""
                }`}
              />
            </div>
            {phoneError && phoneMessage && (
              <p
                style={{
                  color: "#E30000",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {phoneMessage}
              </p>
            )}
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

        <button
          className={styles.close}
          onClick={async () => {
            toast.info("Registro cancelado", {
              position: "top-center",
              autoClose: 2500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              theme: "light",
            });

            try {
              const email = localStorage.getItem("google_email");
              if (email) {
                await fetch(
                  "https://redibo-back-wtt.vercel.app/api/delete-incomplete-user",
                  {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ email }),
                  }
                );
              }
            } catch (err) {
              console.error("No se pudo eliminar el usuario incompleto", err);
            }

            setTimeout(() => {
              onClose();
            }, 2000);
          }}
        >
          ✕
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
