import { authorization } from "../constants/authorization";
import type { Business } from "../interfaces/Business";

const api_url = import.meta.env.VITE_API_URL;
const base_url = api_url + "/business";

export const findByUser = async (id: number) => {
  const response = await fetch(`${api_url}/business-by-user/${id}`, {
    headers: {
      "content-type": "application/json",
      Authorization: authorization,
    },
  });
  return await response.json();
};

export const findOne = async (id: number) => {
  const response = await fetch(`${base_url}/${id}`, {
    headers: {
      "content-type": "application/json",
      Authorization: authorization,
    },
  });
  return await response.json();
};

export const findAll = async () => {
  const response = await fetch(`${base_url}`, {
    headers: {
      "content-type": "application/json",
      Authorization: authorization,
    },
  });
  return await response.json();
};

export const create = async (dto: Business) => {
  const response = await fetch(base_url, {
    body: JSON.stringify(dto),
    headers: {
      "content-type": "application/json",
      Authorization: authorization,
    },
    method: "POST",
  });
  return await response.json();
};

export const update = async (dto: Business) => {
  const response = await fetch(`${base_url}/${dto.id}`, {
    body: JSON.stringify(dto),
    headers: {
      "content-type": "application/json",
      Authorization: authorization,
    },
    method: "PUT",
  });
  return await response.json();
};

export const remove = async (id: number) => {
  const response = await fetch(`${base_url}/${id}`, {
    headers: {
      "content-type": "application/json",
      Authorization: authorization,
    },
    method: "DELETE",
  });
  return response.json();
};

export const setLogo = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append("id", id.toString());
  formData.append("file", file);
  try {
    const response = await fetch(`${api_url}/business-logo`, {
      body: formData,
      headers: {
        Authorization: authorization,
      },
      method: "POST",
    });
    return response.json();
  } catch {
    console.error("Error al subir el logo");
    throw new Error("Error al subir el logo");
  }
};
