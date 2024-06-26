import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { StackRouteProp, StackTypes } from '../../routes/stack';
import UserService from '../../services/userServices';
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
  const { user: authUser, logout } = useAuth();

  const renderItem = ({ item }: { item: Group }) => (
    <View style={styles.item}>
      <View style={styles.userInfo}>
        {/* Usando userImage para a imagem do usuário */}
        <Image source={{ uri: userImage }} style={styles.photo} resizeMode="contain" />
        <Text style={styles.userInfoText}>{item.groupName}</Text>
        <Text style={styles.userInfoText}> ({item.participantsNumber}/20)</Text>
      </View>
    </View>
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = route.params?.userId;
        if (userId !== undefined) {
          const fetchedUser = await userService.getUserById(userId);
          setUser(fetchedUser);
          // Decodificando a imagem em base64 para bytes
          const decodedImage = decodeBase64Image(fetchedUser.photo);
          // Atualizando o estado com o URL da imagem decodificada
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

    fetchUser();
  }, [route.params?.userId]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text>Bem vindo {user?.username ?? '-'}</Text>,
      headerRight: () => <Image source={{ uri: userImage }} style={styles.handlephoto} />, 
      headerLeft: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.1}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, user, userImage]);

  const decodeBase64Image = (base64String: string): string => {
    const base64Data = base64String.replace(/^data:image\/jpeg;base64,/, '');
    return base64Data;
  };

  const handleLogout = () => {
    logout(); 
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

  function handleInvite() {
    navigation.navigate('Invite');
  }

  function handleListGroup() {
    navigation.navigate('ListGroup');
  }

  function handleCreateGroup() {
    navigation.navigate('CreateGroup');
  }
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#242525',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handlephoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textGroup: {
    color: '#ffd700',
    fontSize: 20,
  },
  buttonAdd: {
    margin: 5,
  },
  groupAdd: {
    color: '#ffd700',
    fontSize: 30,
  },
  structure: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#373737',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoText: {
    fontSize: 18,
    color: '#ffd700',
    fontWeight: 'bold',
  },
  photo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  item: {
    backgroundColor: '#373737',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  info: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    height: 40,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#816c04',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    marginLeft: 10,
    paddingVertical: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Home;
