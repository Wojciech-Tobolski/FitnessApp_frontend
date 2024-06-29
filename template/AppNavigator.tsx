import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@/app/personalworkout/[id]';
import ExerciseScreen from '@/app/listing/[id]';
import { ExerciseType } from '@/types/listingType';

export type RootStackParamList = {
  Home: undefined;
  Exercise: {
    workoutId: number;
    exercises: ExerciseType[];
    initialIndex: number;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
