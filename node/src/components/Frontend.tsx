import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import Spinner from "./Spinner";

const Frontend = () => {
  const context = useContext(AuthContext);
  const location = useLocation();
  const [checkingSession, setCheckingSession] = useState(true);

  if (!context) {
    return <div>No está cargado el context</div>;
  }

  const { checkSession } = context;

  useEffect(() => {
    if (location.pathname === "/login") {
      setCheckingSession(false);
      return;
    }

    const valid = checkSession();

    if (valid) {
      setCheckingSession(false);
    }
  }, [location.pathname, checkSession]);

  if (checkingSession) {
    return <Spinner text="Verificando sesión..." />;
  }

  return <Outlet />;
};

export default Frontend;
