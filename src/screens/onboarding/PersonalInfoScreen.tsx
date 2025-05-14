import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeProvider';
import Button from '../../components/Button';

const PersonalInfoScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(
    null,
  );
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleContinue = () => {
    // In a real app, you would validate the inputs and save the data
    if (!name || !age || !gender || !height || !weight) {
      // Show error message (in a real app)
      return;
    }

    // Navigate to the next screen
    navigation.navigate('FitnessGoals' as never);
  };

  const isValidated = name && age && gender && height && weight;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text
              style={[styles.stepText, {color: theme.colors.text.secondary}]}>
              Step 1 of 4
            </Text>
            <Text style={[styles.title, {color: theme.colors.text.primary}]}>
              Tell us about yourself
            </Text>
            <Text
              style={[styles.subtitle, {color: theme.colors.text.secondary}]}>
              We'll use this information to personalize your experience
            </Text>
          </View>

          <View style={styles.form}>
            {/* Name input */}
            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.inputLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Your Name
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.colors.background.secondary,
                    color: theme.colors.text.primary,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="Enter your name"
                placeholderTextColor={theme.colors.text.tertiary}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Age input */}
            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.inputLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Age
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.colors.background.secondary,
                    color: theme.colors.text.primary,
                    borderColor: theme.colors.border,
                  },
                ]}
                placeholder="Your age"
                placeholderTextColor={theme.colors.text.tertiary}
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            {/* Gender selection */}
            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.inputLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Gender
              </Text>
              <View style={styles.genderOptions}>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    gender === 'male' && {
                      backgroundColor: theme.colors.primary,
                    },
                    {
                      backgroundColor:
                        gender === 'male'
                          ? theme.colors.primary
                          : theme.colors.background.secondary,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => setGender('male')}>
                  <Text
                    style={[
                      styles.genderText,
                      {
                        color:
                          gender === 'male'
                            ? '#FFFFFF'
                            : theme.colors.text.primary,
                      },
                    ]}>
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    gender === 'female' && {
                      backgroundColor: theme.colors.primary,
                    },
                    {
                      backgroundColor:
                        gender === 'female'
                          ? theme.colors.primary
                          : theme.colors.background.secondary,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => setGender('female')}>
                  <Text
                    style={[
                      styles.genderText,
                      {
                        color:
                          gender === 'female'
                            ? '#FFFFFF'
                            : theme.colors.text.primary,
                      },
                    ]}>
                    Female
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    gender === 'other' && {
                      backgroundColor: theme.colors.primary,
                    },
                    {
                      backgroundColor:
                        gender === 'other'
                          ? theme.colors.primary
                          : theme.colors.background.secondary,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => setGender('other')}>
                  <Text
                    style={[
                      styles.genderText,
                      {
                        color:
                          gender === 'other'
                            ? '#FFFFFF'
                            : theme.colors.text.primary,
                      },
                    ]}>
                    Other
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.measurementsContainer}>
              {/* Height input */}
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Text
                  style={[
                    styles.inputLabel,
                    {color: theme.colors.text.secondary},
                  ]}>
                  Height (cm)
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  placeholder="Height"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>

              {/* Weight input */}
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Text
                  style={[
                    styles.inputLabel,
                    {color: theme.colors.text.secondary},
                  ]}>
                  Weight (kg)
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  placeholder="Weight"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Navigation buttons */}
        <View style={styles.buttonsContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            size="large"
            fullWidth
            disabled={!isValidated}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  stepText: {
    fontSize: 14,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  genderOptions: {
    flexDirection: 'row',
  },
  genderOption: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 8,
    borderRadius: 8,
  },
  genderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  measurementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  buttonsContainer: {
    padding: 24,
    paddingTop: 0,
  },
});

export default PersonalInfoScreen;
