import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import UserMapScreen from './screens/UserMapScreen';
import OperatorMapScreen from './screens/OperatorMapScreen';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="UserMap" component={UserMapScreen} />
                <Stack.Screen name="OperatorMap" component={OperatorMapScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
