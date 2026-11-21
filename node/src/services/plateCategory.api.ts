import { authorization } from "../constants/authorization";
import type { PlateCategory } from "../interfaces/PlateCategory";
const api_url = import.meta.env.VITE_API_URL;
const base_url = api_url + "/plates-category";

export const create = async (dto: PlateCategory) => {
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

export const findAll = async () => {
  const response = await fetch(`${base_url}`, {
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

export const update = async (dto: PlateCategory) => {
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
