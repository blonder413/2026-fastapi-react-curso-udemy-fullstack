import { createContext, useState } from "react";
import type { AuthContextType } from "../types/AutContext.type";
import type { AuthProviderProps } from "../types/AuthProviderProps.type";
import type { CustomAlertInterface } from "../components/ui/CustomAlert";
import CustomAlert from "../components/ui/CustomAlert";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<boolean>(
    localStorage.getItem("menu_token") != null,
  );
  const [confirmData, setConfirmData] = useState<CustomAlertInterface | null>(
    null,
  );

  const showConfirm = (confirmData: Omit<CustomAlertInterface, "state">) => {
    setConfirmData({ ...confirmData, state: true });
  };

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
    showConfirm({
      title: "Cerrar Sesión",
      detail: "¿Realmente desea cerrar la sesión?",
      headerBg: "bg-info",
      isConfirm: true,
      onConfirm: () => {
        localStorage.clear();
        setAuth(false);
        globalThis.location.href = "/login";
      },
      onClose: () => setConfirmData(null),
    });
  };

  const checkAccess = (profile_id: string) => {
    if (localStorage.getItem("menu_profile_id") != profile_id) {
      globalThis.location.href = "/error";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        handleLogin,
        checkSession,
        logout,
        checkAccess,
        showConfirm,
        confirmData,
        setConfirmData,
      }}
    >
      {children}
      {confirmData && (
        <CustomAlert
          state={confirmData.state}
          title={confirmData.title}
          detail={confirmData.detail}
          onClose={confirmData.onClose}
          onConfirm={confirmData.onConfirm}
          headerBg={confirmData.headerBg}
          isConfirm={confirmData.isConfirm}
        />
      )}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
