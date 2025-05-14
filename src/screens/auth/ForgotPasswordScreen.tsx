import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

import Button from '../../components/Button';
import {useTheme} from '../../theme/ThemeProvider';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      await auth().sendPasswordResetEmail(email);
      setEmailSent(true);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);

      let errorMessage = 'An error occurred. Please try again.';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      }

      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.backButton,
                {backgroundColor: theme.colors.background.secondary},
              ]}>
              <Icon
                name="arrow-back"
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSize.xxl,
                  fontWeight: theme.fontWeight.bold,
                },
              ]}>
              Reset Password
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSize.md,
                },
              ]}>
              {emailSent
                ? 'Check your email for a password reset link'
                : 'Enter your email to receive a password reset link'}
            </Text>
          </View>

          {emailSent ? (
            <View style={styles.successContainer}>
              <View
                style={[
                  styles.successIcon,
                  {backgroundColor: `${theme.colors.success}20`},
                ]}>
                <Icon
                  name="checkmark-circle"
                  size={48}
                  color={theme.colors.success}
                />
              </View>
              <Text
                style={[
                  styles.successText,
                  {color: theme.colors.text.primary, marginTop: 24},
                ]}>
                Reset email sent successfully!
              </Text>
              <Text
                style={[
                  styles.successSubText,
                  {
                    color: theme.colors.text.secondary,
                    marginTop: 8,
                    textAlign: 'center',
                  },
                ]}>
                We've sent a link to reset your password to {email}
              </Text>

              <Button
                title="Back to Login"
                onPress={() => navigation.navigate('Login' as never)}
                fullWidth
                style={{marginTop: 32}}
              />

              <TouchableOpacity
                style={styles.resendContainer}
                onPress={handleResetPassword}>
                <Text
                  style={[
                    styles.resendText,
                    {color: theme.colors.text.tertiary},
                  ]}>
                  Didn't receive the email?
                </Text>
                <Text
                  style={[
                    styles.resendLink,
                    {color: theme.colors.primary, fontWeight: '600'},
                  ]}>
                  Resend
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.inputLabel,
                    {color: theme.colors.text.primary},
                  ]}>
                  Email Address
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.input.background,
                      borderColor: emailError
                        ? theme.colors.error
                        : theme.colors.input.border,
                      color: theme.colors.text.primary,
                    },
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.input.placeholderText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    if (emailError) validateEmail();
                  }}
                />
                {emailError ? (
                  <Text style={[styles.errorText, {color: theme.colors.error}]}>
                    {emailError}
                  </Text>
                ) : null}
              </View>

              <Button
                title="Reset Password"
                onPress={handleResetPassword}
                isLoading={isLoading}
                fullWidth
                size="large"
                style={styles.resetButton}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('Login' as never)}
                style={styles.loginLinkContainer}>
                <Text
                  style={[
                    styles.loginText,
                    {color: theme.colors.text.secondary},
                  ]}>
                  Remember your password?
                </Text>
                <Text
                  style={[
                    styles.loginLink,
                    {
                      color: theme.colors.primary,
                      fontWeight: '600',
                      marginLeft: 4,
                    },
                  ]}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
  },
  resetButton: {
    marginBottom: 24,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  successSubText: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    marginRight: 8,
  },
  resendLink: {
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;
