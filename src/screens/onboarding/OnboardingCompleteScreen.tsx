import React from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeProvider';
import Button from '../../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {updateUserProfile} from '../../store/slices/userSlice';
import {RootState} from '../../store';

const OnboardingCompleteScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);

  const handleGetStarted = async () => {
    // Update user profile to mark onboarding as complete
    if (user && user.uid) {
      await dispatch(
        updateUserProfile({
          userId: user.uid,
          profileData: {
            hasCompletedOnboarding: true,
          },
        }) as any,
      );

      // Navigate to the main app
      navigation.reset({
        index: 0,
        routes: [{name: 'Main' as never}],
      });
    }
  };

  // Helper function to ensure we always get a string color value
  const getColorString = (color: any): string => {
    return typeof color === 'string' ? color : color?.light || '#FFFFFF';
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View
        style={[
          styles.backgroundOverlay,
          {backgroundColor: getColorString(theme.colors.primary)},
        ]}>
        <SafeAreaView style={styles.content}>
          <View style={styles.header}>
            <View style={styles.checkIconContainer}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
            <Text style={styles.title}>All Set!</Text>
            <Text style={styles.subtitle}>
              Your fitness journey is about to begin
            </Text>
          </View>

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>
              Here's what we've prepared for you:
            </Text>

            <View style={styles.summaryItems}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}>🎯</Text>
                <Text style={styles.summaryText}>
                  Personalized workout plans
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}>🥗</Text>
                <Text style={styles.summaryText}>
                  Customized meal recommendations
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}>📊</Text>
                <Text style={styles.summaryText}>
                  Progress tracking and insights
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}>🔔</Text>
                <Text style={styles.summaryText}>
                  Reminders and notifications
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              size="large"
              fullWidth
            />
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundOverlay: {
    flex: 1,
    backgroundColor: '#4A90E2',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  checkIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkIcon: {
    fontSize: 60,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#E0E0E0',
    marginBottom: 40,
  },
  summaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  summaryItems: {
    gap: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryEmoji: {
    fontSize: 28,
    marginRight: 16,
    width: 40,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginBottom: 20,
  },
});

export default OnboardingCompleteScreen;
