import { createContext, useState } from "react";
import type { AuthContextType } from "../types/AutContext.type";
import type { AuthProviderProps } from "../types/AuthProviderProps.type";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<boolean>(
    localStorage.getItem("menu_id") != null,
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

  return (
    <AuthContext.Provider value={{ auth, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
