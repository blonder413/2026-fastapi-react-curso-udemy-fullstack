import type { CustomAlertInterface } from "../components/ui/CustomAlert";

export type AuthContextType = {
  auth: boolean;
  handleLogin: (
    id: string,
    name: string,
    token: string,
    profile_id: string,
  ) => void;
  checkSession: () => boolean;
  logout: () => void;
  checkAccess: (profile_id: string) => void;
  showConfirm: (confirmData: Omit<CustomAlertInterface, "state">) => void;
  confirmData: CustomAlertInterface | null;
  setConfirmData: React.Dispatch<
    React.SetStateAction<CustomAlertInterface | null>
  >;
};
