import axios from "axios";
import type { Profile } from "../interfaces/Profile.interface";

const apiUrl = import.meta.env.VITE_API_URL;
const basePath = apiUrl + "/profile";
const token = localStorage.getItem("menu_token");

export const findAll = async () => {
  return axios
    .get(basePath, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status == 200) {
        return response.data;
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const create = async (dto: Profile) => {
  return axios
    .post(basePath, dto, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.status)
    .catch((error) => {
      console.error(error);
    });
};
