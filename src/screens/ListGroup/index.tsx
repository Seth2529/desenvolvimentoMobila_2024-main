import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { StackRouteProp, StackTypes } from '../../routes/stack';
import { FlatList as GestureHandlerFlatList } from 'react-native-gesture-handler';
import UserService from '../../services/userServices';
import { User, Group } from '../../types/types';
import { useAuth } from '../../provider/AuthProvider';
import GroupService from '../../services/groupServices';
import { format, parseISO } from 'date-fns';

type DetailsScreenProps = {
  route: StackRouteProp<'Home'>;
};


const ListGroup = ({ route }: DetailsScreenProps) => {
  const navigation = useNavigation<StackTypes>();
  const [groups, setGroups] = useState<Group[] | null>([]);
  const groupService = new GroupService();
  const userService = new UserService();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | undefined>();
  const { user: authUser } = useAuth();

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
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text>Lista de grupos</Text>,
      headerRight: () => <Image source={{ uri: userImage }} style={styles.handlephoto} />, 
    });
  }, [navigation, userImage]);

  const handleDelete = (groupId: number) => {
    navigation.navigate('DeleteGroup', { groupId });
  };

  const handleEdit = (groupId: number) => {
    // navigation.navigate('EditGroup');
  };
  
  const handleInvite = (groupId: number) => {
    navigation.navigate('InviteGroup', { groupId });

  };
  const handleHome = () => {
    navigation.goBack();
  };

  const renderItem = ({ item, index }: { item: Group; index: number }) => (
    <View style={styles.item}>
      <View style={styles.info}>
        <Image source={{ uri: item.photo }} style={styles.photo} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.InfoText}>Nome do grupo: {item.groupName}</Text>
          <Text style={styles.InfoText}>Participantes: ({item.participantCount})</Text>
          <Text style={styles.InfoText}>Data: {item.dateDiscover ? format(parseISO(item.dateDiscover), 'dd/MM/yyyy') : 'Indisponível'}</Text>
          <Text style={styles.InfoText}>Valor: {item.value}</Text>
          <Text style={styles.InfoText}>Descrição: {item.description}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleDelete(item.groupID)} style={styles.buttoncrud} activeOpacity={0.1}>
          <Text style={styles.buttonText}>❌</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEdit(item.groupID)} style={styles.buttoncrud} activeOpacity={0.1}>
          <Text style={styles.buttonText}>🖊️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInvite(item.groupID)} style={styles.buttoncrud} activeOpacity={0.1}>
          <Text style={styles.buttonText}>✉️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {loading ? (
          <Text>Carregando...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : (
          <View>
            <FlatList
              data={groups}
              renderItem={renderItem}
              keyExtractor={(item) => (item.groupID ? item.groupID.toString() : Math.random().toString())}
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
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#242525',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
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
    marginRight: 10,
  },
  photo: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginRight: 10,
  },
  InfoText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
  buttoncrud: {
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ListGroup;
