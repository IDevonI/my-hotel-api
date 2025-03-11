export interface User {
  id: string;
  email: string;
  password_hash?: string;
  role: string;
  name: string;
  surname: string;
  phone?: string;
  created_at?: Date;
}

export interface AuthInfo {
  id: string;
  password_hash: string;
}