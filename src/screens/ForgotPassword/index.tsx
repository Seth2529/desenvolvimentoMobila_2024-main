import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { StackTypes } from '../../routes/stack';

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>('');
  
    const navigation = useNavigation<StackTypes>();

    const handleLogin = () => {
      navigation.navigate('Login');

    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Esqueci a senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          onChangeText={setEmail}
          value={email}
        />
         <TouchableOpacity onPress={handleLogin} style={styles.button} activeOpacity={0.1}>
        <Text style={styles.buttonText}>Enviar e-mail</Text>
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
  });
  

export default ForgotPassword;