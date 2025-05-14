import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import {RootState} from '../../store';
import Button from '../../components/Button';
import {useTheme} from '../../theme/ThemeProvider';
import {
  recordCompletedWorkout,
  fetchWorkouts,
  fetchUserWorkouts,
} from '../../store/slices/workoutSlice';

// Define proper types
interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration: number;
  restTime: number;
  imageURL: string;
  muscleGroup: string;
  description?: string;
}

interface Workout {
  id: string;
  name: string;
  description?: string;
  duration: number;
  difficulty: string;
  type: string;
  calories?: number;
  caloriesBurn?: number;
  imageURL?: string;
  exercises: WorkoutExercise[];
  reviews?: {
    rating: number;
    count: number;
  };
  isPremium?: boolean;
}

type ExerciseItemProps = {
  exercise: WorkoutExercise;
  index: number;
  onPress: () => void;
};

const ExerciseItem = ({exercise, index, onPress}: ExerciseItemProps) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.exerciseItem,
        {backgroundColor: theme.colors.background.secondary},
      ]}
      onPress={onPress}>
      <View style={styles.exerciseIndex}>
        <Text style={[styles.indexText, {color: theme.colors.primary}]}>
          {index + 1}
        </Text>
      </View>
      {exercise.imageURL ? (
        <Image
          source={{uri: exercise.imageURL}}
          style={styles.exerciseImage}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.exerciseImagePlaceholder,
            {backgroundColor: `${theme.colors.primary}20`},
          ]}>
          <Icon name="barbell-outline" size={24} color={theme.colors.primary} />
        </View>
      )}
      <View style={styles.exerciseDetails}>
        <Text style={[styles.exerciseName, {color: theme.colors.text.primary}]}>
          {exercise.name}
        </Text>
        <Text
          style={[styles.exerciseInfo, {color: theme.colors.text.secondary}]}>
          {exercise.sets} sets •{' '}
          {exercise.reps > 0
            ? `${exercise.reps} reps`
            : `${exercise.duration}s`}
        </Text>
        <Text style={[styles.muscleGroup, {color: theme.colors.text.tertiary}]}>
          {exercise.muscleGroup.charAt(0).toUpperCase() +
            exercise.muscleGroup.slice(1)}
        </Text>
      </View>
      <Icon
        name="chevron-forward"
        size={20}
        color={theme.colors.text.tertiary}
      />
    </TouchableOpacity>
  );
};

const WorkoutDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {user} = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [error, setError] = useState<string | null>(null);

  const workoutId = route.params?.workoutId;
  const {workouts, userWorkouts} = useSelector(
    (state: RootState) => state.workout,
  );

  // Find the workout from Redux state based on ID
  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadWorkout = async () => {
      if (!workoutId || !user?.uid) {
        setLoading(false);
        setError('Unable to load workout details');
        return;
      }

      try {
        // First, refresh the workout data to ensure we have the latest
        await dispatch(fetchWorkouts() as any);
        await dispatch(fetchUserWorkouts(user.uid) as any);

        // Then check in workouts, then in userWorkouts
        const foundWorkout = [...workouts, ...userWorkouts].find(
          w => w.id === workoutId,
        );

        if (foundWorkout) {
          setWorkout(foundWorkout);
        } else {
          setError('Workout not found.');
        }
      } catch (err) {
        setError('Error loading workout details.');
        console.error('Error finding workout:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [workoutId, dispatch, user]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleStartWorkout = useCallback(() => {
    if (!workout || !user) return;

    // Navigate to the workout player
    navigation.navigate('WorkoutPlayer', {workoutId: workout.id} as never);

    // Record that the user started this workout (optional)
    try {
      dispatch(
        recordCompletedWorkout({
          userId: user.uid,
          workoutId: workout.id,
          duration: workout.duration,
          caloriesBurned: workout.caloriesBurn || 300, // Default if not provided
        }) as any,
      );
    } catch (err) {
      console.error('Error recording workout start:', err);
      // Continue anyway since this is non-critical
    }
  }, [navigation, workout, user, dispatch]);

  const handleExercisePress = useCallback(
    (exerciseId: string) => {
      navigation.navigate('ExerciseDetail', {exerciseId} as never);
    },
    [navigation],
  );

  const getWorkoutColor = useCallback(() => {
    if (!workout) return theme.colors.primary;

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
  }, [workout, theme]);

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[styles.loadingText, {color: theme.colors.text.secondary}]}>
            Loading workout details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || !workout) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Icon
              name="arrow-back"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Icon
            name="alert-circle-outline"
            size={60}
            color={theme.colors.error}
          />
          <Text style={[styles.errorText, {color: theme.colors.text.primary}]}>
            {error || 'Workout not found'}
          </Text>
          <Button
            title="Go Back"
            onPress={handleGoBack}
            style={{marginTop: 20}}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      {/* Header Image */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <LinearGradient
            colors={[getWorkoutColor(), `${getWorkoutColor()}90`]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <Text style={styles.workoutType}>
                {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
              </Text>
              <Text style={styles.workoutName}>{workout.name}</Text>

              <View style={styles.workoutStats}>
                <View style={styles.statItem}>
                  <Icon name="time-outline" size={16} color="white" />
                  <Text style={styles.statText}>{workout.duration} min</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="flame-outline" size={16} color="white" />
                  <Text style={styles.statText}>
                    {workout.caloriesBurn || workout.calories || '~300'} cal
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="barbell-outline" size={16} color="white" />
                  <Text style={styles.statText}>
                    {workout.exercises.length} exercises
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Workout Description */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
            Overview
          </Text>
          <Text
            style={[
              styles.workoutDescription,
              {color: theme.colors.text.secondary},
            ]}>
            {workout.description ||
              `A ${workout.difficulty.toLowerCase()} ${
                workout.type
              } workout with ${workout.exercises.length} exercises.`}
          </Text>
        </View>

        {/* Exercise List */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
            Exercises
          </Text>
          {workout.exercises.map((exercise, index) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              index={index}
              onPress={() => handleExercisePress(exercise.id)}
            />
          ))}
        </View>

        {/* Reviews or Equipment Section would go here */}

        {/* Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Start Workout"
            onPress={handleStartWorkout}
            fullWidth
            size="large"
          />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 12,
  },
  heroContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: 20,
  },
  workoutType: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  workoutName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  workoutStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  workoutDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  exerciseIndex: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  indexText: {
    fontWeight: 'bold',
  },
  exerciseImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  exerciseImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  exerciseInfo: {
    fontSize: 14,
    marginBottom: 2,
  },
  muscleGroup: {
    fontSize: 12,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
});

export default WorkoutDetailScreen;
