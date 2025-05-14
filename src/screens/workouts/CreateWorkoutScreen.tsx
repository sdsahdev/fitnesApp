import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import {useTheme} from '../../theme/ThemeProvider';
import {Picker} from '@react-native-picker/picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  createUserWorkout,
  fetchUserWorkouts,
} from '../../store/slices/workoutSlice';
import {RootState} from '../../store';

type WorkoutExercise = {
  id: string;
  name: string;
  muscleGroup: string;
  imageURL: string;
  sets: number;
  reps: number;
  duration: number;
  restTime: number;
};

const CreateWorkoutScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {user} = useSelector((state: RootState) => state.auth);
  const {exercises: storeExercises, isLoading} = useSelector(
    (state: RootState) => state.workout,
  );

  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [workoutType, setWorkoutType] = useState('strength');
  const [workoutDifficulty, setWorkoutDifficulty] = useState('intermediate');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<
    number | null
  >(null);
  const [isSaving, setIsSaving] = useState(false);

  // Use store exercises if available, fallback to mock data
  const exerciseLibrary = useMemo(() => {
    if (storeExercises && storeExercises.length > 0) {
      return storeExercises;
    }
    return [
      {
        id: 'ex1',
        name: 'Push-ups',
        muscleGroup: 'chest',
        imageURL: 'https://via.placeholder.com/100',
        difficulty: 'beginner',
      },
      {
        id: 'ex2',
        name: 'Squats',
        muscleGroup: 'legs',
        imageURL: 'https://via.placeholder.com/100',
        difficulty: 'beginner',
      },
      {
        id: 'ex3',
        name: 'Plank',
        muscleGroup: 'core',
        imageURL: 'https://via.placeholder.com/100',
        difficulty: 'beginner',
      },
      {
        id: 'ex4',
        name: 'Pull-ups',
        muscleGroup: 'back',
        imageURL: 'https://via.placeholder.com/100',
        difficulty: 'intermediate',
      },
      {
        id: 'ex5',
        name: 'Shoulder Press',
        muscleGroup: 'shoulders',
        imageURL: 'https://via.placeholder.com/100',
        difficulty: 'intermediate',
      },
      {
        id: 'ex6',
        name: 'Lunges',
        muscleGroup: 'legs',
        imageURL: 'https://via.placeholder.com/100',
        difficulty: 'beginner',
      },
      {
        id: 'ex7',
        name: 'Bicep Curls',
        muscleGroup: 'arms',
        imageURL: 'https://via.placeholder.com/100',
        difficulty: 'beginner',
      },
    ];
  }, [storeExercises]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAddExercise = () => {
    setShowExerciseLibrary(true);
  };

  const handleSelectExercise = (exercise: (typeof exerciseLibrary)[0]) => {
    const newExercise: WorkoutExercise = {
      ...exercise,
      sets: 3,
      reps: 10,
      duration: 0,
      restTime: 60,
    };

    setExercises(prev => [...prev, newExercise]);
    setShowExerciseLibrary(false);
  };

  const handleUpdateExercise = (
    index: number,
    field: string,
    value: number,
  ) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    };
    setExercises(updatedExercises);
  };

  const handleRemoveExercise = (index: number) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
    setSelectedExerciseIndex(null);
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === exercises.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedExercises = [...exercises];
    [updatedExercises[index], updatedExercises[newIndex]] = [
      updatedExercises[newIndex],
      updatedExercises[index],
    ];

    setExercises(updatedExercises);
    setSelectedExerciseIndex(newIndex);
  };

  const handleSaveWorkout = async () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    if (exercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise to your workout');
      return;
    }

    if (!user || !user.uid) {
      Alert.alert('Error', 'You must be logged in to create a workout');
      return;
    }

    setIsSaving(true);

    try {
      // Calculate estimated duration based on exercise count and rest times
      const totalExerciseDuration = exercises.reduce((total, exercise) => {
        const exerciseDuration =
          exercise.duration || exercise.sets * exercise.reps * 3; // Approx 3 seconds per rep
        const restDuration = exercise.restTime * (exercise.sets - 1); // Rest between sets
        return total + exerciseDuration + restDuration;
      }, 0);

      // Convert seconds to minutes and round up
      const estimatedDuration = Math.ceil(totalExerciseDuration / 60);

      const workoutData = {
        name: workoutName,
        description: workoutDescription,
        type: workoutType as
          | 'strength'
          | 'cardio'
          | 'flexibility'
          | 'hiit'
          | 'custom',
        difficulty: workoutDifficulty as
          | 'beginner'
          | 'intermediate'
          | 'advanced',
        duration: estimatedDuration,
        exercises: exercises,
        isPremium: false,
      };

      // Dispatch action to create workout
      await dispatch(
        createUserWorkout({
          userId: user.uid,
          workoutData,
        }) as any,
      );

      // Refresh user workouts list to immediately show new workout
      await dispatch(fetchUserWorkouts(user.uid) as any);
      setIsSaving(false);

      Alert.alert('Success', 'Workout saved successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      setIsSaving(false);
      Alert.alert('Error', 'Failed to save workout. Please try again.');
      console.error('Error saving workout:', error);
    }
  };

  const renderExerciseSettings = (exercise: WorkoutExercise, index: number) => {
    return (
      <View
        style={[
          styles.exerciseSettings,
          {backgroundColor: theme.colors.background.secondary},
        ]}>
        <View style={styles.settingsHeader}>
          <Text
            style={[styles.settingsTitle, {color: theme.colors.text.primary}]}>
            Exercise Settings
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedExerciseIndex(null)}>
            <Icon name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.settingRow}>
          <Text
            style={[styles.settingLabel, {color: theme.colors.text.secondary}]}>
            Sets:
          </Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[
                styles.counterButton,
                {backgroundColor: theme.colors.background.tertiary},
              ]}
              onPress={() =>
                handleUpdateExercise(
                  index,
                  'sets',
                  Math.max(1, exercise.sets - 1),
                )
              }>
              <Icon name="remove" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text
              style={[styles.counterValue, {color: theme.colors.text.primary}]}>
              {exercise.sets}
            </Text>
            <TouchableOpacity
              style={[
                styles.counterButton,
                {backgroundColor: theme.colors.background.tertiary},
              ]}
              onPress={() =>
                handleUpdateExercise(index, 'sets', exercise.sets + 1)
              }>
              <Icon name="add" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {exercise.duration === 0 ? (
          <View style={styles.settingRow}>
            <Text
              style={[
                styles.settingLabel,
                {color: theme.colors.text.secondary},
              ]}>
              Reps:
            </Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={[
                  styles.counterButton,
                  {backgroundColor: theme.colors.background.tertiary},
                ]}
                onPress={() =>
                  handleUpdateExercise(
                    index,
                    'reps',
                    Math.max(1, exercise.reps - 1),
                  )
                }>
                <Icon
                  name="remove"
                  size={20}
                  color={theme.colors.text.primary}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.counterValue,
                  {color: theme.colors.text.primary},
                ]}>
                {exercise.reps}
              </Text>
              <TouchableOpacity
                style={[
                  styles.counterButton,
                  {backgroundColor: theme.colors.background.tertiary},
                ]}
                onPress={() =>
                  handleUpdateExercise(index, 'reps', exercise.reps + 1)
                }>
                <Icon name="add" size={20} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.settingRow}>
            <Text
              style={[
                styles.settingLabel,
                {color: theme.colors.text.secondary},
              ]}>
              Duration (sec):
            </Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={[
                  styles.counterButton,
                  {backgroundColor: theme.colors.background.tertiary},
                ]}
                onPress={() =>
                  handleUpdateExercise(
                    index,
                    'duration',
                    Math.max(5, exercise.duration - 5),
                  )
                }>
                <Icon
                  name="remove"
                  size={20}
                  color={theme.colors.text.primary}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.counterValue,
                  {color: theme.colors.text.primary},
                ]}>
                {exercise.duration}
              </Text>
              <TouchableOpacity
                style={[
                  styles.counterButton,
                  {backgroundColor: theme.colors.background.tertiary},
                ]}
                onPress={() =>
                  handleUpdateExercise(index, 'duration', exercise.duration + 5)
                }>
                <Icon name="add" size={20} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.settingRow}>
          <Text
            style={[styles.settingLabel, {color: theme.colors.text.secondary}]}>
            Rest (sec):
          </Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[
                styles.counterButton,
                {backgroundColor: theme.colors.background.tertiary},
              ]}
              onPress={() =>
                handleUpdateExercise(
                  index,
                  'restTime',
                  Math.max(0, exercise.restTime - 5),
                )
              }>
              <Icon name="remove" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text
              style={[styles.counterValue, {color: theme.colors.text.primary}]}>
              {exercise.restTime}
            </Text>
            <TouchableOpacity
              style={[
                styles.counterButton,
                {backgroundColor: theme.colors.background.tertiary},
              ]}
              onPress={() =>
                handleUpdateExercise(index, 'restTime', exercise.restTime + 5)
              }>
              <Icon name="add" size={20} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.moveButton, {opacity: index === 0 ? 0.5 : 1}]}
            onPress={() => handleMoveExercise(index, 'up')}
            disabled={index === 0}>
            <Icon name="arrow-up" size={20} color={theme.colors.text.primary} />
            <Text
              style={[styles.buttonText, {color: theme.colors.text.primary}]}>
              Move Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.moveButton,
              {opacity: index === exercises.length - 1 ? 0.5 : 1},
            ]}
            onPress={() => handleMoveExercise(index, 'down')}
            disabled={index === exercises.length - 1}>
            <Icon
              name="arrow-down"
              size={20}
              color={theme.colors.text.primary}
            />
            <Text
              style={[styles.buttonText, {color: theme.colors.text.primary}]}>
              Move Down
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.removeButton,
              {backgroundColor: `${theme.colors.error}20`},
            ]}
            onPress={() => handleRemoveExercise(index)}>
            <Icon name="trash" size={20} color={theme.colors.error} />
            <Text style={[styles.buttonText, {color: theme.colors.error}]}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text.primary}]}>
          Create Workout
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Workout Info */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
            Workout Info
          </Text>

          <View style={styles.inputGroup}>
            <Text
              style={[styles.inputLabel, {color: theme.colors.text.secondary}]}>
              Name
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                },
              ]}
              placeholder="Enter workout name"
              placeholderTextColor={theme.colors.text.tertiary}
              value={workoutName}
              onChangeText={setWorkoutName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text
              style={[styles.inputLabel, {color: theme.colors.text.secondary}]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                },
              ]}
              placeholder="Describe your workout (optional)"
              placeholderTextColor={theme.colors.text.tertiary}
              value={workoutDescription}
              onChangeText={setWorkoutDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text
              style={[styles.inputLabel, {color: theme.colors.text.secondary}]}>
              Type
            </Text>
            <View
              style={[
                styles.pickerContainer,
                {backgroundColor: theme.colors.background.secondary},
              ]}>
              <Picker
                selectedValue={workoutType}
                onValueChange={value => setWorkoutType(value)}
                style={[styles.picker, {color: theme.colors.text.primary}]}>
                <Picker.Item label="Strength" value="strength" />
                <Picker.Item label="Cardio" value="cardio" />
                <Picker.Item label="HIIT" value="hiit" />
                <Picker.Item label="Flexibility" value="flexibility" />
                <Picker.Item label="Custom" value="custom" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text
              style={[styles.inputLabel, {color: theme.colors.text.secondary}]}>
              Difficulty
            </Text>
            <View
              style={[
                styles.pickerContainer,
                {backgroundColor: theme.colors.background.secondary},
              ]}>
              <Picker
                selectedValue={workoutDifficulty}
                onValueChange={value => setWorkoutDifficulty(value)}
                style={[styles.picker, {color: theme.colors.text.primary}]}>
                <Picker.Item label="Beginner" value="beginner" />
                <Picker.Item label="Intermediate" value="intermediate" />
                <Picker.Item label="Advanced" value="advanced" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Exercises */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
            Exercises ({exercises.length})
          </Text>

          {exercises.map((exercise, index) => (
            <View key={exercise.id + index}>
              <TouchableOpacity
                style={[
                  styles.exerciseItem,
                  {
                    backgroundColor: theme.colors.background.secondary,
                    borderColor:
                      selectedExerciseIndex === index
                        ? theme.colors.primary
                        : 'transparent',
                  },
                ]}
                onPress={() =>
                  setSelectedExerciseIndex(
                    index === selectedExerciseIndex ? null : index,
                  )
                }>
                <Text
                  style={[
                    styles.exerciseNumber,
                    {color: theme.colors.primary},
                  ]}>
                  {index + 1}
                </Text>
                <Image
                  source={{uri: exercise.imageURL}}
                  style={styles.exerciseImage}
                />
                <View style={styles.exerciseInfo}>
                  <Text
                    style={[
                      styles.exerciseName,
                      {color: theme.colors.text.primary},
                    ]}>
                    {exercise.name}
                  </Text>
                  <Text
                    style={[
                      styles.exerciseDetails,
                      {color: theme.colors.text.secondary},
                    ]}>
                    {exercise.sets} sets •{' '}
                    {exercise.duration > 0
                      ? `${exercise.duration}s`
                      : `${exercise.reps} reps`}
                  </Text>
                </View>
                <Icon
                  name={
                    selectedExerciseIndex === index
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size={20}
                  color={theme.colors.text.tertiary}
                />
              </TouchableOpacity>

              {selectedExerciseIndex === index &&
                renderExerciseSettings(exercise, index)}
            </View>
          ))}

          <Button
            title="Add Exercise"
            icon="add-circle"
            onPress={handleAddExercise}
            size="medium"
            fullWidth
            style={styles.addButton}
          />
        </View>

        <View style={styles.footer}>
          <Button
            title={isSaving ? 'Saving...' : 'Save Workout'}
            onPress={handleSaveWorkout}
            disabled={isSaving}
            fullWidth
          />
          {isSaving && (
            <ActivityIndicator
              style={{marginTop: 10}}
              size="small"
              color={theme.colors.primary}
            />
          )}
        </View>
      </ScrollView>

      {/* Exercise Library Modal */}
      {showExerciseLibrary && (
        <View style={[styles.modal, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: theme.colors.background.primary},
            ]}>
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, {color: theme.colors.text.primary}]}>
                Select Exercise
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowExerciseLibrary(false)}>
                <Icon
                  name="close"
                  size={24}
                  color={theme.colors.text.primary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.exerciseList}>
              {exerciseLibrary.map(exercise => (
                <TouchableOpacity
                  key={exercise.id}
                  style={[
                    styles.libraryItem,
                    {backgroundColor: theme.colors.background.secondary},
                  ]}
                  onPress={() => handleSelectExercise(exercise)}>
                  <Image
                    source={{uri: exercise.imageURL}}
                    style={styles.libraryImage}
                  />
                  <View style={styles.libraryInfo}>
                    <Text
                      style={[
                        styles.libraryName,
                        {color: theme.colors.text.primary},
                      ]}>
                      {exercise.name}
                    </Text>
                    <Text
                      style={[
                        styles.libraryMuscle,
                        {color: theme.colors.text.secondary},
                      ]}>
                      {exercise.muscleGroup.charAt(0).toUpperCase() +
                        exercise.muscleGroup.slice(1)}
                    </Text>
                  </View>
                  <Icon
                    name="add-circle"
                    size={24}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
    width: '100%',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
  },
  exerciseNumber: {
    width: 24,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  exerciseImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
  },
  exerciseSettings: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginTop: -6,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  moveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  addButton: {
    marginTop: 10,
  },
  modal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseList: {
    padding: 16,
  },
  libraryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  libraryImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 16,
  },
  libraryInfo: {
    flex: 1,
  },
  libraryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  libraryMuscle: {
    fontSize: 14,
  },
  footer: {
    padding: 20,
  },
});

export default CreateWorkoutScreen;
