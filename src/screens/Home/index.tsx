import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { StackRouteProp, StackTypes } from '../../routes/stack';
import UserService from '../../services/userServices';
import GroupService from '../../services/groupServices';
import { User, Group } from '../../types/types';
import { useAuth } from '../../provider/AuthProvider';

type DetailsScreenProps = {
  route: StackRouteProp<'Home'>;
};

const Home = ({ route }: DetailsScreenProps) => {
  const [user, setUser] = useState<User>();
  const [groups, setGroups] = useState<Group[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | undefined>();
  const navigation = useNavigation<StackTypes>();
  const userService = new UserService();
  const groupService = new GroupService();
  const { user: authUser, logout } = useAuth();

  const decodeBase64Image = (base64String: string): string => {
    const base64Data = base64String.replace(/^data:image\/jpeg;base64,/, '');
    return base64Data;
  };

  const fetchParticipantCounts = async (groups: Group[]) => {
    try {
      const updatedGroups = await Promise.all(groups.map(async (group) => {
        try {
          if (group.groupID) {
            const participantCount = await groupService.getParticipantCount(group.groupID);
            return { ...group, participantCount };
          } else {
            return group;
          }
        } catch (error) {
          return group;
        }
      }));
      setGroups(updatedGroups);
    } catch (error) {
      setError('Erro ao buscar contagem de participantes. Tente novamente mais tarde.');
    }
  };

  const fetchGroups = async (userId: number) => {
    try {
      const fetchedGroups = await groupService.getGroupsByUserId(userId);
      const decodedGroups = fetchedGroups.map(group => ({
        ...group,
        photo: `data:image/jpeg;base64,${decodeBase64Image(group.photo)}`,
      }));
      await fetchParticipantCounts(decodedGroups);
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
      setError('Erro ao buscar grupos. Tente novamente mais tarde.');
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
        await fetchGroups(userId);
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
      headerTitle: () => <Text>Bem vindo {user?.username ?? '-'}</Text>,
      headerRight: () => <Image source={{ uri: userImage }} style={styles.handlephoto} />,
    });
  }, [navigation, user, userImage]);

  const handleInvite = () => {
    navigation.navigate('Invite');
  };

  const handleListGroup = () => {
    navigation.navigate('ListGroup');
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const renderItem = ({ item }: { item: Group }) => (
    <View style={styles.item}>
      <View style={styles.userInfo}>
        <Image source={{ uri: item.photo }} style={styles.photo} resizeMode="contain" />
        <Text style={styles.userInfoText}>{item.groupName}</Text>
        <Text style={styles.userInfoText}> ({item.participantCount})</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {loading ? (
          <Text style={styles.buttonText}>Carregando...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : (
          <View>
            {groups && groups.length > 0 ? (
              <>
                <View style={styles.structure}>
                  <View style={styles.userInfo}>
                    <Text style={styles.textGroup}>Grupos</Text>
                    <TouchableOpacity onPress={handleCreateGroup} style={styles.buttonAdd} activeOpacity={0.1}>
                      <Text style={styles.groupAdd}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <FlatList data={groups} renderItem={renderItem} keyExtractor={(item) => (item.groupID ? item.groupID.toString() : Math.random().toString())} />
                <View style={styles.info}>
                  <TouchableOpacity onPress={handleListGroup} style={[styles.button, { marginRight: 5 }]} activeOpacity={0.1}>
                    <Text style={styles.buttonText}>Listar grupos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleInvite} style={[styles.button, { marginLeft: 5 }]} activeOpacity={0.1}>
                    <Text style={styles.buttonText}>Convites</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.structure}>
              <View style={styles.userInfo}>
                <Text style={styles.textGroup}>Grupos</Text>
                <TouchableOpacity onPress={handleCreateGroup} style={styles.buttonAdd} activeOpacity={0.1}>
                  <Text style={styles.groupAdd}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.buttonText}>Você não está em nenhum grupo!</Text>
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
