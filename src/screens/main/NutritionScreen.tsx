import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {ProgressCircle} from 'react-native-svg-charts';

import {
  fetchFoodItems,
  fetchMealEntriesByDate,
  fetchWaterEntriesByDate,
  fetchNutritionGoals,
} from '../../store/slices/nutritionSlice';
import {RootState} from '../../store';
import Card from '../../components/Card';
import Button from '../../components/Button';
import {useTheme} from '../../theme/ThemeProvider';

const MealCard = ({meal, onPress, theme}) => {
  const getTotalCalories = () => {
    return Math.round(meal.foodItem.calories * meal.servings);
  };

  const getMealTypeIcon = () => {
    switch (meal.mealType) {
      case 'breakfast':
        return 'sunny-outline';
      case 'lunch':
        return 'restaurant-outline';
      case 'dinner':
        return 'moon-outline';
      case 'snack':
        return 'cafe-outline';
      default:
        return 'nutrition-outline';
    }
  };

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Card style={styles.mealCard} onPress={onPress} variant="elevation">
      <View style={styles.mealCardContent}>
        <View
          style={[
            styles.mealIconContainer,
            {backgroundColor: `${theme.colors.primary}15`},
          ]}>
          <Icon
            name={getMealTypeIcon()}
            size={24}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.mealInfo}>
          <Text
            style={[
              styles.mealName,
              {color: theme.colors.text.primary, fontWeight: '600'},
            ]}>
            {meal.foodItem.name}
          </Text>
          <Text
            style={[
              styles.mealType,
              {color: theme.colors.text.secondary, fontSize: 14},
            ]}>
            {capitalizeFirstLetter(meal.mealType)} •{' '}
            {meal.servings > 1 ? `${meal.servings} servings` : '1 serving'}
          </Text>
        </View>
        <View style={styles.mealCalories}>
          <Text
            style={[
              styles.caloriesText,
              {color: theme.colors.text.primary, fontWeight: 'bold'},
            ]}>
            {getTotalCalories()}
          </Text>
          <Text
            style={[
              styles.caloriesLabel,
              {color: theme.colors.text.tertiary, fontSize: 12},
            ]}>
            kcal
          </Text>
        </View>
      </View>

      <View style={styles.macrosContainer}>
        <View style={styles.macroItem}>
          <Text
            style={[
              styles.macroValue,
              {color: theme.colors.text.primary, fontWeight: '500'},
            ]}>
            {Math.round(meal.foodItem.protein * meal.servings)}g
          </Text>
          <Text
            style={[
              styles.macroLabel,
              {color: theme.colors.text.tertiary, fontSize: 12},
            ]}>
            Protein
          </Text>
        </View>
        <View style={styles.macroItem}>
          <Text
            style={[
              styles.macroValue,
              {color: theme.colors.text.primary, fontWeight: '500'},
            ]}>
            {Math.round(meal.foodItem.carbs * meal.servings)}g
          </Text>
          <Text
            style={[
              styles.macroLabel,
              {color: theme.colors.text.tertiary, fontSize: 12},
            ]}>
            Carbs
          </Text>
        </View>
        <View style={styles.macroItem}>
          <Text
            style={[
              styles.macroValue,
              {color: theme.colors.text.primary, fontWeight: '500'},
            ]}>
            {Math.round(meal.foodItem.fats * meal.servings)}g
          </Text>
          <Text
            style={[
              styles.macroLabel,
              {color: theme.colors.text.tertiary, fontSize: 12},
            ]}>
            Fats
          </Text>
        </View>
      </View>
    </Card>
  );
};

const MacroProgressCircle = ({value, goal, color, title, theme}) => {
  // Ensure value isn't greater than goal for display purposes
  const displayValue = Math.min(value, goal);
  const percentage = goal > 0 ? displayValue / goal : 0;

  return (
    <View style={styles.macroCircle}>
      <ProgressCircle
        style={styles.progressCircle}
        progress={percentage}
        progressColor={color}
        backgroundColor={theme.colors.progressBar.track}
        strokeWidth={8}
      />
      <View style={styles.macroCircleContent}>
        <Text
          style={[
            styles.macroCircleValue,
            {color: theme.colors.text.primary, fontWeight: 'bold'},
          ]}>
          {Math.round(value)}g
        </Text>
        <Text
          style={[
            styles.macroCircleGoal,
            {color: theme.colors.text.tertiary, fontSize: 10},
          ]}>
          / {goal}g
        </Text>
      </View>
      <Text
        style={[
          styles.macroCircleTitle,
          {color: theme.colors.text.secondary, fontSize: 14, marginTop: 8},
        ]}>
        {title}
      </Text>
    </View>
  );
};

