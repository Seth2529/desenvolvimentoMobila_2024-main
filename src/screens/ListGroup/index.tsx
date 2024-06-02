import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StackRouteProp, StackTypes } from '../../routes/stack';
import { FlatList } from 'react-native-gesture-handler';
import UserService from '../../services/userServices';
import { User, Group } from '../../types/types';

type DetailsScreenProps = {
    route: StackRouteProp<'Home'>
  };
  
const Imageicon = require('../../assets/Mascoteh1.png');

const ListGroup = ({ route }: DetailsScreenProps) => {
    const navigation = useNavigation<StackTypes>();
    const [groups, setGroups] = useState<Group[] | null>([]);
    const userService = new UserService();
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const renderItem = ({ item, index }: { item: Group, index: number }) => (
        <View style={styles.item}>
            <View style={styles.info}>
                <Image source={Imageicon} style={styles.photo} resizeMode="contain" />
                <View style={styles.textContainer}>
                    <Text style={styles.InfoText}>Nome do grupo: {item.groupName}</Text>
                    <Text style={styles.InfoText}>Participantes: ({item.participantsNumber}/20)</Text>
                    <Text style={styles.InfoText}>Data: {item.revelation}</Text>
                    <Text style={styles.InfoText}>Valor: {item.value}</Text>
                    <Text style={styles.InfoText}>Descrição: {item.description}</Text>
                </View>
            </View>
        </View>
      );

    const getUserID = () => {
        var r = route === undefined ? -1 : route.params?.userId;
        return r == undefined ? -1 : r as number;
    }

    const handleCreateGroup = () => {
        navigation.navigate('CreateGroup')
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
                <Text>Lista de todos os grupos</Text>
              ),
            headerRight: () => (
                <Image source={Imageicon} style={styles.handlephoto} />
                )
        });
    }, [navigation, user]);

    
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const fetchedGroups = await userService.getAllGroups();
                setGroups(fetchedGroups);
            } catch (error) {
                console.error('Erro ao buscar grupos:', error);
            }
    };
    
        fetchGroups();
    }, []);

    const handleHome = () => {
      navigation.goBack();

    };
  
    return (
        <View style={styles.screen}>
            <View style={styles.container}>
            {loading ? (
                <Text>Carregando...</Text>
            ) : error ? (
                <Text>{error}</Text>
            ) : (
                <View>
                <View style={styles.structure}>
                </View>
                <FlatList
                    data={groups}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    />
                <View style={styles.info}>
                    <TouchableOpacity onPress={handleHome} style={styles.button} activeOpacity={0.1}>
                        <Text style={styles.buttonText}>Voltar</Text>    
                    </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          </View>
        )
    };

  const styles = StyleSheet.create({
    structure: {
        justifyContent: 'center',
      },
    screen:{
        flex: 1,
        backgroundColor: '#242525',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
        marginLeft:10,
        marginRight:10,
        backgroundColor: '#242525',
    },
    item: {
        padding: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        marginBottom: 10,
        backgroundColor: '#D8D8D8',
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 10,
        alignSelf: 'flex-start',
    },
      handlephoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        position: 'absolute',
        right: 1,
      },
      photo: {
        width: 35,
        height: 35,
        borderRadius: 25,
        marginRight: 10,
      },
      InfoText: {
        fontSize: 10,
        fontWeight: "bold",
      },
    button: {
        width: '100%',
        height: 40,
        marginBottom: 20,
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
  

export default ListGroup;

