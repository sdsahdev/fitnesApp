import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import {RootState} from '../../store';
import {
  fetchWorkouts,
  fetchUserWorkouts,
} from '../../store/slices/workoutSlice';
import {
  fetchMealEntriesByDate,
  fetchWaterEntriesByDate,
} from '../../store/slices/nutritionSlice';
import Card from '../../components/Card';
import {useTheme} from '../../theme/ThemeProvider';

// Define proper types for components props
type WorkoutType = {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  duration: number;
  exercises: any[];
  imageURL?: string;
};

type WorkoutCardProps = {
  workout: WorkoutType;
  onPress: () => void;
};

const WorkoutCard = ({workout, onPress}: WorkoutCardProps) => {
  const {theme} = useTheme();

  const getWorkoutColor = () => {
    switch (workout.type) {
      case 'strength':
        return theme.colors.workoutCard.strength;
      case 'cardio':
        return theme.colors.workoutCard.cardio;
      case 'flexibility':
        return theme.colors.workoutCard.flexibility;
      case 'hiit':
        return theme.colors.workoutCard.hiit;
      default:
        return theme.colors.workoutCard.custom;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.workoutCardContainer}>
      <LinearGradient
        colors={[getWorkoutColor(), `${getWorkoutColor()}90`]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.workoutCard}>
        <View style={styles.workoutCardContent}>
          <Text style={styles.workoutCardTitle}>{workout.name}</Text>
          <View style={styles.workoutCardDetails}>
            <View style={styles.workoutCardDetail}>
              <Icon name="time-outline" size={16} color="white" />
              <Text style={styles.workoutCardDetailText}>
                {workout.duration} min
              </Text>
            </View>
            <View style={styles.workoutCardDetail}>
              <Icon name="barbell-outline" size={16} color="white" />
              <Text style={styles.workoutCardDetailText}>
                {workout.exercises.length} exercises
              </Text>
            </View>
          </View>
          <View style={styles.workoutCardDifficulty}>
            <Text style={styles.workoutCardDifficultyText}>
              {workout.difficulty}
            </Text>
          </View>
        </View>
        {workout.imageURL && (
          <Image
            source={{uri: workout.imageURL}}
            style={styles.workoutCardImage}
            resizeMode="cover"
          />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

type StatCardProps = {
  icon: string;
  value: string;
  label: string;
  color: string;
};

const StatCard = ({icon, value, label, color}: StatCardProps) => {
  const {theme} = useTheme();

  return (
    <Card style={styles.statCard} variant="elevation">
      <View style={[styles.statCardIcon, {backgroundColor: `${color}20`}]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.statCardValue, {color: theme.colors.text.primary}]}>
        {value}
      </Text>
      <Text style={[styles.statCardLabel, {color: theme.colors.text.tertiary}]}>
        {label}
      </Text>
    </Card>
  );
};

// Empty state component for sections with no data
const EmptyState = ({message}: {message: string}) => {
  const {theme} = useTheme();

  return (
    <View style={styles.emptyState}>
      <Icon
        name="alert-circle-outline"
        size={40}
        color={theme.colors.text.tertiary}
      />
      <Text
        style={{
          color: theme.colors.text.tertiary,
          marginTop: 8,
          textAlign: 'center',
        }}>
        {message}
      </Text>
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {user} = useSelector((state: RootState) => state.auth);
  const {workouts, recentWorkouts, isLoading} = useSelector(
    (state: RootState) => state.workout,
  );
  const {dailyNutrition, isLoading: nutritionLoading} = useSelector(
    (state: RootState) => state.nutrition,
  );

  const [refreshing, setRefreshing] = useState(false);
  const [today] = useState(new Date().toISOString().split('T')[0]);

  // Load data when component mounts and when user changes
  useEffect(() => {
    if (user?.uid) {
      loadData();
    }
  }, [user]);

  const loadData = useCallback(() => {
    if (user?.uid) {
      // Fetch workout data
      dispatch(fetchWorkouts() as any);
      dispatch(fetchUserWorkouts(user.uid) as any);

      // Load nutrition data for today
      dispatch(fetchMealEntriesByDate({userId: user.uid, date: today}) as any);
      dispatch(fetchWaterEntriesByDate({userId: user.uid, date: today}) as any);
    }
  }, [dispatch, user, today]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1500); // Give some time for data to load
  }, [loadData]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Render a loading indicator if initial data is loading
  if (isLoading && !refreshing && !workouts.length) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={[styles.loadingText, {color: theme.colors.text.secondary}]}>
          Loading your fitness data...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, {color: theme.colors.text.primary}]}>
              {greeting()},
            </Text>
            <Text style={[styles.username, {color: theme.colors.text.primary}]}>
              {user?.displayName || 'Fitness Enthusiast'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile' as never)}
            style={styles.profileImageContainer}>
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
          </TouchableOpacity>
        </View>

        {/* Today's Stats */}
        <Text style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
          Today's Progress
        </Text>
        <View style={styles.statsContainer}>
          <StatCard
            icon="barbell"
            value={recentWorkouts.length > 0 ? `${recentWorkouts.length}` : '0'}
            label="Workouts"
            color={theme.colors.primary}
          />
          <StatCard
            icon="flame"
            value={
              dailyNutrition?.totalCalories
                ? `${Math.round(dailyNutrition.totalCalories)}`
                : '0'
            }
            label="Calories"
            color={theme.colors.workoutCard.strength}
          />
          <StatCard
            icon="water"
            value={
              dailyNutrition?.water
                ? `${Math.round(dailyNutrition.water / 1000)}L`
                : '0L'
            }
            label="Water"
            color={theme.colors.info}
          />
        </View>

        {/* Featured Workout */}
        <View style={styles.featuredSection}>
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
            Featured Workout
          </Text>

          {isLoading && !workouts.length ? (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : workouts.length > 0 ? (
            <WorkoutCard
              workout={workouts[0]}
              onPress={() =>
                navigation.navigate('WorkoutDetail', {
                  workoutId: workouts[0].id,
                } as never)
              }
            />
          ) : (
            <EmptyState message="No featured workouts available yet" />
          )}
        </View>

        {/* Recommended Workouts */}
        <Text style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
          Recommended For You
        </Text>

        {isLoading && !workouts.length ? (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            horizontal
            data={workouts.slice(1, 5)}
            renderItem={({item}) => (
              <WorkoutCard
                workout={item}
                onPress={() =>
                  navigation.navigate('WorkoutDetail', {
                    workoutId: item.id,
                  } as never)
                }
              />
            )}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedList}
            ListEmptyComponent={() => (
              <EmptyState message="No recommended workouts available yet" />
            )}
          />
        )}

        {/* Quick Start */}
        <View style={styles.quickStartSection}>
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
            Quick Start
          </Text>

          <View style={styles.quickStartGrid}>
            <TouchableOpacity
              style={[
                styles.quickStartItem,
                {backgroundColor: theme.colors.background.secondary},
              ]}
              onPress={() => navigation.navigate('Workouts' as never)}>
              <Icon name="barbell" size={24} color={theme.colors.primary} />
              <Text
                style={[
                  styles.quickStartText,
                  {color: theme.colors.text.primary},
                ]}>
                Workouts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickStartItem,
                {backgroundColor: theme.colors.background.secondary},
              ]}
              onPress={() => navigation.navigate('Nutrition' as never)}>
              <Icon
                name="nutrition"
                size={24}
                color={theme.colors.workoutCard.strength}
              />
              <Text
                style={[
                  styles.quickStartText,
                  {color: theme.colors.text.primary},
                ]}>
                Nutrition
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickStartItem,
                {backgroundColor: theme.colors.background.secondary},
              ]}
              onPress={() => navigation.navigate('Progress' as never)}>
              <Icon
                name="stats-chart"
                size={24}
                color={theme.colors.secondary}
              />
              <Text
                style={[
                  styles.quickStartText,
                  {color: theme.colors.text.primary},
                ]}>
                Progress
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickStartItem,
                {backgroundColor: theme.colors.background.secondary},
              ]}
              onPress={() => {
                navigation.navigate('Nutrition' as never);
                // We'll need to add a timeout to navigate to the WaterTracker screen after the Nutrition tab is loaded
                setTimeout(() => {
                  navigation.navigate('WaterTracker' as never);
                }, 100);
              }}>
              <Icon name="water" size={24} color={theme.colors.info} />
              <Text
                style={[
                  styles.quickStartText,
                  {color: theme.colors.text.primary},
                ]}>
                Water
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  loadingIndicator: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    marginHorizontal: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    alignItems: 'center',
  },
  statCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 12,
  },
  featuredSection: {
    marginBottom: 16,
  },
  workoutCardContainer: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  workoutCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
    flexDirection: 'row',
  },
  workoutCardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  workoutCardTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  workoutCardDetails: {
    marginVertical: 8,
  },
  workoutCardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  workoutCardDetailText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
  },
  workoutCardDifficulty: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  workoutCardDifficultyText: {
    color: 'white',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  workoutCardImage: {
    width: 120,
    height: '100%',
  },
  recommendedList: {
    paddingHorizontal: 16,
    minHeight: 100,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 16,
    marginHorizontal: 24,
  },
  quickStartSection: {
    marginBottom: 24,
  },
  quickStartGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  quickStartItem: {
    width: '46%',
    margin: '2%',
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStartText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HomeScreen;
