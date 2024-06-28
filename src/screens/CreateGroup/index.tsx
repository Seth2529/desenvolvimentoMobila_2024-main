import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, View, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackRouteProp, StackTypes } from '../../routes/stack';
import UserService from '../../services/userServices';
import GroupService from '../../services/groupServices';
import { User } from '../../types/types';
import { useAuth } from '../../provider/AuthProvider';
import Home from '../Home';

type DetailsScreenProps = {
  route: StackRouteProp<'Home'>;
};

const CreateGroup = ({ route }: DetailsScreenProps) => {
  const [NomeGrupo, setNomeGrupo] = useState<string>('');
  const [Foto, setFoto] = useState<string>('');
  const [Qtdeparticipantes, setQtdeparticipantes] = useState<string>('');
  const [Valor, setValor] = useState<string>('');
  const [Datarevelacao, setDatarevelacao] = useState<Date>(new Date());
  const [Descricao, setDescricao] = useState<string>('');
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userService = new UserService();
  const groupService = new GroupService();
  const navigation = useNavigation<StackTypes>();
  const [userImage, setUserImage] = useState<string | undefined>();
  const { user: authUser } = useAuth(); // Utilizando o contexto de autenticação
  const [showDatePicker, setShowDatePicker] = useState(false);

  const decodeBase64Image = (base64String: string): string => {
    const base64Data = base64String.replace(/^data:image\/jpeg;base64,/, '');
    return base64Data;
  };

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

  const fetchUser = async () => {
    try {
      const userId = route.params?.userId || authUser?.userId;
      if (userId !== undefined) {
        const fetchedUser = await userService.getUserById(userId);
        setUser(fetchedUser);
        const decodedImage = decodeBase64Image(fetchedUser.photo);
        setUserImage(`data:image/jpeg;base64,${decodedImage}`);
      } else {
        setError('Usuário não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      setError('Erro ao buscar usuário. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [route.params?.userId, authUser]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text>Crie seu grupo {user?.username ?? '-'}!</Text>,
      headerRight: () => <Image source={{ uri: userImage }} style={styles.handlephoto} />,
    });
  }, [navigation, user, userImage]);

  const handleHome = () => {
    navigation.goBack();
  };

  const handleCreateGroup = async () => {
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

      formData.append('GroupName', NomeGrupo);
  
      formData.append('MaxParticipants', Qtdeparticipantes);
  
      formData.append('Value', Valor);
  
      formData.append('DateDiscover', Datarevelacao?.toISOString() ?? '');
  
      formData.append('Description', Descricao);
  
      formData.append('UserID', authUser?.userId?.toString() ?? '');
  
      const response = await groupService.addGroup(formData);
  
      if (response.status === 200) {
        Alert.alert('Sucesso', 'Grupo cadastrado com sucesso!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Erro', 'Falha ao cadastrar grupo.');
      }
    } catch (error) {
      if (error) {
        console.error('Resposta de erro do servidor:', error);
      } else {
        console.error('Erro ao realizar a requisição:', error);
      }
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o grupo. Por favor, tente novamente.');
    }
  };

  const showMode = (currentMode: 'date') => {
    setShowDatePicker(true);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || Datarevelacao;
    setShowDatePicker(Platform.OS === 'ios');
    setDatarevelacao(currentDate);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickFoto}>
        <Text style={styles.TextImage}>Escolha uma imagem da galeria</Text>
      </TouchableOpacity>
      {Foto && <Image source={{ uri: Foto }} style={{ width: 200, height: 200 }} />}
      <TextInput
        style={styles.input}
        placeholder="Nome do grupo"
        onChangeText={setNomeGrupo}
        value={NomeGrupo}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade máxima participantes"
        onChangeText={setQtdeparticipantes}
        value={Qtdeparticipantes}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor chocolate"
        onChangeText={setValor}
        value={Valor}
      />
      <TouchableOpacity style={styles.input} onPress={() => showMode('date')}>
        <TextInput
          placeholder="Data revelação"
          value={Datarevelacao ? Datarevelacao.toISOString().substr(0, 10) : ''}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker 
          value={Datarevelacao}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        onChangeText={setDescricao}
        value={Descricao}
      />
      <TouchableOpacity onPress={handleCreateGroup} style={styles.button} activeOpacity={0.1}>
        <Text style={styles.buttonText}>Criar grupo</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleHome} style={styles.button} activeOpacity={0.1}>
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
    borderRadius: 8,
    backgroundColor: '#816c04',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffd700',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  handlephoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    right: 1,
  },
  TextImage: {
    color: '#816c04',
    margin: 10,
  },
});

export default CreateGroup;
