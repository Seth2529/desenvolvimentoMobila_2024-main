import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackTypes } from '../../routes/stack';
import UserService from '../../services/userServices';

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const navigation = useNavigation<StackTypes>();
  const userService = new UserService();

  const handleForgotPassword = async () => {
    try {
      if (!email) {
        alert('Por favor, digite seu email.');
        return;
      }

      const success = await userService.forgotPassword(email);
      if (success) {
        alert('Um email com o token de redefinição foi enviado para você.');
        navigation.navigate('ResetPassword');
      } else {
        alert('Usuário não encontrado. Verifique seu email e tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      alert('Erro ao solicitar redefinição de senha. Tente novamente mais tarde.');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esqueci a senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        onChangeText={setEmail}
        value={email}
      />
      <TouchableOpacity onPress={handleForgotPassword} style={styles.button} activeOpacity={0.1}>
        <Text style={styles.buttonText}>Enviar email</Text>
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

export default ForgotPassword;
