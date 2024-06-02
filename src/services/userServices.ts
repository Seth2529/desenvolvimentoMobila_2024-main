import axios, { AxiosResponse } from 'axios';
import { Group, User } from '../types/types';

const BASE_URL = 'http://192.168.0.101:3000';

class UserService {

    constructor() {
        // Se necessário, adicione inicializações aqui
    }

    async addUser(user: User): Promise<boolean> {
        try {
            const formData = new FormData();
            formData.append('username', user.username);
            formData.append('password', user.password);

            const responsePhoto = await fetch(user.photo);
            const blob = await responsePhoto.blob();
            formData.append('photo', blob, 'photo.png');

            const uploadResponse = await axios.post(`${BASE_URL}/users/addUser`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return uploadResponse.status === 201;

        } catch (error) {
            console.error('Erro ao adicionar usuário:', error);
            return false; // Retorna false em caso de erro
        }
    }

    async validateUser(username: string, password: string): Promise<number> {
      try {
          const response: AxiosResponse<User[]> = await axios.get(`${BASE_URL}/User?username=${username}&password=${password}`);
          if (response.data.length === 0) {
            return -1;
          }
          
          return response.data.at(0)?.id as number; 
      } catch (error) {
        console.error('Erro ao validar usuário:', error);
        return -1; // Retorna false em caso de erro
      }
    }

    async getUserbyId(userId: number): Promise<User> {
        try {
            const response: AxiosResponse<User> = await axios.get(`${BASE_URL}/User?id=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar usuário pelo ID:', error);
            return { id: 0, username: '', password: '', photo: '' };
        }
    }

    async getAllUsers(): Promise<User[] | null> {
        try {
            const response: AxiosResponse<User[]> = await axios.get(`${BASE_URL}/User`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar todos os usuários:', error);
            return null;
        }
    }
  
  async getAllGroups(): Promise<Group[] | null> {
        try {
            const response: AxiosResponse<Group[]> = await axios.get(`${BASE_URL}/Group`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar todos os grupos:', error);
            return null;
        }
    }
}

export default UserService;
