import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

interface UserProfile {
  height?: number;
  weight?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  fitnessGoal?: 'lose_weight' | 'build_muscle' | 'maintain' | 'get_fit';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietPreference?: 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';
  metrics?: {
    bmi?: number;
    bodyFat?: number;
    muscleMass?: number;
  };
  achievements?: string[];
  premiumUntil?: string | null;
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string, {rejectWithValue}) => {
    try {
      const userDoc = await firestore().collection('users').doc(userId).get();

      if (!userDoc.exists) {
        return rejectWithValue('User profile not found');
      }

      return userDoc.data() as UserProfile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (
    {userId, profileData}: {userId: string; profileData: Partial<UserProfile>},
    {rejectWithValue},
  ) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .update({
          ...profileData,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      // Calculate BMI if height and weight are provided
      if (profileData.height && profileData.weight) {
        const heightInMeters = profileData.height / 100;
        const bmi = profileData.weight / (heightInMeters * heightInMeters);

        await firestore()
          .collection('users')
          .doc(userId)
          .update({
            'metrics.bmi': parseFloat(bmi.toFixed(2)),
          });

        profileData.metrics = {
          ...profileData.metrics,
          bmi: parseFloat(bmi.toFixed(2)),
        };
      }

      return profileData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const uploadProfilePhoto = createAsyncThunk(
  'user/uploadProfilePhoto',
  async ({userId, uri}: {userId: string; uri: string}, {rejectWithValue}) => {
    try {
      const reference = storage().ref(`profile_photos/${userId}`);
      await reference.putFile(uri);
      const url = await reference.getDownloadURL();

      await firestore().collection('users').doc(userId).update({
        photoURL: url,
      });

      return url;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserProfile(state) {
      state.profile = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.photoURL = action.payload;
        }
      });
  },
});

export const {clearUserProfile} = userSlice.actions;
export default userSlice.reducer;
