import { API_BASE_URL } from '../config/api'; // 1. Importamos la base

// 2. Definimos el endpoint específico para autenticación
const AUTH_URL = `${API_BASE_URL}/auth`;

export const authService = {
  // Login real contra el backend
  login: async (email, password) => {
    try {
      // Usamos AUTH_URL en lugar del string hardcodeado
      const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión');
      }

      if (data.token) {
        localStorage.setItem('user', JSON.stringify(data));
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Registro real
  register: async (userData) => {
    try {
      // 1. Registrar usuario usando AUTH_URL
      const registerResponse = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || 'Error en el registro');
      }

      // 2. Auto-login después del registro exitoso
      return await authService.login(userData.email, userData.password);

    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getAuthHeader: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      return { Authorization: 'Bearer ' + user.token };
    } else {
      return {};
    }
  }
};