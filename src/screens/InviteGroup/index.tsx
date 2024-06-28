import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { StackRouteProp, StackTypes } from '../../routes/stack';
import UserService from '../../services/userServices';
import { useNavigation } from '@react-navigation/native';
import InviteService from '../../services/inviteServices';
import { User } from '../../types/types';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../provider/AuthProvider';

type InviteGroupScreenProps = {
    route: StackRouteProp<'InviteGroup'>;
};

const InviteGroup = ({ route }: InviteGroupScreenProps) => {
    const [email, setEmail] = useState<string>('');
    const navigation = useNavigation<StackTypes>();
    const { groupId } = route.params ?? { groupId: undefined };
    const inviteService = new InviteService();
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userService = new UserService();
    const [userImage, setUserImage] = useState<string | undefined>();
    const { user: authUser } = useAuth();

    const decodeBase64Image = (base64String: string): string => {
        const base64Data = base64String.replace(/^data:image\/jpeg;base64,/, '');
        return base64Data;
      };
    
      const fetchUser = async () => {
        try {
          const userId = authUser?.userId;
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
      }, [authUser]);
    
      React.useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: () => <Text>Convide pessoas!</Text>,
          });
      }, [navigation]);

    const handleInviteUser = async () => {
        if (groupId === undefined) {
            console.error('Group ID is undefined');
            return;
        }

        const formData = new FormData();
        formData.append('GroupId', groupId.toString());
        formData.append('Email', email);

        try {
            const response = await inviteService.inviteUser(formData);
            if (response.status === 200) {
                // Handle successful invitation
                alert('Usuário convidado com sucesso');
                navigation.navigate('Home');
            } else {
                // Handle unsuccessful invitation
                alert('Falha ao convidar usuário');
            }
        } catch (error) {
            console.error('Error inviting user:', error);
            alert('Ocorreu um erro convidando o usuário');
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Insira o email!</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
            />
            <TouchableOpacity onPress={handleInviteUser} style={styles.button} activeOpacity={0.1}>
                <Text style={styles.buttonText}>Convidar</Text>
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
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    button: {
        width: '50%',
        height: 40,
        margin: 5,
        borderRadius: 8,
        backgroundColor: '#816c04',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default InviteGroup;
