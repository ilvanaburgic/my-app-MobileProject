import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SportInfoScreen from '../screens/SportInfoScreen';
import HistoryScreen from '../screens/HistoryScreen';
import PricingScreen from '../screens/PricingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminScreen from '../screens/AdminScreen';
import AddSportScreen from '../screens/AddSportScreen';

import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerTitle: 'SportIn',
        tabBarIcon: ({ focused, color, size }) => {
          let icon: any;
          if (route.name === 'Home') icon = focused ? 'home' : 'home-outline';
          else if (route.name === 'History') icon = focused ? 'time' : 'time-outline';
          else if (route.name === 'Pricing') icon = focused ? 'pricetag' : 'pricetag-outline';
          else if (route.name === 'Profile') icon = focused ? 'person' : 'person-outline';
          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6b5cc6',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarShowLabel: true,
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="History" component={HistoryScreen} />
      <Tabs.Screen name="Pricing" component={PricingScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="SportInfo" component={SportInfoScreen} options={{ headerTitle: 'SportIn' }} />
      <Stack.Screen name="Admin" component={AdminScreen} options={{ headerTitle: 'Admin' }} />
      <Stack.Screen name="AddSport" component={AddSportScreen} /> 
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerTitle: 'SportIn' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerTitle: 'SportIn' }} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitle: 'SportIn' }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="SportInfo" component={SportInfoScreen} />
            <Stack.Screen name="AddSport" component={AddSportScreen} options={{ title: 'Add sport' }} />
            <Stack.Screen name="Admin" component={AdminScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}