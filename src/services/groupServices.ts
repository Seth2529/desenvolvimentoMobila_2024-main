import axios from 'axios';
import { Group } from '../types/types';

const BASE_URL = 'http://192.168.0.101:5092';

class GroupService {
  async getGroupsByUserId(userId: number): Promise<Group[]> {
    const response = await axios.get<Group[]>(`${BASE_URL}/Group/GetGroupsByUser/${userId}`);
    return response.data;
  }

  async addGroup(formData: FormData) {
    try {
      const response = await axios.post(`${BASE_URL}/Group/AddGroup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Erro ao cadastrar grupo:', error);
      throw error;
    }
  }

  async deleteGroup(groupId: number): Promise<void> {
    try {
      const url = `${BASE_URL}/Group/DeleteGroup?groupId=${groupId}`;
      await axios.delete(url);
      console.log(`Grupo com ID ${groupId} deletado com sucesso.`);
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
      throw new Error('Erro ao deletar grupo. Tente novamente mais tarde.');
    }
  }

  async getParticipantCount(groupid: number): Promise<string> {
    const response = await axios.get<string>(`${BASE_URL}/Group/GetParticipantCount/${groupid}`);
    return response.data;
  }
}

export default GroupService;
