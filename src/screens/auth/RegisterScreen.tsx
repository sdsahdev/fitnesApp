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

import {registerUser, clearErrors} from '../../store/slices/authSlice';
import {RootState} from '../../store';
import Button from '../../components/Button';
import {useTheme} from '../../theme/ThemeProvider';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {isLoading, error} = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Clear any previous auth errors when component mounts
  React.useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Show error message if registration fails
  React.useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
    }
  }, [error]);

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    // Validate name
    if (!name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

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

    // Validate confirm password
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleRegister = () => {
    if (validateForm()) {
      dispatch(registerUser({email, password, displayName: name}) as any);
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
              Create Account
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSize.md,
                },
              ]}>
              Sign up to start your fitness journey
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text
                style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
                Full Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.input.background,
                    borderColor: formErrors.name
                      ? theme.colors.error
                      : theme.colors.input.border,
                    color: theme.colors.text.primary,
                  },
                ]}
                placeholder="Enter your full name"
                placeholderTextColor={theme.colors.input.placeholderText}
                value={name}
                onChangeText={setName}
              />
              {formErrors.name ? (
                <Text style={[styles.errorText, {color: theme.colors.error}]}>
                  {formErrors.name}
                </Text>
              ) : null}
            </View>

            {/* Email Input */}
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

            {/* Password Input */}
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
                  placeholder="Create a password"
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

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text
                style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
                Confirm Password
              </Text>
              <View
                style={[
                  styles.passwordInputContainer,
                  {
                    backgroundColor: theme.colors.input.background,
                    borderColor: formErrors.confirmPassword
                      ? theme.colors.error
                      : theme.colors.input.border,
                  },
                ]}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    {color: theme.colors.text.primary},
                  ]}
                  placeholder="Confirm your password"
                  placeholderTextColor={theme.colors.input.placeholderText}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
              {formErrors.confirmPassword ? (
                <Text style={[styles.errorText, {color: theme.colors.error}]}>
                  {formErrors.confirmPassword}
                </Text>
              ) : null}
            </View>

            <Button
              title="Create Account"
              onPress={handleRegister}
              isLoading={isLoading}
              fullWidth
              size="large"
              style={styles.registerButton}
            />

            <View style={styles.loginContainer}>
              <Text
                style={[
                  styles.loginText,
                  {color: theme.colors.text.secondary},
                ]}>
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login' as never)}>
                <Text
                  style={[
                    styles.loginLink,
                    {color: theme.colors.primary, fontWeight: '600'},
                  ]}>
                  Log In
                </Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 32,
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
  registerButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    marginRight: 8,
  },
  loginLink: {
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
