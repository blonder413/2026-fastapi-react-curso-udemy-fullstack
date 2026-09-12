import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Frontend from "./components/Frontend";
import { AuthProvider } from "./context/AuthProvider";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Home from "./pages/Home";
import Login from "./pages/Login";
import "/public/css/app.css";
import Recovery from "./pages/Recovery";
import UpdatePassword from "./pages/UpdatePassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Frontend />,
    children: [
      { index: true, element: <Home />, errorElement: <Error500 /> },
      { path: "/login", element: <Login />, errorElement: <Error500 /> },
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
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <AuthProvider>
      <RouterProvider router={router} />,
    </AuthProvider>,
  );
}
