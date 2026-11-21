import { createBrowserRouter } from "react-router-dom";
import Recovery from "./pages/Recovery";
import UpdatePassword from "./pages/UpdatePassword";
import Profile, { loader as profileLoader } from "./pages/Profile";
import User from "./pages/User";
import { loader as userLoader } from "./loaders/user";
import Business from "./pages/business/Business";
import { loader as businessLoader } from "./loaders/business";
import { loader as businessLoaderForm } from "./loaders/business.form";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Frontend from "./components/Frontend";
import BusinessForm from "./pages/business/BusinessForm";
import Menu from "./pages/Menu";
import { loader as menuLoader } from "./loaders/menu";
import PlateCategory from "./pages/business/PlateCategory";
import { loader as plateCategoryLoader } from "./loaders/plate-category";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Frontend />,
    children: [
      { index: true, element: <Home />, errorElement: <Error500 /> },
      { path: "/login", element: <Login />, errorElement: <Error500 /> },
      {
        path: "/perfiles",
        element: <Profile />,
        errorElement: <Error500 />,
        loader: profileLoader,
      },
      {
        path: "/usuarios",
        element: <User />,
        errorElement: <Error500 />,
        loader: userLoader,
      },
      {
        path: "/negocios/listar",
        element: <Business />,
        errorElement: <Error500 />,
        loader: businessLoader,
      },
      {
        path: "/negocios/formulario",
        element: <BusinessForm />,
        errorElement: <Error500 />,
        loader: businessLoaderForm,
      },
      {
        path: "/negocios/platos-categorias",
        element: <PlateCategory />,
        errorElement: <Error500 />,
        loader: plateCategoryLoader,
      },
      { path: "*", element: <Error404 /> },
    ],
  },
  {
    path: "/carta/:slug",
    element: <Menu />,
    loader: menuLoader,
    errorElement: <Error500 />,
  },
  {
    path: "/restablecer",
    element: <Recovery />,
  },
  {
    path: "/recovery/update/:token",
    element: <UpdatePassword />,
    errorElement: <Error500 />,
  },
]);

export default router;
