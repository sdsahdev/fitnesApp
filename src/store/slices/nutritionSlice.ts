import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: number; // in grams
  servingUnit: string;
  category: string;
  imageURL?: string;
}

interface MealEntry {
  id: string;
  userId: string;
  foodItem: FoodItem;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servings: number;
  createdAt: string;
}

interface WaterEntry {
  id: string;
  userId: string;
  amount: number; // in ml
  date: string;
  createdAt: string;
}

interface NutritionGoals {
  caloriesGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatsGoal: number;
  waterGoal: number; // in ml
}

interface DailyNutrition {
  date: string;
  meals: MealEntry[];
  water: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

interface NutritionState {
  foodItems: FoodItem[];
  mealEntries: MealEntry[];
  waterEntries: WaterEntry[];
  nutritionGoals: NutritionGoals | null;
  dailyNutrition: DailyNutrition | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: NutritionState = {
  foodItems: [],
  mealEntries: [],
  waterEntries: [],
  nutritionGoals: null,
  dailyNutrition: null,
  isLoading: false,
  error: null,
};

export const fetchFoodItems = createAsyncThunk(
  'nutrition/fetchFoodItems',
  async (_, {rejectWithValue}) => {
    try {
      const foodItemsSnapshot = await firestore()
        .collection('foodItems')
        .limit(100)
        .get();

      const foodItems = foodItemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FoodItem[];

      return foodItems;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchMealEntriesByDate = createAsyncThunk(
  'nutrition/fetchMealEntriesByDate',
  async ({userId, date}: {userId: string; date: string}, {rejectWithValue}) => {
    try {
      const mealEntriesSnapshot = await firestore()
        .collection('mealEntries')
        .where('userId', '==', userId)
        .where('date', '==', date)
        .orderBy('createdAt', 'asc')
        .get();

      const mealEntries = mealEntriesSnapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firebase Timestamp to ISO string if it exists
        const createdAt =
          data.createdAt && typeof data.createdAt.toDate === 'function'
            ? data.createdAt.toDate().toISOString()
            : new Date().toISOString();

        return {
          id: doc.id,
          ...data,
          createdAt, // Use the serialized timestamp
        };
      }) as MealEntry[];

      return mealEntries;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchWaterEntriesByDate = createAsyncThunk(
  'nutrition/fetchWaterEntriesByDate',
  async ({userId, date}: {userId: string; date: string}, {rejectWithValue}) => {
    try {
      const waterEntriesSnapshot = await firestore()
        .collection('waterEntries')
        .where('userId', '==', userId)
        .where('date', '==', date)
        .orderBy('createdAt', 'asc')
        .get();

      const waterEntries = waterEntriesSnapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firebase Timestamp to ISO string if it exists
        const createdAt =
          data.createdAt && typeof data.createdAt.toDate === 'function'
            ? data.createdAt.toDate().toISOString()
            : new Date().toISOString();

        return {
          id: doc.id,
          ...data,
          createdAt, // Use the serialized timestamp
        };
      }) as WaterEntry[];

      return waterEntries;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchNutritionGoals = createAsyncThunk(
  'nutrition/fetchNutritionGoals',
  async (userId: string, {rejectWithValue}) => {
    try {
      const goalsDoc = await firestore()
        .collection('nutritionGoals')
        .doc(userId)
        .get();

      if (!goalsDoc.exists) {
        return rejectWithValue('Nutrition goals not found');
      }

      return goalsDoc.data() as NutritionGoals;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const addMealEntry = createAsyncThunk(
  'nutrition/addMealEntry',
  async (
    {
      userId,
      foodItemId,
      date,
      mealType,
      servings,
    }: {
      userId: string;
      foodItemId: string;
      date: string;
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      servings: number;
    },
    {rejectWithValue, getState},
  ) => {
    try {
      const state = getState() as {nutrition: NutritionState};
      const foodItem = state.nutrition.foodItems.find(
        item => item.id === foodItemId,
      );

      if (!foodItem) {
        return rejectWithValue('Food item not found');
      }

      const mealEntryRef = firestore().collection('mealEntries').doc();

      // Use Firebase timestamp for database storage
      const mealEntryForDb = {
        userId,
        foodItem,
        date,
        mealType,
        servings,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await mealEntryRef.set(mealEntryForDb);

      // Return with serializable timestamp for Redux
      return {
        id: mealEntryRef.id,
        userId,
        foodItem,
        date,
        mealType,
        servings,
        createdAt: new Date().toISOString(), // Use ISO string format
      } as MealEntry;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const addWaterEntry = createAsyncThunk(
  'nutrition/addWaterEntry',
  async (
    {userId, amount, date}: {userId: string; amount: number; date: string},
    {rejectWithValue},
  ) => {
    try {
      const waterEntryRef = firestore().collection('waterEntries').doc();

      // Use Firebase timestamp for the database
      const waterEntryForDb = {
        userId,
        amount,
        date,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await waterEntryRef.set(waterEntryForDb);

      // Return with a serializable timestamp instead of Firebase timestamp
      return {
        id: waterEntryRef.id,
        userId,
        amount,
        date,
        createdAt: new Date().toISOString(), // Use ISO string format instead of Firebase timestamp
      } as WaterEntry;
    } catch (error: any) {
      console.log('====> error of add water', error);

      return rejectWithValue(error.message);
    }
  },
);

export const updateNutritionGoals = createAsyncThunk(
  'nutrition/updateNutritionGoals',
  async (
    {userId, goals}: {userId: string; goals: NutritionGoals},
    {rejectWithValue},
  ) => {
    try {
      await firestore()
        .collection('nutritionGoals')
        .doc(userId)
        .set(goals, {merge: true});

      return goals;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Helper function to calculate daily nutrition totals
const calculateDailyNutrition = (
  meals: MealEntry[],
  date: string,
): DailyNutrition => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;

  meals.forEach(meal => {
    const {foodItem, servings} = meal;
    totalCalories += foodItem.calories * servings;
    totalProtein += foodItem.protein * servings;
    totalCarbs += foodItem.carbs * servings;
    totalFats += foodItem.fats * servings;
  });

  return {
    date,
    meals,
    water: 0, // Will be updated with water entries
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFats,
  };
};

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFoodItems.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFoodItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.foodItems = action.payload;
      })
      .addCase(fetchFoodItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMealEntriesByDate.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMealEntriesByDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mealEntries = action.payload;

        if (action.payload.length > 0) {
          const date = action.payload[0].date;
          state.dailyNutrition = calculateDailyNutrition(action.payload, date);

          // Preserve water data if it exists
          if (state.dailyNutrition && state.waterEntries.length > 0) {
            const totalWater = state.waterEntries.reduce(
              (sum, entry) => sum + entry.amount,
              0,
            );
            state.dailyNutrition.water = totalWater;
          }
        }
      })
      .addCase(fetchMealEntriesByDate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWaterEntriesByDate.fulfilled, (state, action) => {
        state.waterEntries = action.payload;

        const totalWater = action.payload.reduce(
          (sum, entry) => sum + entry.amount,
          0,
        );

        if (state.dailyNutrition) {
          state.dailyNutrition.water = totalWater;
        }
      })
      .addCase(fetchNutritionGoals.fulfilled, (state, action) => {
        state.nutritionGoals = action.payload;
      })
      .addCase(addMealEntry.fulfilled, (state, action) => {
        state.mealEntries.push(action.payload);

        if (
          state.dailyNutrition &&
          state.dailyNutrition.date === action.payload.date
        ) {
          state.dailyNutrition.meals.push(action.payload);

          // Update totals
          const {foodItem, servings} = action.payload;
          state.dailyNutrition.totalCalories += foodItem.calories * servings;
          state.dailyNutrition.totalProtein += foodItem.protein * servings;
          state.dailyNutrition.totalCarbs += foodItem.carbs * servings;
          state.dailyNutrition.totalFats += foodItem.fats * servings;
        } else {
          state.dailyNutrition = calculateDailyNutrition(
            [action.payload],
            action.payload.date,
          );
        }
      })
      .addCase(addWaterEntry.fulfilled, (state, action) => {
        state.waterEntries.push(action.payload);

        if (
          state.dailyNutrition &&
          state.dailyNutrition.date === action.payload.date
        ) {
          state.dailyNutrition.water += action.payload.amount;
        }
      })
      .addCase(updateNutritionGoals.fulfilled, (state, action) => {
        state.nutritionGoals = action.payload;
      });
  },
});

export default nutritionSlice.reducer;
