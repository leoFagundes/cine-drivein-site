import axios from "axios";

export const api = axios.create({
  baseURL: "https://cine-drivein-backend-production.onrender.com",
  // baseURL: "http://localhost:3001",
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  },
});
