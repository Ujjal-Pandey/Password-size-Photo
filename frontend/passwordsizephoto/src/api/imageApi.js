import axios from "axios";
console.log("API URL:", import.meta.env.VITE_BACKEND_URL);

const API = `${import.meta.env.VITE_BACKEND_URL}/api/image/upload`;

export const uploadImage = async (formData) => {
  try {
    const res = await axios.post(API, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000,
    });

    return res.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw error;
    } else if (error.request) {
      // Request made but no response
      throw new Error("No response from server. Check if backend is running on " + import.meta.env.VITE_BACKEND_URL);
    } else {
      throw error;
    }
  }
};