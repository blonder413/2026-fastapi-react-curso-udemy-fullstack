import { authorization } from "../constants/authorization";
import type { CreateUserDto } from "../dto/CreateUser.dto";
import type { UpdateUserDto } from "../dto/UpdateUser.dto";

const base_url = import.meta.env.VITE_API_URL + "/user";

export const findOne = async (id: number) => {
  const response = await fetch(`${base_url}/${id}`, {
    headers: {
      "content-type": "application/json",
      Authorization: authorization,
    },
  });
  return [await response.json(), response.status];
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

export const create = async (dto: CreateUserDto) => {
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

export const update = async (dto: UpdateUserDto) => {
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
