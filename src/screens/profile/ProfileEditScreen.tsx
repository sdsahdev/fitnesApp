import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Button from '../../components/Button';
import {useTheme} from '../../theme/ThemeProvider';
import {setUser} from '../../store/slices/authSlice';

const ProfileEditScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {user} = useSelector((state: any) => state.auth);
  const {profile} = useSelector((state: any) => state.user);

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || null);
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    displayName: '',
  });

  const handleGoBack = () => {
    navigation.goBack();
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      displayName: '',
    };

    if (!displayName.trim()) {
      errors.displayName = 'Name is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChoosePhoto = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Something went wrong');
        return;
      }

      if (response.assets && response.assets[0].uri) {
        uploadImage(response.assets[0].uri);
      }
    });
  };

  const uploadImage = async (uri: string) => {
    if (!user) return;

    try {
      setIsUploading(true);

      // Create reference to the file location in Firebase Storage
      const reference = storage().ref(`profileImages/${user.uid}`);

      // Upload file
      let task;
      if (Platform.OS === 'ios') {
        task = reference.putFile(uri);
      } else {
        // Android requires removing the file:// prefix
        const androidUri = uri.replace('file://', '');
        task = reference.putFile(androidUri);
      }

      // Wait for upload to complete
      await task;

      // Get download URL
      const url = await reference.getDownloadURL();

      // Update state
      setPhotoURL(url);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!validateForm() || !user) return;

    try {
      // Update Firebase Auth user profile
      await auth().currentUser?.updateProfile({
        displayName,
        photoURL,
      });

      // Update Firestore user document
      await firestore().collection('users').doc(user.uid).update({
        displayName,
        photoURL,
        bio,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      // Update Redux store
      dispatch(
        setUser({
          ...user,
          displayName,
          photoURL,
        }),
      );

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error(error);
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
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleGoBack}
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
            <Text style={[styles.title, {color: theme.colors.text.primary}]}>
              Edit Profile
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Profile Photo */}
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
              {isUploading ? (
                <View
                  style={[
                    styles.photoPlaceholder,
                    {backgroundColor: theme.colors.background.secondary},
                  ]}>
                  <ActivityIndicator
                    size="large"
                    color={theme.colors.primary}
                  />
                </View>
              ) : photoURL ? (
                <Image source={{uri: photoURL}} style={styles.photo} />
              ) : (
                <View
                  style={[
                    styles.photoPlaceholder,
                    {backgroundColor: theme.colors.background.secondary},
                  ]}>
                  <Text
                    style={[
                      styles.photoPlaceholderText,
                      {color: theme.colors.text.secondary},
                    ]}>
                    {displayName
                      ? displayName.charAt(0).toUpperCase()
                      : user?.email?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={handleChoosePhoto}
                style={[
                  styles.editPhotoButton,
                  {backgroundColor: theme.colors.primary},
                ]}>
                <Icon name="camera" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleChoosePhoto}>
              <Text
                style={[styles.changePhotoText, {color: theme.colors.primary}]}>
                Change Profile Photo
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.text.primary,
                    borderColor: formErrors.displayName
                      ? theme.colors.error
                      : theme.colors.border.light,
                    backgroundColor: theme.colors.background.secondary,
                  },
                ]}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Your name"
                placeholderTextColor={theme.colors.text.tertiary}
              />
              {formErrors.displayName ? (
                <Text style={[styles.errorText, {color: theme.colors.error}]}>
                  {formErrors.displayName}
                </Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.colors.text.tertiary,
                    borderColor: theme.colors.border.light,
                    backgroundColor: theme.colors.background.secondary,
                  },
                ]}
                value={user?.email || ''}
                editable={false}
                placeholder="Your email"
                placeholderTextColor={theme.colors.text.tertiary}
              />
              <Text
                style={[styles.inputNote, {color: theme.colors.text.tertiary}]}>
                Email cannot be changed
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Bio
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    color: theme.colors.text.primary,
                    borderColor: theme.colors.border.light,
                    backgroundColor: theme.colors.background.secondary,
                  },
                ]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                placeholderTextColor={theme.colors.text.tertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Save Changes"
              onPress={handleUpdateProfile}
              size="large"
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    fontSize: 16,
    fontWeight: '500',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    minHeight: 100,
  },
  inputNote: {
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingVertical: 16,
  },
});

export default ProfileEditScreen;
