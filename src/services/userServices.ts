import axios, { AxiosResponse } from 'axios';
import { User } from '../types/types';

const BASE_URL = 'http://192.168.0.101:5092';

class UserService {
  async addUser(formData: FormData) {
    try {
      const response = await axios.post(`${BASE_URL}/User/AddUser`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<number> {
    try {
      const formData = new FormData();
      formData.append('Email', email);
      formData.append('Password', password);
  
      const response: AxiosResponse<{ success: boolean; message: string }> = await axios.post(`${BASE_URL}/Auth/Authenticate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.success) {
        const userResponse: AxiosResponse<User> = await axios.get(`${BASE_URL}/Auth/GetUserByEmail?email=${email}`);
        return userResponse.data.userId;
      } else {
        return -1;
      }
    } catch (error) {
      console.error('Erro ao validar usuário:', error);
      return -1;
    }
  }
  async forgotPassword(email: string): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('Email', email);
      const response = await axios.post(`${BASE_URL}/Auth/ForgotPassword`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      return false;
    }
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('Email', email);
      formData.append('Token', token);
      formData.append('NewPassword', newPassword);
  
      const response = await axios.post(`${BASE_URL}/Auth/ResetPassword`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Erro ao redefinir senha:', error.response.data);
        } else {
          console.error('Erro ao redefinir senha:', error.message);
        }
      } else {
        console.error('Erro desconhecido ao redefinir senha:', (error as Error).message);
      }
    }
  }
  async getUserById(userId: number): Promise<User> {
    try {
      const response: AxiosResponse<User> = await axios.get(`${BASE_URL}/User/GetUserById?userid=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário pelo ID:', error);
      throw error;
    }
  }
  async getAllUsers(): Promise<User[] | null> {
    try {
      const response: AxiosResponse<User[]> = await axios.get(`${BASE_URL}/GetAllUsers`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar todos os usuários:', error);
      return null;
    }
  }
}

export default UserService;
