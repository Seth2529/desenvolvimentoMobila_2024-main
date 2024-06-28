import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { StackRouteProp, StackTypes } from '../../routes/stack';
import { Group, Invite as InviteType } from '../../types/types';
import InviteService from '../../services/inviteServices';
import GroupService from '../../services/groupServices';
import { useAuth } from '../../provider/AuthProvider';

type DetailsScreenProps = {
  route: StackRouteProp<'Home'>;
};

const InviteScreen = ({ route }: DetailsScreenProps) => {
  const [invites, setInvites] = useState<InviteType[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<StackTypes>();
  const inviteService = new InviteService();
  const groupService = new GroupService();
  const { user: authUser } = useAuth();

  const fetchInvites = async (userId: number) => {
    try {
      const fetchedInvites = await inviteService.getInvitesByUserId(userId);
      const fetchedGroups = await groupService.getGroupsByUserId(userId);

      if (!Array.isArray(fetchedInvites)) {
        console.error('Tipo de fetchedInvites:', typeof fetchedInvites);
        console.error('Conteúdo de fetchedInvites:', fetchedInvites);
        throw new Error('fetchedInvites não é um array');
      }
      if (!Array.isArray(fetchedGroups)) {
        console.error('Tipo de fetchedGroups:', typeof fetchedGroups);
        console.error('Conteúdo de fetchedGroups:', fetchedGroups);
        throw new Error('fetchedGroups não é um array');
      }

      const groupsMap = new Map<number, Group>();
      fetchedGroups.forEach(group => {
        groupsMap.set(group.groupID, group);
      });

      const updatedInvites = fetchedInvites.map(invite => ({
        ...invite,
        group: groupsMap.get(invite.groupId) || null,
      }));


      setInvites(updatedInvites);
      setGroups(fetchedGroups);
    } catch (error) {
      console.error('Erro ao buscar convites ou grupos:', error);
      setError('Erro ao buscar convites ou grupos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = route.params?.userId || authUser?.userId;
    if (typeof userId === 'number') {
      fetchInvites(userId);
    } else {
      setError('Usuário não encontrado.');
      setLoading(false);
    }
  }, [route.params?.userId, authUser]);

  const handleHome = () => {
    navigation.goBack();
  };

  const handleAccept = async (inviteId: number) => {
    navigation.navigate('AcceptInvite', { inviteId });
  };

  const handleReject = async (inviteId: number) => {
    navigation.navigate('DeleteInvite', { inviteId });
  };

  const renderItem = ({ item }: { item: InviteType }) => {
    return (
      <View style={styles.item}>
        <View>
          <Text style={styles.itemText}>Nome do grupo: {item.group?.groupName || 'N/A'}</Text>
          <Text style={styles.itemText}>Status: {item.status}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => handleAccept(item.inviteId)} style={styles.buttoncrud} activeOpacity={0.1}>
            <Text style={styles.buttonText}>✔️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleReject(item.inviteId)} style={styles.buttoncrud} activeOpacity={0.1}>
            <Text style={styles.buttonText}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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
              data={invites}
              renderItem={renderItem}
              keyExtractor={(item) => (item.inviteId ? item.inviteId.toString() : Math.random().toString())}
              contentContainerStyle={styles.list}
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
  list: {
    width: '100%',
  },
  item: {
    padding: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#D8D8D8',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default InviteScreen;
