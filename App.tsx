import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider, useSelector, useDispatch} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';

import {store, persistor, RootState} from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import {ThemeProvider} from './src/theme/ThemeProvider';
import {
  fetchWorkouts,
  fetchUserWorkouts,
  fetchExercises,
} from './src/store/slices/workoutSlice';
import {fetchWaterEntriesByDate} from './src/store/slices/nutritionSlice';

// Data loader component to fetch data when app starts
const DataLoader = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.uid) {
      // Fetch workout data
      dispatch(fetchWorkouts() as any);
      dispatch(fetchUserWorkouts(user.uid) as any);
      dispatch(fetchExercises() as any);

      // Fetch today's water entries
      const today = new Date().toISOString().split('T')[0];
      dispatch(fetchWaterEntriesByDate({userId: user.uid, date: today}) as any);
    }
  }, [user, dispatch]);

  return null;
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
              <RootNavigator />
              <DataLoader />
              <FlashMessage position="top" />
            </NavigationContainer>
          </SafeAreaProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
