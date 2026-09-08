export type AuthContextType = {
  auth: boolean;
  handleLogin: (
    id: string,
    name: string,
    token: string,
    profile_id: string,
  ) => void;
  checkSession: () => boolean;
};
