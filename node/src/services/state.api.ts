const base_url = import.meta.env.VITE_API_URL + "/state";
const token = localStorage.getItem("menu_token");

export const findAll = async () => {
  const response= fetch(`${base_url}`, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return (await response).json()
};
