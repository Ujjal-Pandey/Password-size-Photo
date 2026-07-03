import axios from "axios";

const backendUrl = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
const API = `${backendUrl || (import.meta.env.PROD ? "" : "http://localhost:5000")}/api/image/upload`;

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
      throw error;
    } else if (error.request) {
      throw new Error("No response from server. Check if backend is running on " + (backendUrl || "the current site"));
    } else {
      throw error;
    }
  }
};