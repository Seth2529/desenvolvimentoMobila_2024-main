import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Image, View, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StackTypes } from '../../routes/stack';
import { User } from '../../types/types';
import UserService from '../../services/userServices';

const Register = () => {
  const [Foto, setFoto] = useState<string>('');
  const [Nome, setNome] = useState<string>('');
  const [Email, setEmail] = useState<string>('');
  const [Senha, setSenha] = useState<string>('');

  const pickFoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const navigation = useNavigation<StackTypes>();

  const handleBack = () => {
    navigation.goBack();
  }

  const userService = new UserService();

  const handleRegister = async () => {
    try {
      const usuario: Omit<User, 'userId'> = {
        username: Nome,
        password: Senha,
        email: Email,
        photo: Foto
      };

      console.log('Dados do usuário:', usuario);

      const userAdded = await userService.addUser(usuario as User);
      console.log('Resposta ao adicionar usuário:', userAdded);
      if (userAdded) {
        Alert.alert('Sucesso', 'Usuário adicionado com sucesso!');
      } else {
        Alert.alert('Erro', 'Erro ao adicionar usuário');
      }
    } catch (error) {
      Alert.alert('Erro', `Erro ao adicionar usuário: ${error}`);
    }
  };

  const testConnection = async () => {
    try {
      const response = await userService.testConnection();
      if (response) {
        Alert.alert('Sucesso', 'Conexão com a API realizada com sucesso.');
      } else {
        Alert.alert('Erro', 'Falha ao conectar com a API.');
      }
    } catch (error) {
      Alert.alert('Erro', `Erro ao testar conexão: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registre-se!</Text>
      <TouchableOpacity onPress={pickFoto}>
        <Text style={styles.TextImage}>Escolha uma imagem da galeria</Text>
      </TouchableOpacity>
      {Foto && <Image source={{ uri: Foto }} style={{ width: 200, height: 200 }} />}
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        onChangeText={setNome}
        value={Nome}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        onChangeText={setEmail}
        value={Email}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry={true}
        onChangeText={setSenha}
      />
      <TouchableOpacity onPress={handleRegister} style={styles.button} activeOpacity={0.1}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={testConnection} style={styles.button} activeOpacity={0.1}>
        <Text style={styles.buttonText}>Testar Conexão</Text>
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
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  TextImage: {
    color: '#816c04',
    margin: 10,
  },
  button: {
    width: '50%',
    height: 40,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#816c04',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Register;
