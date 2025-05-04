export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  specialization: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface MultipartRegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  specialization: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  // Les documents seront gérés par FormData
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  username: string;
  roles: string[];
  expiresIn: number;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AdminRegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserDetails {
  id: number;
  username: string;
  roles: Role[];
}

export interface Role {
  id: number;
  name: string;
}

export interface PasswordResetToken {
  id: number;
  token: string;
  user: UserDetails;
  expiryDate: Date;
}
