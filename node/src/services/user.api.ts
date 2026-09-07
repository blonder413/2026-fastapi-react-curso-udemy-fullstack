const base_url = import.meta.env.VITE_API_URL + "/user";
const token = localStorage.getItem("token");

export const findOne = async (id: number) => {
  const response = await fetch(`${base_url}/${id}`, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return [await response.json(), response.status];
};
