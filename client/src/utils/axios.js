import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://tenem-ai.onrender.com",
});

export default axiosInstance;