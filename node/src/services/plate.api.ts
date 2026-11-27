import axios from "axios";
import { authorization } from "../constants/authorization";
import type { CreatePlateDto } from "../dto/CreatePlate.dto";

const api_url = import.meta.env.VITE_API_URL;
const base_url = api_url + "/plate";

export const findByBussiness = async (id: number) => {
  return axios
    .get(`${base_url}?business_id=${id}`, {
      headers: {
        "content-type": "application/json",
        Authorization: authorization,
      },
    })
    .then((response) => {
      if (response.data.status.status_code == 200) {
        return response.data;
      } else {
        console.error("error");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const create = async (dto: CreatePlateDto) => {
  const formData = new FormData();
  formData.append("plates_category_id", dto.plates_category_id.toString());
  formData.append("business_id", dto.business_id.toString());
  formData.append("name", dto.name);
  formData.append("ingredients", dto.ingredients);
  formData.append("price", dto.price.toString());
  formData.append("file", dto.file);

  return axios
    .post(base_url, formData, {
      headers: { Authorization: authorization },
    })
    .then((response) => {
      return response.data;
    })
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
