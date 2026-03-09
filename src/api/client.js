import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export function createApiClient(initData, userId) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (initData) {
    headers["X-Init-Data"] = initData;
  }
  if (userId) {
    headers["X-User-Id"] = String(userId);
  }
  return axios.create({ baseURL: API_BASE, headers });
}