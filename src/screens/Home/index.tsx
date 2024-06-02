import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StackRouteProp, StackTypes } from '../../routes/stack';
import UserService from '../../services/userServices';
import { useEffect, useState } from 'react';
import { User, Group } from '../../types/types';
import { FlatList } from 'react-native-gesture-handler';

type DetailsScreenProps = {
  route: StackRouteProp<'Home'>;
};

const Imageicon = require('../../assets/Mascoteh1.png');

const Home = ({ route }: DetailsScreenProps) => {
  const [user, setUser] = useState<User>();
  const [groups, setGroups] = useState<Group[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<StackTypes>();
  const userService = new UserService();

  const renderItem = ({ item, index }: { item: Group; index: number }) => (
    <View style={styles.item}>
      <View style={styles.userInfo}>
        <Image source={Imageicon} style={styles.photo} resizeMode="contain" />
        <Text style={styles.userInfoText}>{item.groupName}</Text>
        <Text style={styles.userInfoText}> ({item.participantsNumber}/20)</Text>
      </View>
    </View>
  );

  const getUserID = () => {
    var r = route === undefined ? -1 : route.params?.userId;
    return r == undefined ? -1 : (r as number);
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };
  const handleListGroup = () => {
    navigation.navigate('ListGroup');
  };
  const handleInvite = () => {
    navigation.navigate('Invite');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (route !== undefined) {
          const fetchedUser: User = await userService.getUserbyId(1);
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text>Bem vindo {user?.username ?? '-'}</Text>,
      headerRight: () => <Image source={Imageicon} style={styles.handlephoto} />,
    });
  }, [navigation, user]);

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
            <View style={styles.userInfo}>
              <Text style={styles.textGroup}>Grupos</Text>
              <TouchableOpacity onPress={handleCreateGroup} style={styles.buttonAdd} activeOpacity={0.1}>
                <Text style={styles.groupAdd}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList data={groups} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />
          <View style={styles.info}>
            <TouchableOpacity onPress={handleListGroup} style={[styles.button, { marginRight: 5 }]} activeOpacity={0.1}>
              <Text style={styles.buttonText}>Listar grupos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleInvite} style={[styles.button, { marginLeft: 5 }]} activeOpacity={0.1}>
              <Text style={styles.buttonText}>Convites</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:{
    flex: 1,
    backgroundColor: '#242525',
  },
  groupAdd:{
    color:'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    top: 30,
    bottom: 30,
    right: 30,
    left: 30,
    backgroundColor: '#242525',
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  structure: {
    justifyContent: 'space-between',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 0,
    color: '#fff',
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
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
  buttonAdd: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#816c04',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffd700',
    position: 'absolute',
    right: 1,
  },
  button: {
    flex: 1,
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

export default Home;

