import axios, { AxiosResponse } from 'axios';
import { NewUser, User } from '../types/types';

const BASE_URL = 'http://192.168.0.101:5092';

class UserService {
  async addUser(user: User): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('Username', user.username);
      formData.append('Email', user.email);
      formData.append('Password', user.password);

      console.log('Carregando imagem:', user.photo);
      
      const response = await fetch(user.photo);
      const blob = await response.blob();
      formData.append('Photo', blob, 'profile.jpg');

      console.log('Enviando dados para o servidor...');
      
      const result = await axios.post(`${BASE_URL}/User/AddUser`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Resposta do servidor:', result.status);

      return result.status === 200;
    } catch (error) {
      console.error('Erro ao enviar foto:', error);
      return false;
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
  async forgotPassword(email: string): Promise<void> {
    try {
      await axios.post(`${BASE_URL}/ForgotPassword`, { Email: email });
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await axios.post(`${BASE_URL}/ResetPassword`, { Token: token, NewPassword: newPassword });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
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
