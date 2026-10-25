import { createBrowserRouter } from "react-router-dom";
import Recovery from "./pages/Recovery";
import UpdatePassword from "./pages/UpdatePassword";
import Profile, { loader as profileLoader } from "./pages/Profile";
import User from "./pages/User";
import { loader as userLoader } from "./loaders/user";
import Business from "./pages/business/Business";
import { loader as businessLoader } from "./loaders/business";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Frontend from "./components/Frontend";

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
      { path: "*", element: <Error404 /> },
    ],
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
