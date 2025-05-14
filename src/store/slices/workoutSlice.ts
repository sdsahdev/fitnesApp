import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  description?: string;
  imageURL?: string;
  videoURL?: string;
  equipment?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface WorkoutExercise extends Exercise {
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  rest?: number;
  completed?: boolean;
}

interface Workout {
  id: string;
  name: string;
  description?: string;
  imageURL?: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'custom';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  caloriesBurn?: number;
  exercises: WorkoutExercise[];
  createdAt: any;
  userId?: string;
  isPremium?: boolean;
}

interface WorkoutState {
  workouts: Workout[];
  userWorkouts: Workout[];
  recentWorkouts: Workout[];
  currentWorkout: Workout | null;
  exercises: Exercise[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkoutState = {
  workouts: [],
  userWorkouts: [],
  recentWorkouts: [],
  currentWorkout: null,
  exercises: [],
  isLoading: false,
  error: null,
};

export const fetchWorkouts = createAsyncThunk(
  'workout/fetchWorkouts',
  async (_, {rejectWithValue}) => {
    try {
      const workoutsSnapshot = await firestore()
        .collection('workouts')
        .where('isPremium', '==', false)
        .orderBy('createdAt', 'desc')
        .get();

      const workouts = workoutsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Workout[];

      return workouts;
    } catch (error: any) {
      console.log(error, '===> workouts error');

      return rejectWithValue(error.message);
    }
  },
);

export const fetchUserWorkouts = createAsyncThunk(
  'workout/fetchUserWorkouts',
  async (userId: string, {rejectWithValue}) => {
    try {
      const workoutsSnapshot = await firestore()
        .collection('workouts')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const workouts = workoutsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Workout[];

      return workouts;
    } catch (error: any) {
      console.log(error, '===> fetchUserWorkouts error');

      return rejectWithValue(error.message);
    }
  },
);

export const fetchExercises = createAsyncThunk(
  'workout/fetchExercises',
  async (_, {rejectWithValue}) => {
    try {
      const exercisesSnapshot = await firestore().collection('exercises').get();

      const exercises = exercisesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Exercise[];

      return exercises;
    } catch (error: any) {
      console.log(error, '===> fetchExercises error');

      return rejectWithValue(error.message);
    }
  },
);

export const createUserWorkout = createAsyncThunk(
  'workout/createUserWorkout',
  async (
    {
      userId,
      workoutData,
    }: {userId: string; workoutData: Omit<Workout, 'id' | 'createdAt'>},
    {rejectWithValue},
  ) => {
    try {
      const workoutRef = firestore().collection('workouts').doc();

      const workout: Omit<Workout, 'id'> = {
        ...workoutData,
        userId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await workoutRef.set(workout);

      return {
        id: workoutRef.id,
        ...workout,
      } as Workout;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const recordCompletedWorkout = createAsyncThunk(
  'workout/recordCompletedWorkout',
  async (
    {
      userId,
      workoutId,
      duration,
      caloriesBurned,
    }: {
      userId: string;
      workoutId: string;
      duration: number;
      caloriesBurned: number;
    },
    {rejectWithValue},
  ) => {
    try {
      const completedWorkoutRef = firestore()
        .collection('userWorkoutHistory')
        .doc();

      await completedWorkoutRef.set({
        userId,
        workoutId,
        completedAt: firestore.FieldValue.serverTimestamp(),
        duration,
        caloriesBurned,
      });

      return {workoutId, completedAt: new Date().toISOString()};
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    setCurrentWorkout(state, action) {
      state.currentWorkout = action.payload;
    },
    clearCurrentWorkout(state) {
      state.currentWorkout = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWorkouts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workouts = action.payload;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserWorkouts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserWorkouts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userWorkouts = action.payload;
      })
      .addCase(fetchUserWorkouts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchExercises.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exercises = action.payload;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createUserWorkout.fulfilled, (state, action) => {
        state.userWorkouts.unshift(action.payload);
      })
      .addCase(recordCompletedWorkout.fulfilled, (state, action) => {
        const {workoutId} = action.payload;
        const workout = [...state.workouts, ...state.userWorkouts].find(
          w => w.id === workoutId,
        );

        if (workout) {
          state.recentWorkouts = [workout, ...state.recentWorkouts.slice(0, 4)];
        }
      });
  },
});

export const {setCurrentWorkout, clearCurrentWorkout} = workoutSlice.actions;
export default workoutSlice.reducer;
