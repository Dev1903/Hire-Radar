import axios from "axios";

const URL = import.meta.env.VITE_APP_BACKEND_URL

export const uploadResume = async (formData) => {
  try {
    const res = await axios.post(`${URL}/upload_resume`, formData);
    console.log(res);
    return res;
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
};