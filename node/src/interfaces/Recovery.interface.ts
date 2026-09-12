export interface Recovery {
  email: string;
}

export interface UpdatePassword {
  token: string;
  password: string;
}
