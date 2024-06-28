import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { StackRouteProp, StackTypes } from '../../routes/stack';
import UserService from '../../services/userServices';
import { useNavigation } from '@react-navigation/native';

type DetailsScreenProps = {
    route: StackRouteProp<'ResetPassword'>;
  };
  
const ResetPassword = ({ route }: DetailsScreenProps) =>  {
  const [token, setToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [email,setEmail ] = useState<string>('');

  const userService = new UserService();
  const navigation = useNavigation<StackTypes>();

  const handleBack = () => {
    navigation.goBack();
  };
  const handleResetPassword = async () => {
    try {
      if (!token || !newPassword || !email) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
      await userService.resetPassword(email, token, newPassword);
      alert('Senha redefinida com sucesso.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      alert('Erro ao redefinir senha. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redefinir Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite o token recebido por email"
        onChangeText={setToken}
        value={token}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite a nova senha"
        onChangeText={setNewPassword}
        value={newPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleResetPassword} style={styles.button} activeOpacity={0.1}>
        <Text style={styles.buttonText}>Redefinir Senha</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBack} style={styles.button} activeOpacity={0.1}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#242525',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      color: '#816c04',
    },
    input: {
      width: '50%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 20,
      paddingHorizontal: 10,
      backgroundColor: '#fff',
    },
    button: {
      width: '50%',
      height: 40,
      margin: 5,
      borderRadius: 8,
      backgroundColor: '#816c04',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });

export default ResetPassword;
