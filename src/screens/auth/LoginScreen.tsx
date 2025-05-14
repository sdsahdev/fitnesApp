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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import {loginUser, clearErrors} from '../../store/slices/authSlice';
import {RootState} from '../../store';
import Button from '../../components/Button';
import {useTheme} from '../../theme/ThemeProvider';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {isLoading, error} = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  // Clear any previous auth errors when component mounts
  React.useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Show error message if login fails
  React.useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error);
    }
  }, [error]);

  const validateForm = () => {
    let isValid = true;
    const errors = {
      email: '',
      password: '',
    };

    // Validate email
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    // Validate password
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      dispatch(loginUser({email, password}) as any);
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
              Welcome Back
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSize.md,
                },
              ]}>
              Sign in to continue your fitness journey
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text
                style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.input.background,
                    borderColor: formErrors.email
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
                onChangeText={setEmail}
              />
              {formErrors.email ? (
                <Text style={[styles.errorText, {color: theme.colors.error}]}>
                  {formErrors.email}
                </Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text
                style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
                Password
              </Text>
              <View
                style={[
                  styles.passwordInputContainer,
                  {
                    backgroundColor: theme.colors.input.background,
                    borderColor: formErrors.password
                      ? theme.colors.error
                      : theme.colors.input.border,
                  },
                ]}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    {color: theme.colors.text.primary},
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.input.placeholderText}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}>
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={theme.colors.text.tertiary}
                  />
                </TouchableOpacity>
              </View>
              {formErrors.password ? (
                <Text style={[styles.errorText, {color: theme.colors.error}]}>
                  {formErrors.password}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword' as never)}
              style={styles.forgotPasswordContainer}>
              <Text
                style={[
                  styles.forgotPasswordText,
                  {color: theme.colors.primary},
                ]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              title="Login"
              onPress={handleLogin}
              isLoading={isLoading}
              fullWidth
              size="large"
              style={styles.loginButton}
            />

            <View style={styles.dividerContainer}>
              <View
                style={[
                  styles.divider,
                  {backgroundColor: theme.colors.border.light},
                ]}
              />
              <Text
                style={[
                  styles.dividerText,
                  {color: theme.colors.text.tertiary},
                ]}>
                Don't have an account?
              </Text>
              <View
                style={[
                  styles.divider,
                  {backgroundColor: theme.colors.border.light},
                ]}
              />
            </View>

            <Button
              title="Create Account"
              variant="outline"
              onPress={() => navigation.navigate('Register' as never)}
              fullWidth
            />
          </View>
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
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
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
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
});

export default LoginScreen;
