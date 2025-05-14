import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../theme/ThemeProvider';
import {RootState} from '../../store';
import Button from '../../components/Button';

// Mock food data
const mockFoodData = {
  id: '123',
  name: 'Grilled Chicken Breast',
  image: 'https://via.placeholder.com/400',
  calories: 165,
  protein: 31,
  carbs: 0,
  fat: 3.6,
  servingSize: '100g',
  servings: 1,
  mealType: 'lunch',
  description:
    'Lean protein source, excellent for muscle building and weight management.',
  ingredients: [
    'Chicken breast',
    'Olive oil',
    'Salt',
    'Pepper',
    'Garlic powder',
  ],
  nutritionFacts: {
    calories: 165,
    totalFat: 3.6,
    saturatedFat: 1.1,
    transFat: 0,
    cholesterol: 85,
    sodium: 74,
    totalCarbs: 0,
    dietaryFiber: 0,
    sugars: 0,
    protein: 31,
    vitaminD: 0,
    calcium: 0,
    iron: 1,
    potassium: 256,
  },
};

type NutritionItemProps = {
  label: string;
  value: number | string;
  unit?: string;
  isMainNutrient?: boolean;
  isDailyValue?: boolean;
};

const NutritionItem = ({
  label,
  value,
  unit = 'g',
  isMainNutrient = false,
  isDailyValue = false,
}: NutritionItemProps) => {
  const {theme} = useTheme();

  return (
    <View
      style={[styles.nutritionItem, isMainNutrient && styles.mainNutrientItem]}>
      <Text
        style={[
          styles.nutritionLabel,
          {
            color: theme.colors.text.primary,
            fontWeight: isMainNutrient ? 'bold' : 'normal',
          },
        ]}>
        {label}
      </Text>
      <Text style={[styles.nutritionValue, {color: theme.colors.text.primary}]}>
        {typeof value === 'number'
          ? `${value}${unit}${isDailyValue ? ' DV' : ''}`
          : value}
      </Text>
    </View>
  );
};

const FoodDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [food, setFood] = useState(mockFoodData);

  // If this was connected to real data, we would get these from route params
  // const { foodId, mealEntryId } = route.params;

  // In a real app, we'd fetch food details based on foodId
  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleUpdateServings = (newServings: number) => {
    if (newServings >= 0.5 && newServings <= 10) {
      setFood(prev => ({...prev, servings: newServings}));
    }
  };

  const handleUpdateMealType = (mealType: string) => {
    setFood(prev => ({...prev, mealType}));
  };

  const handleSaveChanges = () => {
    // In a real app, this would dispatch an action to update the meal entry
    navigation.goBack();
  };

  const handleDeleteFood = () => {
    // In a real app, this would dispatch an action to delete the meal entry
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  // Calculate totals based on current servings
  const getTotalNutrient = (value: number) => {
    return Math.round(value * food.servings * 10) / 10;
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={{fontSize: 24, color: theme.colors.text.primary}}>
            ←
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text.primary}]}>
          Food Details
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Food Image */}
        <Image
          source={{uri: food.image}}
          style={styles.foodImage}
          resizeMode="cover"
        />

        {/* Food Name and Serving Controls */}
        <View style={styles.foodNameContainer}>
          <Text style={[styles.foodName, {color: theme.colors.text.primary}]}>
            {food.name}
          </Text>
          <Text
            style={[styles.servingSize, {color: theme.colors.text.secondary}]}>
            {food.servingSize} per serving
          </Text>

          <View style={styles.servingControls}>
            <TouchableOpacity
              style={[
                styles.servingButton,
                {backgroundColor: theme.colors.background.secondary},
              ]}
              onPress={() => handleUpdateServings(food.servings - 0.5)}>
              <Text style={{fontSize: 18, color: theme.colors.text.primary}}>
                -
              </Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.servingsValue,
                {color: theme.colors.text.primary},
              ]}>
              {food.servings} {food.servings === 1 ? 'serving' : 'servings'}
            </Text>
            <TouchableOpacity
              style={[
                styles.servingButton,
                {backgroundColor: theme.colors.background.secondary},
              ]}
              onPress={() => handleUpdateServings(food.servings + 0.5)}>
              <Text style={{fontSize: 18, color: theme.colors.text.primary}}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meal Type Selection */}
        <View
          style={[
            styles.mealTypeContainer,
            {backgroundColor: theme.colors.background.secondary},
          ]}>
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
            Meal Type
          </Text>
          <View style={styles.mealTypeOptions}>
            {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mealTypeOption,
                  {
                    backgroundColor:
                      food.mealType === type
                        ? theme.colors.primary
                        : theme.colors.background.tertiary,
                  },
                ]}
                onPress={() => handleUpdateMealType(type)}>
                <Text
                  style={[
                    styles.mealTypeText,
                    {
                      color:
                        food.mealType === type
                          ? '#FFFFFF'
                          : theme.colors.text.secondary,
                    },
                  ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Macro Nutrients */}
        <View
          style={[
            styles.macroContainer,
            {backgroundColor: theme.colors.background.secondary},
          ]}>
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
            Nutrition Summary
          </Text>
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text
                style={[styles.macroValue, {color: theme.colors.text.primary}]}>
                {getTotalNutrient(food.calories)}
              </Text>
              <Text
                style={[
                  styles.macroLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Calories
              </Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, {color: theme.colors.primary}]}>
                {getTotalNutrient(food.protein)}g
              </Text>
              <Text
                style={[
                  styles.macroLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Protein
              </Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, {color: theme.colors.warning}]}>
                {getTotalNutrient(food.carbs)}g
              </Text>
              <Text
                style={[
                  styles.macroLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Carbs
              </Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, {color: theme.colors.error}]}>
                {getTotalNutrient(food.fat)}g
              </Text>
              <Text
                style={[
                  styles.macroLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Fat
              </Text>
            </View>
          </View>
        </View>

        {/* Nutrition Facts */}
        <View
          style={[
            styles.nutritionFactsContainer,
            {backgroundColor: theme.colors.background.secondary},
          ]}>
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
            Nutrition Facts
          </Text>
          <Text
            style={[
              styles.servingHeader,
              {color: theme.colors.text.secondary},
            ]}>
            Serving Size {food.servingSize}
          </Text>
          <View
            style={[styles.divider, {backgroundColor: theme.colors.border}]}
          />

          <NutritionItem
            label="Calories"
            value={getTotalNutrient(food.nutritionFacts.calories)}
            unit=""
            isMainNutrient
          />

          <View
            style={[styles.divider, {backgroundColor: theme.colors.border}]}
          />

          <NutritionItem
            label="Total Fat"
            value={getTotalNutrient(food.nutritionFacts.totalFat)}
            isMainNutrient
          />
          <NutritionItem
            label="Saturated Fat"
            value={getTotalNutrient(food.nutritionFacts.saturatedFat)}
          />
          <NutritionItem
            label="Trans Fat"
            value={getTotalNutrient(food.nutritionFacts.transFat)}
          />
          <NutritionItem
            label="Cholesterol"
            value={getTotalNutrient(food.nutritionFacts.cholesterol)}
            unit="mg"
          />
          <NutritionItem
            label="Sodium"
            value={getTotalNutrient(food.nutritionFacts.sodium)}
            unit="mg"
          />
          <NutritionItem
            label="Total Carbohydrates"
            value={getTotalNutrient(food.nutritionFacts.totalCarbs)}
            isMainNutrient
          />
          <NutritionItem
            label="Dietary Fiber"
            value={getTotalNutrient(food.nutritionFacts.dietaryFiber)}
          />
          <NutritionItem
            label="Sugars"
            value={getTotalNutrient(food.nutritionFacts.sugars)}
          />
          <NutritionItem
            label="Protein"
            value={getTotalNutrient(food.nutritionFacts.protein)}
            isMainNutrient
          />

          <View
            style={[styles.divider, {backgroundColor: theme.colors.border}]}
          />

          <NutritionItem
            label="Vitamin D"
            value={getTotalNutrient(food.nutritionFacts.vitaminD)}
            unit="%"
            isDailyValue
          />
          <NutritionItem
            label="Calcium"
            value={getTotalNutrient(food.nutritionFacts.calcium)}
            unit="%"
            isDailyValue
          />
          <NutritionItem
            label="Iron"
            value={getTotalNutrient(food.nutritionFacts.iron)}
            unit="%"
            isDailyValue
          />
          <NutritionItem
            label="Potassium"
            value={getTotalNutrient(food.nutritionFacts.potassium)}
            unit="mg"
          />
        </View>

        {/* Ingredients */}
        {food.ingredients && food.ingredients.length > 0 && (
          <View
            style={[
              styles.ingredientsContainer,
              {backgroundColor: theme.colors.background.secondary},
            ]}>
            <Text
              style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
              Ingredients
            </Text>
            <Text
              style={[
                styles.ingredientsText,
                {color: theme.colors.text.secondary},
              ]}>
              {food.ingredients.join(', ')}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Save Changes"
            onPress={handleSaveChanges}
            size="large"
            style={{flex: 1, marginRight: 8}}
          />
          <TouchableOpacity
            style={[
              styles.deleteButton,
              {backgroundColor: `${theme.colors.error}20`},
            ]}
            onPress={handleDeleteFood}>
            <Text style={{color: theme.colors.error}}>Delete</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
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
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  foodImage: {
    width: '100%',
    height: 200,
  },
  foodNameContainer: {
    padding: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  servingSize: {
    fontSize: 14,
    marginBottom: 16,
  },
  servingControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingsValue: {
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  mealTypeContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  mealTypeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mealTypeOption: {
    width: '48%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  macroContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 14,
  },
  nutritionFactsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  servingHeader: {
    fontSize: 14,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  mainNutrientItem: {
    paddingVertical: 8,
  },
  nutritionLabel: {
    fontSize: 14,
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  ingredientsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  ingredientsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  deleteButton: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});

export default FoodDetailScreen;
