import { findAll } from "../services/business.api";

export const loader = async () => {
  const data = await findAll();
  return { data };
};
