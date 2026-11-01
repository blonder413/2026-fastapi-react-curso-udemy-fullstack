import { findOne } from "../services/business.api";
import { findAll as findAllCateories } from "../services/category.api";
import { findAll as findAllStates } from "../services/state.api";
import { findAll as findAllUsers } from "../services/user.api";

interface loaderProps {
  request: Request;
}

export const loader = async ({ request }: loaderProps) => {
  const url = new URL(request.url);
  const action = url.searchParams.get("accion");
  const id = parseInt(url.searchParams.get("id"));
  const categories = await findAllCateories();
  const users = await findAllUsers();
  const states = await findAllStates();
  const business = action === "edit" ? await findOne(id) : null;
  return { business, categories, states, users, action, id };
};
