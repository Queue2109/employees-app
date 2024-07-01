import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import EditCreate from './screens/EditCreate';
import { RootStackParamList } from './types';
import Statistics from './screens/Statistics';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="EditCreate" component={EditCreate} options={{ headerShown: false }} />
        <Stack.Screen name="Statistics" component={Statistics} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
