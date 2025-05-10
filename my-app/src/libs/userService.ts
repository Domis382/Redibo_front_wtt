// libs/userService.ts
export const updateUserField = async (campo: string, valor: string) => {
    const token = localStorage.getItem("token");
  
    const res = await fetch("https://redibo-back-wtt.vercel.app/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // asegúrate que sea Bearer
      },
      credentials: "include",
      body: JSON.stringify({ campo, valor }),
    });
  
    if (!res.ok) {
      throw new Error("Error al actualizar el campo");
    }
  
    return res.json();
  };

  export const uploadProfilePhoto = async (file: File) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('foto_perfil', file); // el mismo nombre que usa multer 👈
  
    const res = await fetch('https://redibo-back-wtt.vercel.app/api/upload-profile-photo', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: formData,
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al subir la foto');
    }
  
    return res.json(); // va a traer { message, foto_perfil }
  };

  export const deleteProfilePhoto = async () => {
    const token = localStorage.getItem('token');
  
    const res = await fetch('https://redibo-back-wtt.vercel.app/api/delete-profile-photo', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al eliminar la foto');
    }
  
    return res.json(); // { message }
  };

  