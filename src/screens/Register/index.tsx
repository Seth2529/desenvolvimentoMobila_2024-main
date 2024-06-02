import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, Image, View, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native';
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
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

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
    try{
      const usuario: User ={
        id: 3,
        username: Nome,
        password: Senha,
        photo: Foto
      };

      const userAdded = await userService.addUser(usuario);
      if(userAdded){
        console.log('Usuário adicionado com sucesso!');
      }else{
        console.log('Erro ao adicionar usuário');
      }
    } catch(error){
        console.error('Error uploading image:', error);
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
  TextImage:{
    color: '#816c04', 
    margin:10
  },
  button: {
    width: '50%',
    height: 40,
    margin:5,
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
