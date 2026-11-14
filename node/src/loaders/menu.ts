import type { LoaderFunction } from "react-router-dom";
import type { LoaderParams } from "../interfaces/Loader";
import { findBySlug } from "../services/menu.api";

export const loader: LoaderFunction = async ({ params }) => {
  const typedParams = params as LoaderParams;
  const data = await findBySlug(typedParams.slug);
  return { data };
};
