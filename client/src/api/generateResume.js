import axios from "axios";

const URL = import.meta.env.VITE_APP_BACKEND_URL;

export const generateResume = async (payload) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/generate_resume",
      payload,
      { responseType: "blob" } // important to get Blob directly
    );
    return response.data; // This will be a Blob
  } catch (error) {
    console.error("Error generating resume:", error);
  }
};
