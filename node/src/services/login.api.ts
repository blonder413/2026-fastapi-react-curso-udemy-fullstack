import type { LoginInterface } from "../interfaces/Login.interface";

export const login = async (data: LoginInterface) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json" },
  });
  return [await response.json(), response.status];
};
