export interface User {
  id: number;
  email: string | null;
  password?: string | null;
  name?: string;
}

export interface JwtPayLoad {
  id: number;
  name?: string;
  provider: string;
  providerId: string;
  email?: string;
}

export interface RefreshTokenPayload {
  id: number;
  provider: string;
  providerId: string;
}