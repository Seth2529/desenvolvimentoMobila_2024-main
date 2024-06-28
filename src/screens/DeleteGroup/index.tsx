import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackRouteProp, StackTypes } from '../../routes/stack';
import GroupService from '../../services/groupServices';

type DeleteGroupProps = {
  route: StackRouteProp<'DeleteGroup'>;
};

const DeleteGroup = ({ route }: DeleteGroupProps) => {
  const navigation = useNavigation<StackTypes>();
  const { groupId } = route.params ?? { groupId: undefined };
  const groupService = new GroupService();

  const handleDelete = async () => {
    if (groupId !== undefined) {
      try {
        await groupService.deleteGroup(groupId);
        navigation.navigate('Home');
      } catch (error) {
        console.error('Erro ao deletar grupo:', error);
      }
    } else {
      console.error('ID do grupo não fornecido.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deseja realmente apagar o grupo?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Aceitar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Recusar</Text>
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

export default DeleteGroup;
