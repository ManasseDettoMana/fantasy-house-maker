export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  ruolo: string;
}