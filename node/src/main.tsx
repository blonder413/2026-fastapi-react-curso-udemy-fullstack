import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import "/public/css/app.css";
import router from "./router";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <AuthProvider>
      <RouterProvider router={router} />,
    </AuthProvider>,
  );
}
