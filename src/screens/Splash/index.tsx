import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackTypes } from '../../routes/stack';


const Splash = () => {
  const navigation = useNavigation<StackTypes>();
  
  const animation = require('../../../assets/splash.json');

  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        loop={false}
        speed={1.5}
        style={{
          width: 200,
          height: 200,
          backgroundColor: '#eee',
        }}
        source={animation}
        onAnimationFinish={() => navigation.navigate('Login')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Splash;
