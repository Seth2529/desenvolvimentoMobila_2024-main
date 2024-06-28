import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Image, View, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StackTypes } from '../../routes/stack';
import UserService from '../../services/userServices';
import PassWordInput from '../../components/Password';

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
      const formData = new FormData();

      if (Foto) {
        const photoUriParts = Foto.split('.');
        const fileType = photoUriParts[photoUriParts.length - 1];
        const fileName = Foto.split('/').pop();

        formData.append('Photo', {
          uri: Foto,
          name: fileName,
          type: `image/${fileType}`,
        } as any);
      }

      formData.append('Username', Nome);
      formData.append('Email', Email);
      formData.append('Password', Senha);

      const response = await userService.addUser(formData);

      if (response.status === 200) {
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
        navigation.navigate('Login'); // ou a rota que você desejar
      } else {
        Alert.alert('Erro', 'Falha ao cadastrar usuário.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o usuário.');
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
      <PassWordInput
        placeholder="Digite sua senha"
        onChangeText={setSenha}
        value={Senha}
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
