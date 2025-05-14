import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import {useTheme} from '../../theme/ThemeProvider';

// Mock achievement data
const achievementData = [
  {
    id: '1',
    title: 'First Workout',
    description: 'Complete your first workout',
    icon: 'trophy',
    color: '#FFD700',
    isUnlocked: true,
    unlockedAt: '2023-06-15',
  },
  {
    id: '2',
    title: 'Workout Streak',
    description: 'Complete workouts 3 days in a row',
    icon: 'flame',
    color: '#FF4500',
    isUnlocked: true,
    unlockedAt: '2023-06-18',
  },
  {
    id: '3',
    title: 'Nutrition Master',
    description: 'Log your meals for 7 consecutive days',
    icon: 'nutrition',
    color: '#32CD32',
    isUnlocked: false,
  },
  {
    id: '4',
    title: 'Water Champion',
    description: 'Reach your daily water goal for 5 days',
    icon: 'water',
    color: '#1E90FF',
    isUnlocked: false,
  },
  {
    id: '5',
    title: 'Strength Builder',
    description: 'Complete 10 strength workouts',
    icon: 'barbell',
    color: '#8A2BE2',
    isUnlocked: false,
  },
  {
    id: '6',
    title: 'Cardio King',
    description: 'Complete 10 cardio workouts',
    icon: 'heart',
    color: '#FF69B4',
    isUnlocked: false,
  },
  {
    id: '7',
    title: 'Early Bird',
    description: 'Complete 5 workouts before 8 AM',
    icon: 'sunny',
    color: '#FFA500',
    isUnlocked: false,
  },
  {
    id: '8',
    title: 'Night Owl',
    description: 'Complete 5 workouts after 8 PM',
    icon: 'moon',
    color: '#483D8B',
    isUnlocked: false,
  },
];

type AchievementItemProps = {
  achievement: (typeof achievementData)[0];
};

const AchievementItem = ({achievement}: AchievementItemProps) => {
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.achievementItem,
        {
          backgroundColor: theme.colors.background.secondary,
          opacity: achievement.isUnlocked ? 1 : 0.6,
        },
      ]}>
      <LinearGradient
        colors={[
          achievement.isUnlocked ? achievement.color : '#808080',
          achievement.isUnlocked
            ? `${achievement.color}90`
            : `${theme.colors.border.light}90`,
        ]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.iconContainer}>
        <Icon name={achievement.icon} size={24} color="white" />
      </LinearGradient>
      <View style={styles.achievementInfo}>
        <Text
          style={[styles.achievementTitle, {color: theme.colors.text.primary}]}>
          {achievement.title}
        </Text>
        <Text
          style={[
            styles.achievementDescription,
            {color: theme.colors.text.secondary},
          ]}>
          {achievement.description}
        </Text>
        {achievement.isUnlocked && achievement.unlockedAt && (
          <Text
            style={[
              styles.achievementDate,
              {color: theme.colors.text.tertiary},
            ]}>
            Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
          </Text>
        )}
      </View>
      <View style={styles.achievementStatus}>
        <Icon
          name={achievement.isUnlocked ? 'checkmark-circle' : 'lock-closed'}
          size={20}
          color={
            achievement.isUnlocked
              ? theme.colors.success
              : theme.colors.text.tertiary
          }
        />
      </View>
    </View>
  );
};

const AchievementsScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();

  const unlocked = achievementData.filter(a => a.isUnlocked).length;
  const total = achievementData.length;
  const progress = (unlocked / total) * 100;

  const handleGoBack = () => {
    navigation.goBack();
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
          Achievements
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressCircle,
            {borderColor: theme.colors.border.light},
          ]}>
          <Text style={[styles.progressText, {color: theme.colors.primary}]}>
            {unlocked}/{total}
          </Text>
        </View>
        <View>
          <Text
            style={[styles.progressTitle, {color: theme.colors.text.primary}]}>
            Achievement Progress
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {backgroundColor: theme.colors.border.light},
              ]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: theme.colors.primary,
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.progressPercentage,
                {color: theme.colors.text.secondary},
              ]}>
              {Math.round(progress)}%
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={achievementData}
        renderItem={({item}) => <AchievementItem achievement={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.achievementsList}
        showsVerticalScrollIndicator={false}
      />
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    width: 180,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  progressPercentage: {
    marginLeft: 8,
    fontSize: 14,
  },
  achievementsList: {
    padding: 20,
  },
  achievementItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
  },
  achievementStatus: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
  },
});

export default AchievementsScreen;
