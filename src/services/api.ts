import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACK_END_CONNECTION,
  // baseURL: "http://localhost:3001",
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  },
});
