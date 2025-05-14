import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import {
  fetchWorkouts,
  fetchUserWorkouts,
  fetchExercises,
} from '../../store/slices/workoutSlice';
import {RootState} from '../../store';
import Card from '../../components/Card';
import Button from '../../components/Button';
import {useTheme} from '../../theme/ThemeProvider';

// Define types
type WorkoutType = {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  duration: number;
  description?: string;
  exercises: any[];
  imageURL?: string;
  isPremium?: boolean;
};

type CategoryItemProps = {
  title: string;
  isActive: boolean;
  icon: string;
  onPress: () => void;
  theme: any;
};

type WorkoutCardProps = {
  workout: WorkoutType;
  onPress: () => void;
  theme: any;
};

type Category = {
  id: string;
  title: string;
  icon: string;
};

// Workout category component for filtering
const CategoryItem = ({
  title,
  isActive,
  icon,
  onPress,
  theme,
}: CategoryItemProps) => (
  <TouchableOpacity
    style={[
      styles.categoryItem,
      {
        backgroundColor: isActive
          ? theme.colors.primary
          : theme.colors.background.secondary,
      },
    ]}
    onPress={onPress}>
    <Icon
      name={icon}
      size={20}
      color={isActive ? 'white' : theme.colors.text.tertiary}
    />
    <Text
      style={[
        styles.categoryText,
        {
          color: isActive ? 'white' : theme.colors.text.primary,
          fontWeight: '500',
          marginLeft: 8,
        },
      ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// Workout card component
const WorkoutCard = ({workout, onPress, theme}: WorkoutCardProps) => {
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
    <TouchableOpacity
      style={styles.workoutCardContainer}
      onPress={onPress}
      activeOpacity={0.9}>
      <LinearGradient
        colors={[getWorkoutColor(), `${getWorkoutColor()}90`]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.workoutCard}>
        <View style={styles.workoutCardContent}>
          <View>
            <Text style={styles.workoutCardTitle}>{workout.name}</Text>
            <Text style={styles.workoutCardDescription}>
              {workout.description
                ? workout.description.length > 60
                  ? workout.description.substring(0, 60) + '...'
                  : workout.description
                : `A ${workout.type} workout for ${workout.difficulty} levels`}
            </Text>
          </View>

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

          <View style={styles.workoutCardBadges}>
            <View style={styles.workoutCardDifficulty}>
              <Text style={styles.workoutCardDifficultyText}>
                {workout.difficulty}
              </Text>
            </View>
            {workout.isPremium && (
              <View
                style={[
                  styles.workoutCardPremium,
                  {backgroundColor: theme.colors.accent},
                ]}>
                <Text style={styles.workoutCardPremiumText}>Premium</Text>
              </View>
            )}
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

// Loading indicator component
const LoadingIndicator = () => {
  const {theme} = useTheme();
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.loadingText, {color: theme.colors.text.secondary}]}>
        Loading workouts...
      </Text>
    </View>
  );
};

// Empty state component
const EmptyState = ({
  message,
  category,
  onCreateWorkout,
}: {
  message: string;
  category: string;
  onCreateWorkout: () => void;
}) => {
  const {theme} = useTheme();
  return (
    <View style={styles.emptyState}>
      <View
        style={[
          styles.emptyIconContainer,
          {backgroundColor: `${theme.colors.primary}20`},
        ]}>
        <Text style={styles.emptyIcon}>🏋️</Text>
      </View>
      <Text
        style={[
          styles.emptyTitle,
          {color: theme.colors.text.primary, fontWeight: 'bold'},
        ]}>
        No workouts found
      </Text>
      <Text
        style={[
          styles.emptySubtitle,
          {color: theme.colors.text.secondary, textAlign: 'center'},
        ]}>
        {category === 'all'
          ? 'You have no workouts yet. Create your own custom workout or try another category.'
          : `No ${message} workouts available. Try another category or create your own.`}
      </Text>
      <Button
        title="Create Workout"
        onPress={onCreateWorkout}
        style={{marginTop: 24}}
      />
    </View>
  );
};

// Main screen component
const WorkoutsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {user} = useSelector((state: RootState) => state.auth);
  const {workouts, userWorkouts, isLoading} = useSelector(
    (state: RootState) => state.workout,
  );

  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredWorkouts, setFilteredWorkouts] = useState<WorkoutType[]>([]);

  // Categories for filtering
  const categories: Category[] = useMemo(
    () => [
      {id: 'all', title: 'All', icon: 'grid-outline'},
      {id: 'strength', title: 'Strength', icon: 'barbell-outline'},
      {id: 'cardio', title: 'Cardio', icon: 'heart-outline'},
      {id: 'flexibility', title: 'Flexibility', icon: 'body-outline'},
      {id: 'hiit', title: 'HIIT', icon: 'flame-outline'},
      {id: 'custom', title: 'Custom', icon: 'create-outline'},
    ],
    [],
  );

  // Get the active category title
  const activeCategoryTitle = useMemo(
    () => categories.find(c => c.id === activeCategory)?.title || 'All',
    [activeCategory, categories],
  );

  // Fetch workout data
  useEffect(() => {
    if (user?.uid) {
      loadData();
    }
  }, [user]);

  // Filter workouts when category changes
  useEffect(() => {
    filterWorkouts();
  }, [activeCategory, workouts, userWorkouts]);

  const loadData = useCallback(() => {
    if (user?.uid) {
      dispatch(fetchWorkouts() as any);
      dispatch(fetchUserWorkouts(user.uid) as any);
      dispatch(fetchExercises() as any);
    }
  }, [dispatch, user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    // Give time for refresh to be visible
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [loadData]);

  // Filter workouts based on selected category
  const filterWorkouts = useCallback(() => {
    // Combine public and user workouts
    let allWorkouts = [...workouts, ...userWorkouts];

    // Deduplicate workouts (in case user has access to same workout in both arrays)
    allWorkouts = allWorkouts.filter(
      (workout, index, self) =>
        index === self.findIndex(w => w.id === workout.id),
    );

    if (activeCategory === 'all') {
      setFilteredWorkouts(allWorkouts);
    } else {
      setFilteredWorkouts(
        allWorkouts.filter(workout => workout.type === activeCategory),
      );
    }
  }, [activeCategory, workouts, userWorkouts]);

  // Handle navigation to workout detail
  const navigateToWorkoutDetail = useCallback(
    (workoutId: string) => {
      navigation.navigate('WorkoutDetail', {
        workoutId,
      } as never);
    },
    [navigation],
  );

  // Handle navigation to create workout
  const navigateToCreateWorkout = useCallback(() => {
    navigation.navigate('CreateWorkout' as never);
  }, [navigation]);

  // Get filtered user workouts
  const filteredUserWorkouts = useMemo(
    () =>
      userWorkouts.filter(
        workout => activeCategory === 'all' || workout.type === activeCategory,
      ),
    [userWorkouts, activeCategory],
  );

  // Show full-screen loading indicator on initial load
  if (isLoading && !refreshing && !(workouts.length || userWorkouts.length)) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.screenTitle,
              {
                color: theme.colors.text.primary,
                fontSize: 28,
                fontWeight: 'bold',
              },
            ]}>
            Workouts
          </Text>
          <Text
            style={[
              styles.subtitle,
              {color: theme.colors.text.secondary, fontSize: 16},
            ]}>
            Find your perfect workout
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: theme.colors.primary}]}
          onPress={navigateToCreateWorkout}>
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Categories for filtering */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}>
          {categories.map(category => (
            <CategoryItem
              key={category.id}
              title={category.title}
              icon={category.icon}
              isActive={activeCategory === category.id}
              onPress={() => setActiveCategory(category.id)}
              theme={theme}
            />
          ))}
        </ScrollView>
      </View>

      {/* Workout list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}>
        {isLoading && refreshing && (
          <View style={styles.refreshingIndicator}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={{color: theme.colors.text.secondary, marginLeft: 8}}>
              Refreshing...
            </Text>
          </View>
        )}

        {/* My Workouts Section (Only if user has created workouts) */}
        {filteredUserWorkouts.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text
              style={[
                styles.sectionTitle,
                {color: theme.colors.text.primary, fontWeight: '600'},
              ]}>
              My Workouts
            </Text>
            {filteredUserWorkouts.slice(0, 2).map(workout => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                theme={theme}
                onPress={() => navigateToWorkoutDetail(workout.id)}
              />
            ))}
            {filteredUserWorkouts.length > 2 && (
              <TouchableOpacity
                style={[
                  styles.viewAllButton,
                  {borderColor: theme.colors.border.medium},
                ]}
                onPress={() => {
                  // Handle view all user workouts - could navigate to a dedicated screen
                  // or simply show all workouts in this view
                  setActiveCategory('custom');
                }}>
                <Text
                  style={[
                    styles.viewAllText,
                    {color: theme.colors.text.primary},
                  ]}>
                  View All My Workouts
                </Text>
                <Icon
                  name="chevron-forward"
                  size={16}
                  color={theme.colors.text.primary}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Recommended Workouts */}
        {filteredWorkouts.length > 0 ? (
          <View style={styles.sectionContainer}>
            <Text
              style={[
                styles.sectionTitle,
                {color: theme.colors.text.primary, fontWeight: '600'},
              ]}>
              {activeCategory === 'all'
                ? 'Recommended Workouts'
                : `${activeCategoryTitle} Workouts`}
            </Text>
            {filteredWorkouts.map(workout => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                theme={theme}
                onPress={() => navigateToWorkoutDetail(workout.id)}
              />
            ))}
          </View>
        ) : (
          // No workouts found
          !isLoading && (
            <EmptyState
              message={activeCategoryTitle}
              category={activeCategory}
              onCreateWorkout={navigateToCreateWorkout}
            />
          )
        )}

        {/* Bottom padding for scroll view */}
        <View style={{height: 100}} />
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
  refreshingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  screenTitle: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  workoutCardContainer: {
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
  workoutCardDescription: {
    color: 'white',
    opacity: 0.9,
    fontSize: 14,
    lineHeight: 20,
  },
  workoutCardDetails: {
    marginTop: 16,
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
  workoutCardBadges: {
    flexDirection: 'row',
    marginTop: 8,
  },
  workoutCardDifficulty: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginRight: 8,
  },
  workoutCardDifficultyText: {
    color: 'white',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  workoutCardPremium: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  workoutCardPremiumText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  workoutCardImage: {
    width: 120,
    height: '100%',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
});

export default WorkoutsScreen;
