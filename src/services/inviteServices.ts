import axios from 'axios';
import { Invite } from '../types/types';

const BASE_URL = 'http://192.168.0.101:5092';

class InviteService {
  async getInvitesByUserId(userId: number): Promise<Invite[]> {
    const response = await axios.get<Invite[]>(`${BASE_URL}/Invite/GetInvitation/${userId}`);
    return response.data;
  }

  async acceptInvite(inviteId: number): Promise<void> {
    try {
      const inviteIdNum = Number(inviteId);
      console.log(`Tentando aceitar convite com inviteId: ${inviteIdNum} (tipo: ${typeof inviteIdNum})`);
      const url = `${BASE_URL}/Invite/AcceptInvitation?invitationId=${inviteIdNum}`;
      console.log(`URL de aceitação: ${url}`);
      await axios.post(url);
    } catch (error) {
      console.error('Erro ao aceitar o convite:', error);
      throw new Error('Erro ao aceitar o convite. Tente novamente mais tarde.');
    }
  }

  async rejectInvite(inviteId: number): Promise<void> {
    try {
      const inviteIdNum = Number(inviteId);
      const url = `${BASE_URL}/Invite/DeleteInvitation?InviteId=${inviteIdNum}`;
      await axios.delete(url);
    } catch (error) {
      console.error('Erro ao rejeitar o convite:', error);
      throw new Error('Erro ao rejeitar o convite. Tente novamente mais tarde.');
    }
  }
  async inviteUser(formData: FormData) {
    try {
      const response = await axios.post(`${BASE_URL}/Invite/InviteUser`, formData, {
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
}

export default InviteService;
