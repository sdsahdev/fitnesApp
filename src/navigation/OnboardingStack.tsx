import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import OnboardingWelcomeScreen from '../screens/onboarding/OnboardingWelcomeScreen';
import PersonalInfoScreen from '../screens/onboarding/PersonalInfoScreen';
import FitnessGoalsScreen from '../screens/onboarding/FitnessGoalsScreen';
import ActivityLevelScreen from '../screens/onboarding/ActivityLevelScreen';
import OnboardingCompleteScreen from '../screens/onboarding/OnboardingCompleteScreen';
import DietPreferenceScreen from '../screens/onboarding/DietPreferenceScreen';

const Stack = createStackNavigator();

const OnboardingStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="OnboardingWelcome"
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: 'white'},
      }}>
      <Stack.Screen
        name="OnboardingWelcome"
        component={OnboardingWelcomeScreen}
      />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="FitnessGoals" component={FitnessGoalsScreen} />
      <Stack.Screen name="ActivityLevel" component={ActivityLevelScreen} />
      <Stack.Screen name="DietPreference" component={DietPreferenceScreen} />
      <Stack.Screen
        name="OnboardingComplete"
        component={OnboardingCompleteScreen}
      />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
