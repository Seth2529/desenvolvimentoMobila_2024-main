import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import UserService   from '../../services/userServices';
import PassWordInput from '../../components/Password';
import CustomButton from '../../components/CustomButton';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { StackTypes } from '../../routes/stack';

const Login = () => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [usernameError, setUsernameError] = useState(false);
    const [PasswordError, setPasswordError] = useState(false);
    const userService = new UserService();
    const navigation = useNavigation<StackTypes>();
    
    useEffect(()=>{
      BackHandler.addEventListener('hardwareBackPress',()=>
        {return true})
    })

    const handleLogin = async () => {
      if (!login) {
        setUsernameError(true);
        return;
      } else {
        setUsernameError(false);
      }
    
      if (!password) {
        setPasswordError(true);
        return;
      } else {
        setPasswordError(false);
      }
    
      if (login && password) {
        const userId = await userService.validateUser(login, password);
        if (userId !== -1) {
          alert('Usuário autenticado com sucesso');
          setLogin('');
          setPassword('');
          navigation.navigate('Home', { userId: userId });
        } else {
          alert('Usuário e/ou senha inválidos');
        }
      }
    }
    const handleForgotPassword = () => {
      navigation.navigate('ForgotPassword');

    };
    const handleRegister = () => {
      navigation.navigate('Register');

    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bem vindo</Text>
        <Text style={styles.title}>Faça seu Login!</Text>
        <TextInput
          style={styles.input}
          placeholder="Login"
          onChangeText={setLogin}
          value={login}
        />
        <PassWordInput
          placeholder="Digite sua senha"
          onChangeText={setPassword}
          value={password}
        />
      <CustomButton title='Entrar' onPress={handleLogin}></CustomButton>
      <TouchableOpacity onPress={handleRegister} style={styles.button} activeOpacity={0.1}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
         <TouchableOpacity onPress={handleForgotPassword} style={styles.buttonLink} activeOpacity={0.1}>
        <Text style={styles.buttonTextLink}>Esqueci a senha</Text>
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
        margin:5,
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
    buttonLink: {
        width: '50%',
        height: 40,
        margin:5,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonTextLink: {
        color: '#816c04',
        fontSize: 16,
        textDecorationLine : 'underline'
      }
  });
  

export default Login;