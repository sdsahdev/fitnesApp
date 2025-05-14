import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';

import {RootState} from '../store';
import {setUser} from '../store/slices/authSlice';
import {fetchUserProfile} from '../store/slices/userSlice';

import AuthStack from './AuthStack';
import MainStack from './MainStack';
import OnboardingStack from './OnboardingStack';
import {useTheme} from '../theme/ThemeProvider';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const {isAuthenticated, user} = useSelector((state: RootState) => state.auth);
  const {profile} = useSelector((state: RootState) => state.user);
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          }),
        );

        // Fetch user profile data
        dispatch(fetchUserProfile(firebaseUser.uid) as any);
      } else {
        dispatch(setUser(null));
      }

      if (initializing) {
        setInitializing(false);
      }
    });

    // Unsubscribe on unmount
    return subscriber;
  }, [dispatch, initializing]);

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background.primary,
        }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Determine which stack to show
  const showOnboarding =
    isAuthenticated && profile && !profile.hasCompletedOnboarding;
  const showMainApp =
    isAuthenticated && (!profile || profile.hasCompletedOnboarding);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : showOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingStack} />
      ) : (
        <Stack.Screen name="Main" component={MainStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
