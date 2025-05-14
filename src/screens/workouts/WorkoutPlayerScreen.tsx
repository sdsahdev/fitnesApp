import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../../theme/ThemeProvider';
import Button from '../../components/Button';

// Mock workout data
const mockWorkout = {
  id: '1',
  name: 'Full Body Strength',
  exercises: [
    {
      id: 'ex1',
      name: 'Push-ups',
      sets: 3,
      reps: 15,
      duration: 0,
      restTime: 60,
      imageURL: 'https://via.placeholder.com/400',
    },
    {
      id: 'ex2',
      name: 'Squats',
      sets: 3,
      reps: 12,
      duration: 0,
      restTime: 60,
      imageURL: 'https://via.placeholder.com/400',
    },
    {
      id: 'ex3',
      name: 'Plank',
      sets: 3,
      reps: 0,
      duration: 30,
      restTime: 60,
      imageURL: 'https://via.placeholder.com/400',
    },
    {
      id: 'ex4',
      name: 'Dumbbell Rows',
      sets: 3,
      reps: 12,
      duration: 0,
      restTime: 60,
      imageURL: 'https://via.placeholder.com/400',
    },
  ],
};

const WorkoutPlayerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {theme} = useTheme();
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // In a real app, you would fetch workout data based on the workoutId from route params
  // const workoutId = route.params?.workoutId;
  const [workout] = useState(mockWorkout);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const exerciseProgress =
    (currentExerciseIndex / workout.exercises.length) * 100;
  const workoutProgress =
    ((currentExerciseIndex + currentSetIndex / currentExercise.sets) /
      workout.exercises.length) *
    100;

  useEffect(() => {
    // Handle back button press
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackConfirmation,
    );

    return () => {
      backHandler.remove();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isResting && !workoutComplete && !isPaused) {
      // If not in rest mode and not completed, no timer needed for reps based exercises
      if (currentExercise.duration > 0) {
        startExerciseTimer();
      }
    } else if (isResting && !isPaused) {
      startRestTimer();
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [
    isResting,
    currentExerciseIndex,
    currentSetIndex,
    workoutComplete,
    isPaused,
  ]);

  const startExerciseTimer = () => {
    setTimer(currentExercise.duration);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          handleCompleteSet();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const startRestTimer = () => {
    setTimer(currentExercise.restTime);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          moveToNextSet();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleCompleteSet = () => {
    if (currentSetIndex < currentExercise.sets - 1) {
      // More sets remaining for this exercise
      setIsResting(true);
    } else if (currentExerciseIndex < workout.exercises.length - 1) {
      // Move to next exercise
      setCurrentExerciseIndex(prevIndex => prevIndex + 1);
      setCurrentSetIndex(0);
      setIsResting(false);
    } else {
      // Workout completed
      setWorkoutComplete(true);
    }
  };

  const moveToNextSet = () => {
    if (currentSetIndex < currentExercise.sets - 1) {
      setCurrentSetIndex(prevIndex => prevIndex + 1);
      setIsResting(false);
    } else if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prevIndex => prevIndex + 1);
      setCurrentSetIndex(0);
      setIsResting(false);
    } else {
      setWorkoutComplete(true);
    }
  };

  const handleSkipRest = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    moveToNextSet();
  };

  const handleBackConfirmation = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsPaused(true);

    Alert.alert(
      'Exit Workout',
      'Are you sure you want to quit this workout? Your progress will be lost.',
      [
        {
          text: 'Cancel',
          onPress: () => {
            setIsPaused(false);
            if (isResting) {
              startRestTimer();
            } else if (currentExercise.duration > 0 && !workoutComplete) {
              startExerciseTimer();
            }
          },
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => navigation.goBack(),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
    return true;
  };

  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      if (isResting) {
        startRestTimer();
      } else if (currentExercise.duration > 0) {
        startExerciseTimer();
      }
    } else {
      setIsPaused(true);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSetIndex > 0) {
      setCurrentSetIndex(prevIndex => prevIndex - 1);
    } else if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prevIndex => prevIndex - 1);
      setCurrentSetIndex(workout.exercises[currentExerciseIndex - 1].sets - 1);
    }
    setIsResting(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleNext = () => {
    handleCompleteSet();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleFinishWorkout = () => {
    // In a real app, you would save workout stats here
    navigation.navigate('WorkoutComplete', {workoutId: workout.id} as never);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (workoutComplete) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        <View style={styles.completeContainer}>
          <Icon
            name="checkmark-circle"
            size={80}
            color={theme.colors.success}
          />
          <Text
            style={[styles.completeTitle, {color: theme.colors.text.primary}]}>
            Workout Complete!
          </Text>
          <Text
            style={[
              styles.completeSubtitle,
              {color: theme.colors.text.secondary},
            ]}>
            Great job! You've completed the workout.
          </Text>
          <Button
            title="Finish"
            onPress={handleFinishWorkout}
            size="large"
            style={styles.completeButton}
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackConfirmation}
          style={styles.backButton}>
          <Icon name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text
            style={[styles.headerTitle, {color: theme.colors.text.primary}]}>
            {workout.name}
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              {color: theme.colors.text.secondary},
            ]}>
            Exercise {currentExerciseIndex + 1}/{workout.exercises.length}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View
        style={[
          styles.progressBarContainer,
          {backgroundColor: theme.colors.background.secondary},
        ]}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${workoutProgress}%`,
              backgroundColor: theme.colors.primary,
            },
          ]}
        />
      </View>

      {/* Exercise Content */}
      <View style={styles.content}>
        {isResting ? (
          <View style={styles.restContainer}>
            <Text
              style={[styles.restTitle, {color: theme.colors.text.primary}]}>
              Rest Time
            </Text>
            <Text style={[styles.timer, {color: theme.colors.primary}]}>
              {formatTime(timer)}
            </Text>
            <Text
              style={[
                styles.nextExerciseLabel,
                {color: theme.colors.text.secondary},
              ]}>
              Next:{' '}
              {currentSetIndex < currentExercise.sets - 1
                ? `${currentExercise.name} (Set ${currentSetIndex + 2}/${
                    currentExercise.sets
                  })`
                : currentExerciseIndex < workout.exercises.length - 1
                ? `${workout.exercises[currentExerciseIndex + 1].name} (Set 1/${
                    workout.exercises[currentExerciseIndex + 1].sets
                  })`
                : 'Workout Complete'}
            </Text>
            <Button
              title="Skip Rest"
              onPress={handleSkipRest}
              size="medium"
              style={styles.skipButton}
            />
          </View>
        ) : (
          <>
            <Image
              source={{uri: currentExercise.imageURL}}
              style={styles.exerciseImage}
              resizeMode="cover"
            />
            <View style={styles.exerciseInfo}>
              <Text
                style={[
                  styles.exerciseName,
                  {color: theme.colors.text.primary},
                ]}>
                {currentExercise.name}
              </Text>
              <Text
                style={[
                  styles.exerciseSet,
                  {color: theme.colors.text.secondary},
                ]}>
                Set {currentSetIndex + 1}/{currentExercise.sets}
              </Text>
              {currentExercise.duration > 0 ? (
                <Text
                  style={[styles.exerciseReps, {color: theme.colors.primary}]}>
                  {formatTime(timer)}
                </Text>
              ) : (
                <Text
                  style={[styles.exerciseReps, {color: theme.colors.primary}]}>
                  {currentExercise.reps} reps
                </Text>
              )}
            </View>
          </>
        )}
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            {
              opacity:
                currentExerciseIndex > 0 || currentSetIndex > 0 ? 1 : 0.5,
            },
          ]}
          onPress={handlePrevious}
          disabled={currentExerciseIndex === 0 && currentSetIndex === 0}>
          <Icon
            name="arrow-back-circle"
            size={40}
            color={theme.colors.text.primary}
          />
          <Text
            style={[styles.controlText, {color: theme.colors.text.secondary}]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handlePauseResume}>
          <Icon
            name={isPaused ? 'play-circle' : 'pause-circle'}
            size={60}
            color={theme.colors.primary}
          />
          <Text
            style={[styles.controlText, {color: theme.colors.text.secondary}]}>
            {isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={handleNext}>
          <Icon
            name="arrow-forward-circle"
            size={40}
            color={theme.colors.text.primary}
          />
          <Text
            style={[styles.controlText, {color: theme.colors.text.secondary}]}>
            {currentSetIndex < currentExercise.sets - 1
              ? 'Next Set'
              : 'Next Exercise'}
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  progressBarContainer: {
    height: 8,
    width: '100%',
    borderRadius: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  exerciseImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 24,
  },
  exerciseInfo: {
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  exerciseSet: {
    fontSize: 18,
    marginBottom: 16,
  },
  exerciseReps: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  restContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  restTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timer: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  nextExerciseLabel: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  skipButton: {
    marginTop: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  controlText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  completeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  completeButton: {
    width: '80%',
  },
});

export default WorkoutPlayerScreen;
