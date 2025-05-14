import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeProvider';
import Button from '../../components/Button';
import LinearGradient from 'react-native-linear-gradient';

const OnboardingWelcomeScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();

  const handleGetStarted = () => {
    navigation.navigate('PersonalInfo' as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primary + '80']}
        style={styles.backgroundGradient}>
        <SafeAreaView style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>FitNow</Text>
            <Text style={styles.logoSubtext}>YOUR FITNESS JOURNEY</Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.title, {color: theme.colors.text.inverse}]}>
              Welcome to FitnessApp
            </Text>
            <Text style={[styles.subtitle, {color: theme.colors.text.inverse}]}>
              Your personal fitness companion for tracking workouts, nutrition,
              and progress
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  {backgroundColor: `${theme.colors.primary}30`},
                ]}>
                <Text style={styles.featureEmoji}>💪</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text
                  style={[
                    styles.featureTitle,
                    {color: theme.colors.text.inverse},
                  ]}>
                  Personalized Workouts
                </Text>
                <Text
                  style={[
                    styles.featureDescription,
                    {color: theme.colors.text.inverse},
                  ]}>
                  Customized to your goals and fitness level
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  {backgroundColor: `${theme.colors.success}30`},
                ]}>
                <Text style={styles.featureEmoji}>🥗</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text
                  style={[
                    styles.featureTitle,
                    {color: theme.colors.text.inverse},
                  ]}>
                  Nutrition Tracking
                </Text>
                <Text
                  style={[
                    styles.featureDescription,
                    {color: theme.colors.text.inverse},
                  ]}>
                  Monitor your meals and nutritional intake
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  {backgroundColor: `${theme.colors.info}30`},
                ]}>
                <Text style={styles.featureEmoji}>📈</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text
                  style={[
                    styles.featureTitle,
                    {color: theme.colors.text.inverse},
                  ]}>
                  Progress Tracking
                </Text>
                <Text
                  style={[
                    styles.featureDescription,
                    {color: theme.colors.text.inverse},
                  ]}>
                  Visualize your fitness journey over time
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
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login' as never)}>
              <Text
                style={[styles.loginText, {color: theme.colors.text.inverse}]}>
                Already have an account?{' '}
                <Text style={{color: 'white', fontWeight: 'bold'}}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  logoSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 4,
    marginTop: 4,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
    color: 'white',
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureEmoji: {
    fontSize: 22,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'white',
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: 'white',
  },
});

export default OnboardingWelcomeScreen;
