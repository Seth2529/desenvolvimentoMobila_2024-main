import * as React from 'react';
import { NavigationContainer, RouteProp} from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import ForgotPassword from '../screens/ForgotPassword';
import Register from '../screens/Register';
import CreateGroup from '../screens/CreateGroup';
import ListGroup from '../screens/ListGroup';
import Invite from '../screens/Invite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export type StackNavigation = {
    Splash: undefined;
    Home :  { userId: number} | undefined;
    Login : undefined;
    Register : undefined;
    ForgotPassword: undefined;
    CreateGroup: undefined;
    ListGroup: undefined;
    Invite: undefined;
}


export type StackTypes = NativeStackNavigationProp<StackNavigation>

export type StackNavigationProp<ScreenName extends keyof StackNavigation> = NativeStackNavigationProp<StackNavigation, ScreenName>;
export type StackRouteProp<ScreenName extends keyof StackNavigation> = RouteProp<StackNavigation, ScreenName>;



export default function StackComponent(){
    return (
        <GestureHandlerRootView>
        <NavigationContainer>
            <Stack.Navigator>
                {/* <Stack.Screen  name="Splash" component={Splash} options={{gestureEnabled:false ,headerShown: false }}  /> */}
                <Stack.Screen  name="Login" component={Login} options={{headerShown: false }}  />
                <Stack.Screen  name="Register" component={Register}   options={{headerShown: false }}   />
                <Stack.Screen  name="ForgotPassword" component={ForgotPassword} options={{headerShown: false }} />
                <Stack.Screen  name="Home" component={Home} options={{headerShown: true }}/>
                <Stack.Screen  name="CreateGroup" component={CreateGroup} options={{headerShown: true }} />
                <Stack.Screen  name="ListGroup" component={ListGroup} options={{headerShown: true }} />
                <Stack.Screen  name="Invite" component={Invite} options={{headerShown: true }} />
            </Stack.Navigator>
        </NavigationContainer>
        </GestureHandlerRootView>
    );
}
