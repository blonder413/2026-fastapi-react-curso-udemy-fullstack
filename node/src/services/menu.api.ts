import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const baseUrl = apiUrl + "/menu";
export const findBySlug = async (slug: string) => {
  return await axios
    .get(`${baseUrl}/${slug}`, {
      headers: { "content-type": "application/json" },
    })
    .then((response) => {
      if (response.status != 200) {
        globalThis.location.href = "/error";
      }
      return response.data;
    })
    .catch(() => {
      globalThis.location.href = "/error";
    });
};
