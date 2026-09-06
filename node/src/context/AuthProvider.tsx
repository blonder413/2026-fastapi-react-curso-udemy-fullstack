import { createContext, useState } from "react";
import type { AuthContextType } from "../types/AutContext.type";
import type { AuthProviderProps } from "../types/AuthProviderProps.type";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<boolean>(true);
  return (
    <AuthContext.Provider value={{ auth }}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
