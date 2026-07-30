// src/utils/cloudinary.js
const CLOUDINARY_CLOUD_NAME = "mbeup6wz";
const CLOUDINARY_UPLOAD_PRESET = "ophelina_productos";

export const subirImagenACloudinary = async (file, folder = "empenos") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error("Error al subir la imagen a Cloudinary");
  }

  const data = await response.json();
  return data.secure_url;
};