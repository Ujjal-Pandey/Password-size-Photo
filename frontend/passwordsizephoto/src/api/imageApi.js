import axios from "axios";

const backendUrl = (import.meta.env.VITE_BACKEND_URL || "").toString().trim().replace(/\/$/, "");
const API = backendUrl ? `${backendUrl}/api/image/upload` : "/api/image/upload";

export const uploadImage = async (formData) => {
  try {
    const res = await axios.post(API, formData, {
      timeout: 180000,
    });

    return res.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else if (error.request) {
      throw new Error("No response from server. Check your backend deployment or VITE_BACKEND_URL.");
    } else {
      throw error;
    }
  }
};