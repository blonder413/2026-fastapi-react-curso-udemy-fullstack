import { createContext, useState } from "react";
import type { AuthContextType } from "../types/AutContext.type";
import type { AuthProviderProps } from "../types/AuthProviderProps.type";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<boolean>(
    localStorage.getItem("menu_token") != null,
  );

  const handleLogin = (
    id: string,
    name: string,
    token: string,
    profile_id: string,
  ) => {
    localStorage.setItem("menu_id", id);
    localStorage.setItem("menu_name", name);
    localStorage.setItem("menu_token", token);
    localStorage.setItem("menu_profile_id", profile_id);
    setAuth(true);
  };

  const checkSession = () => {
    const token = localStorage.getItem("menu_token");

    if (token === null) {
      setAuth(false);
      globalThis.location.href = "/login";
      return false;
    }

    setAuth(true);
    return true;
  };

  const logout = () => {
    if (window.confirm("¿desea cerrar sesión?")) {
      localStorage.clear();
      setAuth(false);
      globalThis.location.href = "/login";
    }
  };

  const checkAccess = (profile_id: string) => {
    if (localStorage.getItem("menu_profile_id") != profile_id) {
      globalThis.location.href = "/error";
    }
  };

  return (
    <AuthContext.Provider
      value={{ auth, handleLogin, checkSession, logout, checkAccess }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