const WaterTracker = ({value, goal, theme, onPress}) => {
  // Calculate percentage with cap at 100%
  const percentage = Math.min((value / goal) * 100, 100);
  // Calculate number of complete glasses (each glass = 250ml)
  const glassSize = 250; // ml
  const totalGlasses = Math.ceil(goal / glassSize);
  const completedGlasses = Math.floor(value / glassSize);

  return (
    <Card style={styles.waterCard} onPress={onPress} variant="elevation">
      <View style={styles.waterHeader}>
        <View style={styles.waterTitleContainer}>
          <Icon name="water" size={20} color={theme.colors.info} />
          <Text
            style={[
              styles.waterTitle,
              {
                color: theme.colors.text.primary,
                marginLeft: 8,
                fontWeight: '600',
              },
            ]}>
            Water Intake
          </Text>
        </View>
        <Text
          style={[
            styles.waterValue,
            {color: theme.colors.text.primary, fontWeight: 'bold'},
          ]}>
          {Math.round(value / 1000)}L / {goal / 1000}L
        </Text>
      </View>

      <View style={styles.waterProgressContainer}>
        <View
          style={[
            styles.waterProgressBg,
            {backgroundColor: `${theme.colors.info}30`},
          ]}>
          <View
            style={[
              styles.waterProgress,
              {
                width: `${percentage}%`,
                backgroundColor: theme.colors.info,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.glassesContainer}>
        {Array(totalGlasses)
          .fill(0)
          .map((_, index) => (
            <Icon
              key={index}
              name={index < completedGlasses ? 'water' : 'water-outline'}
              size={20}
              color={
                index < completedGlasses
                  ? theme.colors.info
                  : theme.colors.text.tertiary
              }
              style={styles.glassIcon}
            />
          ))}
      </View>

      <TouchableOpacity
        style={[
          styles.addWaterButton,
          {backgroundColor: `${theme.colors.info}15`},
        ]}
        onPress={onPress}>
        <Text
          style={[
            styles.addWaterText,
            {color: theme.colors.info, fontWeight: '500'},
          ]}>
          Add Water
        </Text>
      </TouchableOpacity>
    </Card>
  );
};

const NutritionScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {user} = useSelector((state: RootState) => state.auth);
  const {mealEntries, dailyNutrition, nutritionGoals, isLoading} = useSelector(
    (state: RootState) => state.nutrition,
  );

  const [refreshing, setRefreshing] = useState(false);
  const [today] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    if (user?.uid) {
      dispatch(fetchMealEntriesByDate({userId: user.uid, date: today}) as any);
      dispatch(fetchWaterEntriesByDate({userId: user.uid, date: today}) as any);
      dispatch(fetchNutritionGoals(user.uid) as any);
      dispatch(fetchFoodItems() as any);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  // Group meals by meal type
  const getMealsByType = () => {
    const mealsByType = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };

    mealEntries.forEach(meal => {
      if (mealsByType[meal.mealType]) {
        mealsByType[meal.mealType].push(meal);
      }
    });

    return mealsByType;
  };

  // Default nutrition goals if not set
  const getDefaultGoals = () => {
    return {
      caloriesGoal: 2000,
      proteinGoal: 150,
      carbsGoal: 200,
      fatsGoal: 65,
      waterGoal: 2500,
    };
  };

  const goals = nutritionGoals || getDefaultGoals();
  const mealsByType = getMealsByType();

  // Calculate remaining calories
  const caloriesConsumed = dailyNutrition?.totalCalories || 0;
  const caloriesRemaining = goals.caloriesGoal - caloriesConsumed;
  const caloriesPercentage = Math.min(
    (caloriesConsumed / goals.caloriesGoal) * 100,
    100,
  );

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
            Nutrition
          </Text>
          <Text
            style={[
              styles.dateText,
              {color: theme.colors.text.secondary, fontSize: 16},
            ]}>
            Today,{' '}
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: theme.colors.primary}]}
          onPress={() => navigation.navigate('AddMeal' as never)}>
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}>
        {/* Calories Summary Card */}
        <Card style={styles.caloriesCard} variant="elevation">
          <View style={styles.caloriesHeader}>
            <Text
              style={[
                styles.caloriesTitle,
                {color: theme.colors.text.primary, fontWeight: '600'},
              ]}>
              Calories
            </Text>
            <Text
              style={[
                styles.caloriesGoal,
                {color: theme.colors.text.tertiary},
              ]}>
              Goal: {goals.caloriesGoal} kcal
            </Text>
          </View>

          <View style={styles.caloriesContent}>
            <View style={styles.caloriesInfo}>
              <Text
                style={[
                  styles.caloriesConsumed,
                  {color: theme.colors.text.primary, fontWeight: 'bold'},
                ]}>
                {Math.round(caloriesConsumed)}
              </Text>
              <Text
                style={[
                  styles.caloriesLabel,
                  {color: theme.colors.text.tertiary},
                ]}>
                consumed
              </Text>
              <View
                style={[
                  styles.caloriesRemaining,
                  {
                    backgroundColor: `${theme.colors.primary}15`,
                    marginTop: 16,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 16,
                  },
                ]}>
                <Text
                  style={[
                    styles.caloriesRemainingText,
                    {color: theme.colors.primary, fontWeight: '500'},
                  ]}>
                  {caloriesRemaining > 0
                    ? `${Math.round(caloriesRemaining)} kcal remaining`
                    : 'Daily goal reached'}
                </Text>
              </View>
            </View>
            <View style={styles.caloriesProgress}>
              <ProgressCircle
                style={styles.caloriesCircle}
                progress={caloriesPercentage / 100}
                progressColor={theme.colors.primary}
                backgroundColor={theme.colors.progressBar.track}
                strokeWidth={10}
              />
              <View style={styles.caloriesPercentContainer}>
                <Text
                  style={[
                    styles.caloriesPercent,
                    {color: theme.colors.text.primary, fontWeight: 'bold'},
                  ]}>
                  {Math.round(caloriesPercentage)}%
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Macros Tracking */}
        <View style={styles.macrosSection}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text.primary,
                fontWeight: '600',
                marginBottom: 16,
              },
            ]}>
            Macronutrients
          </Text>
          <View style={styles.macrosRow}>
            <MacroProgressCircle
              value={dailyNutrition?.totalProtein || 0}
              goal={goals.proteinGoal}
              color="#FF9500"
              title="Protein"
              theme={theme}
            />
            <MacroProgressCircle
              value={dailyNutrition?.totalCarbs || 0}
              goal={goals.carbsGoal}
              color="#30D158"
              title="Carbs"
              theme={theme}
            />
            <MacroProgressCircle
              value={dailyNutrition?.totalFats || 0}
              goal={goals.fatsGoal}
              color="#FF453A"
              title="Fats"
              theme={theme}
            />
          </View>
        </View>

        {/* Water Tracker */}
        <WaterTracker
          value={dailyNutrition?.water || 0}
          goal={goals.waterGoal}
          theme={theme}
          onPress={() => navigation.navigate('WaterTracker' as never)}
        />

        {/* Meals Section */}
        {Object.entries(mealsByType).map(([mealType, meals]) => {
          if (meals.length === 0) return null;
          return (
            <View key={mealType} style={styles.mealSection}>
              <Text
                style={[
                  styles.sectionTitle,
                  {color: theme.colors.text.primary, fontWeight: '600'},
                ]}>
                {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
              </Text>
              {meals.map(meal => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  theme={theme}
                  onPress={() =>
                    navigation.navigate('FoodDetail', {
                      foodId: meal.foodItem.id,
                      mealEntryId: meal.id,
                    } as never)
                  }
                />
              ))}
            </View>
          );
        })}

        {mealEntries.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>🍽️</Text>
            </View>
            <Text
              style={[
                styles.emptyTitle,
                {color: theme.colors.text.primary, fontWeight: 'bold'},
              ]}>
              No meals added yet
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                {color: theme.colors.text.secondary, textAlign: 'center'},
              ]}>
              Track your nutrition by adding your meals and water intake
            </Text>
            <Button
              title="Add First Meal"
              onPress={() => navigation.navigate('AddMeal' as never)}
              style={{marginTop: 24}}
            />
          </View>
        )}

        {/* Bottom padding */}
        <View style={{height: 100}} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  screenTitle: {
    marginBottom: 4,
  },
  dateText: {
    marginBottom: 8,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    marginTop: 16,
  },
  caloriesCard: {
    marginBottom: 16,
    padding: 16,
  },
  caloriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  caloriesTitle: {
    fontSize: 18,
  },
  caloriesGoal: {
    fontSize: 14,
  },
  caloriesContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriesInfo: {
    flex: 1,
    paddingRight: 16,
  },
  caloriesConsumed: {
    fontSize: 28,
  },
  caloriesLabel: {
    fontSize: 14,
  },
  caloriesRemaining: {
    alignSelf: 'flex-start',
  },
  caloriesRemainingText: {
    fontSize: 14,
  },
  caloriesProgress: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caloriesCircle: {
    height: 100,
    width: 100,
  },
  caloriesPercentContainer: {
    position: 'absolute',
  },
  caloriesPercent: {
    fontSize: 18,
  },
  macrosSection: {
    marginBottom: 16,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroCircle: {
    alignItems: 'center',
    width: '30%',
  },
  progressCircle: {
    height: 80,
    width: 80,
  },
  macroCircleContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 28,
  },
  macroCircleValue: {
    fontSize: 14,
  },
  macroCircleGoal: {
    fontSize: 10,
  },
  macroCircleTitle: {
    marginTop: 4,
  },
  waterCard: {
    marginBottom: 16,
    padding: 16,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  waterTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterTitle: {
    fontSize: 16,
  },
  waterValue: {
    fontSize: 14,
  },
  waterProgressContainer: {
    marginVertical: 12,
  },
  waterProgressBg: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  waterProgress: {
    height: '100%',
    borderRadius: 6,
  },
  glassesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  glassIcon: {
    marginRight: 8,
    marginBottom: 8,
  },
  addWaterButton: {
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  addWaterText: {
    fontSize: 14,
  },
  mealSection: {
    marginBottom: 8,
  },
  mealCard: {
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
  },
  mealCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  mealIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    marginBottom: 4,
  },
  mealType: {
    fontSize: 14,
  },
  mealCalories: {
    alignItems: 'flex-end',
  },
  caloriesText: {
    fontSize: 18,
  },
  caloriesLabel: {
    fontSize: 12,
  },
  macrosContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 14,
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: 12,
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
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
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

export default NutritionScreen;
