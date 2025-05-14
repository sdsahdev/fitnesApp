import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import {RootState} from '../../store';
import Card from '../../components/Card';
import {useTheme} from '../../theme/ThemeProvider';

// Menu item type
type MenuItem = {
  title: string;
  icon: string;
  screen: string;
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const {user} = useSelector((state: any) => state.auth);

  const menuItems: MenuItem[] = [
    {
      title: 'Edit Profile',
      icon: 'create-outline',
      screen: 'ProfileEdit',
    },
    {
      title: 'Settings',
      icon: 'settings-outline',
      screen: 'Settings',
    },
    {
      title: 'Achievements',
      icon: 'trophy-outline',
      screen: 'Achievements',
    },
    {
      title: 'Subscription',
      icon: 'card-outline',
      screen: 'Subscription',
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.profileImageContainer}>
              {user?.photoURL ? (
                <Image
                  source={{uri: user.photoURL}}
                  style={styles.profileImage}
                />
              ) : (
                <View
                  style={[
                    styles.profileInitials,
                    {backgroundColor: theme.colors.primary},
                  ]}>
                  <Text style={styles.initialsText}>
                    {user?.displayName
                      ? user.displayName.charAt(0).toUpperCase()
                      : 'U'}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text
                style={[styles.username, {color: theme.colors.text.primary}]}>
                {user?.displayName || 'User'}
              </Text>
              <Text
                style={[styles.email, {color: theme.colors.text.secondary}]}>
                {user?.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Card style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text
                style={[styles.statValue, {color: theme.colors.text.primary}]}>
                0
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Workouts
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text
                style={[styles.statValue, {color: theme.colors.text.primary}]}>
                0
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Streak
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text
                style={[styles.statValue, {color: theme.colors.text.primary}]}>
                0
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Achievements
              </Text>
            </View>
          </Card>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                {borderBottomColor: theme.colors.border.light},
              ]}
              onPress={() => navigation.navigate(item.screen as never)}>
              <View style={styles.menuItemContent}>
                <Icon
                  name={item.icon}
                  size={24}
                  color={theme.colors.text.primary}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    {color: theme.colors.text.primary},
                  ]}>
                  {item.title}
                </Text>
              </View>
              <Icon
                name="chevron-forward"
                size={20}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileInitials: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  menuSection: {
    paddingHorizontal: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
  },
});

export default ProfileScreen;
