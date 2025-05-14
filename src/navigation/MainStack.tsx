import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/main/HomeScreen';
// import WorkoutsScreen from '../screens/main/WorkoutsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import NutritionScreen from '../screens/main/NutritionScreen';
import ProgressScreen from '../screens/main/ProgressScreen';

import WorkoutDetailScreen from '../screens/workouts/WorkoutDetailScreen';
import ExerciseDetailScreen from '../screens/workouts/ExerciseDetailScreen';
import CreateWorkoutScreen from '../screens/workouts/CreateWorkoutScreen';
import WorkoutPlayerScreen from '../screens/workouts/WorkoutPlayerScreen';

import MealPlanScreen from '../screens/nutrition/MealPlanScreen';
import FoodDetailScreen from '../screens/nutrition/FoodDetailScreen';
import AddMealScreen from '../screens/nutrition/AddMealScreen';
import WaterTrackerScreen from '../screens/nutrition/WaterTrackerScreen';

import SettingsScreen from '../screens/profile/SettingsScreen';

import AchievementsScreen from '../screens/profile/AchievementsScreen';
import SubscriptionScreen from '../screens/profile/SubscriptionScreen';
import ProfileEditScreen from '../screens/profile/ProfileEditScreen';

import {useTheme} from '../theme/ThemeProvider';
import WorkoutsScreen from '../screens/main/WorkoutsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
      <Stack.Screen name="WorkoutPlayer" component={WorkoutPlayerScreen} />
    </Stack.Navigator>
  );
};

// Workouts Stack
const WorkoutsStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="WorkoutsMain" component={WorkoutsScreen} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} />
      <Stack.Screen name="WorkoutPlayer" component={WorkoutPlayerScreen} />
    </Stack.Navigator>
  );
};

// Nutrition Stack
const NutritionStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="NutritionMain" component={NutritionScreen} />
      <Stack.Screen name="MealPlan" component={MealPlanScreen} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
      <Stack.Screen name="AddMeal" component={AddMealScreen} />
      <Stack.Screen name="WaterTracker" component={WaterTrackerScreen} />
    </Stack.Navigator>
  );
};

// Progress Stack
const ProgressStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProgressMain" component={ProgressScreen} />
    </Stack.Navigator>
  );
};

// Profile Stack
const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  const {theme} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Workouts') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Nutrition') {
            iconName = focused ? 'nutrition' : 'nutrition-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.tab.inactive,
        tabBarStyle: {
          backgroundColor: theme.colors.tab.background,
          borderTopColor: theme.colors.tab.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Workouts" component={WorkoutsStack} />
      <Tab.Screen name="Nutrition" component={NutritionStack} />
      <Tab.Screen name="Progress" component={ProgressStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainStack;
