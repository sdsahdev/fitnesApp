import React from 'react';
import {View, Text, StyleSheet, StatusBar, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import Button from '../../components/Button';
import {useTheme} from '../../theme/ThemeProvider';

const {width, height} = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <LinearGradient
        colors={[theme.colors.primary, '#1a2a6c']}
        style={styles.backgroundGradient}>
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}>
          <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>FitNow</Text>
              <Text style={styles.logoSubtext}>FITNESS APP</Text>
            </View>

            <View style={styles.contentContainer}>
              <Text style={[styles.title, {color: theme.colors.text.inverse}]}>
                Transform Your Body
              </Text>
              <Text
                style={[styles.subtitle, {color: theme.colors.text.inverse}]}>
                Your complete fitness solution with personalized workouts, meal
                plans, and progress tracking
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              {/* <Button
                title="Get Started"
                variant="primary"

                fullWidth
                onPress={() => navigation.navigate('Register' as never)}
                style={styles.button}
              /> */}
              {/* <Button
                title="Login"
                variant="outline"
                size="large"
                fullWidth
                onPress={() => navigation.navigate('Login' as never)}
                style={[styles.button, {borderColor: 'white'}]}
                textStyle={{color: 'white'}}
              /> */}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundGradient: {
    width,
    height,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
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
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 26,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  button: {
    marginBottom: 16,
  },
});

export default WelcomeScreen;
