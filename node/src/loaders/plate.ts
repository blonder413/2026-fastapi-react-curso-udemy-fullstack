import { findByUser } from "../services/business.api";
import { findByBussiness } from "../services/plate.api";
import { findAll } from "../services/plateCategory.api";

export const loader = async () => {
  const user_id = Number(localStorage.getItem("menu_id"));
  if (isNaN(user_id)) {
    throw new Error("Usuario no válido");
  }
  const bussiness = await findByUser(user_id);
  if (bussiness.status.status_code != 200) {
    throw new Error("El negocio no existe");
  }

  const data = await findByBussiness(bussiness.response.id);
  const categories = await findAll();
  return { bussiness, categories, data };
};
