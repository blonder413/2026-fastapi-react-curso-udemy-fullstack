import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const basePath = apiUrl + "/category";
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
