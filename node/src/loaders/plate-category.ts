import { findAll } from "../services/plateCategory.api";

export const loader = async () => {
  const data = await findAll();
  return { data };
};
