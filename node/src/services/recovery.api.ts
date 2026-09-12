import type {
  Recovery,
  UpdatePassword,
} from "../interfaces/Recovery.interface";

const API_URL = import.meta.env.VITE_API_URL;

export const sendData = async (dto: Recovery) => {
  const response = await fetch(`${API_URL}/recovery`, {
    method: "POST",
    body: JSON.stringify(dto),
    headers: { "content-type": "application/json" },
  });
  return response.status;
};

export const updatePassword = async (dto: UpdatePassword) => {
  const response = await fetch(`${API_URL}/recovery/update/${dto.token}`, {
    method: "POST",
    body: JSON.stringify({ password: dto.password }),
    headers: { "content-type": "application/json" },
  });
  return response.status;
};
