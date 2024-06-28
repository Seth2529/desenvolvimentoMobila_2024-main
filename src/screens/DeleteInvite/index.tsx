import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackRouteProp, StackTypes } from '../../routes/stack';
import GroupService from '../../services/groupServices';
import InviteService from '../../services/inviteServices';

type DeletetInviteProps = {
  route: StackRouteProp<'DeleteInvite'>;
};

const DeleteInvite = ({ route }: DeletetInviteProps) => {
  const navigation = useNavigation<StackTypes>();
  const { inviteId } = route.params ?? { inviteId: undefined };
  const inviteService = new InviteService();

  const handleDelete = async () => {
    if (inviteId !== undefined) {
      try {
        await inviteService.rejectInvite(inviteId);
        alert('Recusado com sucesso!');
        navigation.navigate('Home');
      } catch (error) {
        console.error('Erro ao deletar o convite:', error);
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
      <Text style={styles.title}>Deseja realmente apagar o convite?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={handleDelete}>
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
    width: 120,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: 'green',
  },
  declineButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default DeleteInvite;
