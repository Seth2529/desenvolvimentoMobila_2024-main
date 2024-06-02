import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, Image } from 'react-native';
import { StackTypes } from '../../routes/stack';
import { User } from '../../types/types';

const Imageicon = require('../../assets/Mascoteh1.png');

const Invite = () => {
    const navigation = useNavigation<StackTypes>();
    const [user, setUser] = useState<User>();

    const handleHome = () => {
        navigation.goBack();
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text></Text>
            ),
            headerRight: () => (
                <Image source={Imageicon} style={styles.handlephoto} />
                )
        });
    }, [navigation, user]);
    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <Text style={styles.title}>Você foi convidado para o grupo SIF 5 2024</Text>
                <View style={styles.info}>
                    <TouchableHighlight
                        style={[styles.button, styles.acceptButton,{ marginRight: 5 }]}
                        underlayColor="darkgreen"
                        activeOpacity={0.6} 
                        onPress={handleHome}
                    >
                        <Text style={styles.buttonText}>Aceitar</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[styles.button, styles.declineButton,{ marginLeft: 5 }]}
                        underlayColor="darkred"
                        activeOpacity={0.6}
                        onPress={handleHome}
                    >
                        <Text style={styles.buttonText}>Recusar</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#242525',
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        color: '#816c04',
        marginBottom: 100,
    },
    item: {
        padding: 20,
        height: 250,
        marginBottom: 10,
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        flex: 1,
        height: 40,
        margin: 5,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    handlephoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        position: 'absolute',
        right: 1,
    },
    acceptButton: {
        backgroundColor: 'green',
    },
    declineButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Invite;
