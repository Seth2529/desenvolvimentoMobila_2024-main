import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackRouteProp, StackTypes } from '../../routes/stack';
import InviteService from '../../services/inviteServices';

type AcceptInviteProps = {
  route: StackRouteProp<'AcceptInvite'>;
};

const AcceptInvite = ({ route }: AcceptInviteProps) => {
  const navigation = useNavigation<StackTypes>();
  const { inviteId } = route.params ?? { inviteId: undefined };
  const inviteService = new InviteService();

  const handleAccept = async () => {
    if (inviteId !== undefined) {
      try {
        console.log(`Tentando aceitar convite com inviteId: ${inviteId}`);
        await inviteService.acceptInvite(Number(inviteId));
        alert('Aceito com sucesso!');
        navigation.navigate('Home');
      } catch (error) {
        console.error('Erro ao aceitar o convite:', error);
        alert('Erro ao aceitar o convite. Tente novamente mais tarde.');
      }
    } else {
      console.error('ID do convite não fornecido.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deseja aceitar o convite?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={handleAccept}>
          <Text style={styles.buttonText}>Sim</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Não</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242525',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    width: '40%',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AcceptInvite;
