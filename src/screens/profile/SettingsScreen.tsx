import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import {logoutUser} from '../../store/slices/authSlice';
import {useTheme} from '../../theme/ThemeProvider';

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsSection = ({title, children}: SettingsSectionProps) => {
  const {theme} = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, {color: theme.colors.text.secondary}]}>
        {title}
      </Text>
      <View
        style={[
          styles.sectionContent,
          {backgroundColor: theme.colors.background.secondary},
        ]}>
        {children}
      </View>
    </View>
  );
};

type SettingsItemProps = {
  icon: string;
  iconColor?: string;
  title: string;
  showChevron?: boolean;
  onPress?: () => void;
  value?: React.ReactNode;
};

const SettingsItem = ({
  icon,
  iconColor,
  title,
  showChevron = false,
  onPress,
  value,
}: SettingsItemProps) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.settingsItem,
        {borderBottomColor: theme.colors.border.light},
      ]}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.settingsItemMain}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: `${iconColor || theme.colors.primary}20`},
          ]}>
          <Icon
            name={icon}
            size={20}
            color={iconColor || theme.colors.primary}
          />
        </View>
        <Text
          style={[
            styles.settingsItemTitle,
            {color: theme.colors.text.primary},
          ]}>
          {title}
        </Text>
      </View>
      <View style={styles.settingsItemRight}>
        {value}
        {showChevron && (
          <Icon
            name="chevron-forward"
            size={20}
            color={theme.colors.text.secondary}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {theme, toggleTheme} = useTheme();
  const {user} = useSelector((state: any) => state.auth);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(theme.mode === 'dark');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            dispatch(logoutUser() as any);
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toggleTheme();
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // Handle notifications permission logic here
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={[
            styles.backButton,
            {backgroundColor: theme.colors.background.secondary},
          ]}>
          <Icon name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, {color: theme.colors.text.primary}]}>
          Settings
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <SettingsSection title="Appearance">
          <SettingsItem
            icon="moon"
            iconColor={theme.colors.secondary}
            title="Dark Mode"
            value={
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{
                  false: theme.colors.border.light,
                  true: theme.colors.primary,
                }}
                thumbColor="white"
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Notifications">
          <SettingsItem
            icon="notifications"
            iconColor={theme.colors.info}
            title="Push Notifications"
            value={
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{
                  false: theme.colors.border.light,
                  true: theme.colors.primary,
                }}
                thumbColor="white"
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsItem
            icon="lock-closed"
            iconColor={theme.colors.secondary}
            title="Change Password"
            showChevron
            onPress={() => navigation.navigate('ChangePassword' as never)}
          />
          <SettingsItem
            icon="card"
            title="Subscription"
            showChevron
            onPress={() => navigation.navigate('Subscription' as never)}
          />
          <SettingsItem
            icon="trash"
            iconColor={theme.colors.error}
            title="Delete Account"
            showChevron
            onPress={() =>
              Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account? This action cannot be undone.',
              )
            }
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsItem
            icon="help-circle"
            iconColor={theme.colors.info}
            title="Help & Support"
            showChevron
            onPress={() => {}}
          />
          <SettingsItem
            icon="document-text"
            title="Privacy Policy"
            showChevron
            onPress={() => {}}
          />
          <SettingsItem
            icon="information-circle"
            title="Terms of Service"
            showChevron
            onPress={() => {}}
          />
          <SettingsItem
            icon="star"
            title="Rate the App"
            showChevron
            onPress={() => {}}
          />
          <SettingsItem
            icon="code"
            title="App Version"
            value={
              <Text style={{color: theme.colors.text.tertiary}}>1.0.0</Text>
            }
          />
        </SettingsSection>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            {backgroundColor: `${theme.colors.error}10`},
          ]}
          onPress={handleLogout}>
          <Icon name="log-out" size={20} color={theme.colors.error} />
          <Text style={[styles.logoutText, {color: theme.colors.error}]}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginHorizontal: 20,
    marginBottom: 8,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingsItemMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemTitle: {
    fontSize: 16,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SettingsScreen;
