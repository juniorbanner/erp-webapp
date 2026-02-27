import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export function createApiClient(initData) {
  return axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
      "X-Init-Data": initData,
    },
  });
}
