import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity,Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StackRouteProp, StackTypes } from '../../routes/stack';
import UserService from '../../services/userServices';
import { User } from '../../types/types';

type DetailsScreenProps = {
  route: StackRouteProp<'Home'>
};

const Imageicon = require('../../assets/Mascoteh1.png');

const CreateGroup =  ({ route }: DetailsScreenProps) => {
    const [NomeGrupo, setNomeGrupo] = useState<string>('');
    const [Foto, setFoto] = useState<string>('');
    const [Qtdeparticipantes, setQtdeparticipantes] = useState<string>('');
    const [Valor, setValor] = useState<string>('');
    const [Datarevelacao, setDatarevelacao] = useState<Date>();
    const [Descricao, setDescricao] = useState<string>('');
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userService = new UserService();
    const navigation = useNavigation<StackTypes>();

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

      const getUserID = () => {
        var r = route === undefined ? -1 : route.params?.userId;
        return r == undefined ? -1 : r as number;
    }
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (route !== undefined) {
                    const fetchedUser: User = await userService.getUserbyId(getUserID());
                    if (fetchedUser != null && Array.isArray(fetchedUser)) {
                        setUser(fetchedUser[0]);
                    } else {
                        setError('Usuário não encontrado ' + getUserID() + '.');
                    }
                }

            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
                setError('Erro ao buscar usuário. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchUser();
    }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: () => (
            <Text>Crie seu grupo!</Text>
          ),
            headerRight: () => (
                <Image source={Imageicon} style={styles.handlephoto} />
                )
        });
    }, [navigation, user]);

    const handleHome = () => {
      navigation.goBack();

    };

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Crie seu grupo!</Text>
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
          <TextInput
          style={styles.input}
          placeholder="Data revelação"
          onChangeText={text => setDatarevelacao(new Date(text))}
          value={Datarevelacao ? Datarevelacao.toISOString().substr(0, 10) : ''}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            onChangeText={setDescricao}
            value={Descricao}
          />
          <TouchableOpacity onPress={handleHome} style={styles.button} activeOpacity={0.1}>
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
      TextImage:{
        color: '#816c04', 
        margin:10
      },

  });


export default CreateGroup;

