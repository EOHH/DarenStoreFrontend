import { API_BASE_URL } from '../config/api';
import { authService } from './authService';

const PRODUCT_URL = `${API_BASE_URL}/products`;

export const productService = {
  // 🔓 OBTENER TODOS (Público)
  getAll: async () => {
    try {
      const response = await fetch(PRODUCT_URL);
      
      if (!response.ok) {
        throw new Error('Error al cargar el catálogo');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error en getAll:", error);
      throw error;
    }
  },

  // 🔓 OBTENER POR ID (Público)
  getById: async (id) => {
    try {
      const response = await fetch(`${PRODUCT_URL}/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
           throw new Error('Producto no encontrado');
        }
        throw new Error('Error al cargar el detalle del producto');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // 🔒 CREAR (Privado - Requiere Token)
  create: async (productData) => {
    try {
      const response = await fetch(PRODUCT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader() // Inyecta: { Authorization: "Bearer <token>" }
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'No se pudo crear el producto');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // 🔒 ACTUALIZAR (Privado - Requiere Token)
  update: async (id, productData) => {
    try {
      const response = await fetch(`${PRODUCT_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader()
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el producto');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // 🔒 ELIMINAR (Privado - Requiere Token)
  delete: async (id) => {
    try {
      const response = await fetch(`${PRODUCT_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          ...authService.getAuthHeader()
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar el producto');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
};