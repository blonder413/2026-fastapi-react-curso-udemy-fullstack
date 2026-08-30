import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "/public/css/app.css";
import Frontend from "./components/Frontend";
import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Frontend />,
    children: [
      { index: true, element: <Home />, errorElement:<Error500 /> },
      { path: "*", element: <Error404 /> },
    ],
  },
]);
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <RouterProvider router={router}></RouterProvider>,
  );
}
