import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import {useTheme} from '../../theme/ThemeProvider';

type StatCardProps = {
  icon: string;
  iconColor: string;
  title: string;
  value: string;
  onPress?: () => void;
};

type Achievement = {
  id: string;
  title: string;
  icon?: string;
};

// Create a proper navigation type
type ProfileScreenNavigationProp = {
  navigate: (screen: string, params?: any) => void;
};

const StatCard = ({icon, iconColor, title, value, onPress}: StatCardProps) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.statCard,
        {backgroundColor: theme.colors.background.secondary},
      ]}
      onPress={onPress}
      disabled={!onPress}>
      <View style={[styles.iconContainer, {backgroundColor: `${iconColor}20`}]}>
        <Icon name={icon} size={24} color={iconColor} />
      </View>
      <Text style={[styles.statValue, {color: theme.colors.text.primary}]}>
        {value}
      </Text>
      <Text style={[styles.statTitle, {color: theme.colors.text.secondary}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const {theme} = useTheme();
  const {user} = useSelector((state: any) => state.auth);
  // Use _ prefix to indicate intentionally unused variable
  const [_isLoading, _setIsLoading] = useState(false);

  const handleEditProfile = () => {
    navigation.navigate('ProfileEdit');
  };

  const handleGoToSettings = () => {
    navigation.navigate('Settings');
  };

  const handleGoToAchievements = () => {
    navigation.navigate('Achievements');
  };

  const handleGoToSubscription = () => {
    navigation.navigate('Subscription');
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.text.primary}]}>
          Profile
        </Text>
        <TouchableOpacity
          onPress={handleGoToSettings}
          style={[
            styles.iconButton,
            {backgroundColor: theme.colors.background.secondary},
          ]}>
          <Icon
            name="settings-outline"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {_isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <>
            <View style={styles.profileHeader}>
              <View
                style={[
                  styles.profileImageContainer,
                  {
                    borderColor: theme.colors.primary,
                    backgroundColor: `${theme.colors.primary}50`,
                  },
                ]}>
                {user?.profileImage ? (
                  <Image
                    source={{uri: user.profileImage}}
                    style={styles.profileImage}
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {getInitials(user?.name || 'User')}
                  </Text>
                )}
              </View>

              <Text
                style={[styles.userName, {color: theme.colors.text.primary}]}>
                {user?.name || 'Your Name'}
              </Text>

              <Text
                style={[styles.userBio, {color: theme.colors.text.secondary}]}>
                {user?.bio || 'Add a short bio about yourself'}
              </Text>

              <TouchableOpacity
                style={[
                  styles.editButton,
                  {backgroundColor: theme.colors.primary},
                ]}
                onPress={handleEditProfile}>
                <Text style={[styles.editButtonText, {color: '#FFFFFF'}]}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
              <StatCard
                icon="fitness"
                iconColor={theme.colors.primary}
                title="Workouts"
                value={user?.stats?.workouts || '0'}
                onPress={() => navigation.navigate('WorkoutHistory')}
              />
              <StatCard
                icon="flame"
                iconColor={theme.colors.warning}
                title="Calories"
                value={user?.stats?.calories || '0'}
              />
              <StatCard
                icon="time"
                iconColor={theme.colors.info}
                title="Minutes"
                value={user?.stats?.minutes || '0'}
              />
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {color: theme.colors.text.primary},
                  ]}>
                  Achievements
                </Text>
                <TouchableOpacity onPress={handleGoToAchievements}>
                  <Text
                    style={[styles.seeAllText, {color: theme.colors.primary}]}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.achievementsPreview,
                  {backgroundColor: theme.colors.background.secondary},
                ]}>
                {(user?.achievements?.slice(0, 3) || []).length > 0 ? (
                  user.achievements
                    .slice(0, 3)
                    .map((achievement: Achievement, index: number) => (
                      <View key={index} style={styles.achievementItem}>
                        <Icon
                          name={achievement.icon || 'trophy'}
                          size={24}
                          color={theme.colors.primary}
                        />
                        <Text
                          style={[
                            styles.achievementTitle,
                            {color: theme.colors.text.primary},
                          ]}>
                          {achievement.title}
                        </Text>
                      </View>
                    ))
                ) : (
                  <Text
                    style={[
                      styles.noDataText,
                      {color: theme.colors.text.secondary},
                    ]}>
                    Complete workouts to earn achievements
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    {color: theme.colors.text.primary},
                  ]}>
                  Subscription
                </Text>
                <TouchableOpacity onPress={handleGoToSubscription}>
                  <Text
                    style={[styles.seeAllText, {color: theme.colors.primary}]}>
                    Manage
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.subscriptionCard,
                  {backgroundColor: theme.colors.background.secondary},
                ]}>
                <Icon
                  name={user?.isPremium ? 'star' : 'star-outline'}
                  size={24}
                  color={
                    user?.isPremium
                      ? theme.colors.warning
                      : theme.colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.subscriptionText,
                    {color: theme.colors.text.primary},
                  ]}>
                  {user?.isPremium ? 'Premium Member' : 'Free Plan'}
                </Text>
                {!user?.isPremium && (
                  <TouchableOpacity
                    style={[
                      styles.upgradeButton,
                      {backgroundColor: theme.colors.primary},
                    ]}
                    onPress={handleGoToSubscription}>
                    <Text
                      style={[styles.upgradeButtonText, {color: '#FFFFFF'}]}>
                      Upgrade
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        )}
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
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userBio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 16,
  },
  achievementsPreview: {
    borderRadius: 15,
    padding: 15,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementTitle: {
    marginLeft: 10,
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    padding: 15,
    fontSize: 16,
  },
  subscriptionCard: {
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscriptionText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  upgradeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileScreen;
