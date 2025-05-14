import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useTheme} from '../../theme/ThemeProvider';
import Button from '../../components/Button';

// Mock food data
const mockFoodItems = [
  {
    id: '1',
    name: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '100g',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '2',
    name: 'Brown Rice',
    calories: 112,
    protein: 2.6,
    carbs: 23.5,
    fat: 0.9,
    servingSize: '100g',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '3',
    name: 'Broccoli (Steamed)',
    calories: 55,
    protein: 3.7,
    carbs: 11.2,
    fat: 0.6,
    servingSize: '100g',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '4',
    name: 'Salmon Fillet',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    servingSize: '100g',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '5',
    name: 'Sweet Potato',
    calories: 86,
    protein: 1.6,
    carbs: 20.1,
    fat: 0.1,
    servingSize: '100g',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '6',
    name: 'Greek Yogurt',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    servingSize: '100g',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '7',
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    servingSize: '100g',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '8',
    name: 'Apple',
    calories: 52,
    protein: 0.3,
    carbs: 13.8,
    fat: 0.2,
    servingSize: '100g',
    image: 'https://via.placeholder.com/100',
  },
];

type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  image: string;
};

type FoodItemProps = {
  item: FoodItem;
  onPress: (item: FoodItem) => void;
};

const AddMealScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {theme} = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(
    null,
  );
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState('breakfast');
  const [isLoading, setIsLoading] = useState(false);

  // Filter food items based on search query
  const filteredFoodItems = mockFoodItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleFoodItemSelect = (item: FoodItem) => {
    setSelectedFoodItem(item);
  };

  const handleServingsChange = (value: number) => {
    if (value >= 0.5 && value <= 10) {
      setServings(value);
    }
  };

  const handleMealTypeSelect = (type: string) => {
    setMealType(type);
  };

  const handleAddMeal = () => {
    if (!selectedFoodItem) return;

    setIsLoading(true);

    // In a real app, this would dispatch an action to add meal to store/API
    setTimeout(() => {
      setIsLoading(false);
      navigation.goBack();
    }, 500);
  };

  const FoodItemCard = ({item, onPress}: FoodItemProps) => {
    const isSelected = selectedFoodItem?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.foodItemCard,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: isSelected ? theme.colors.primary : 'transparent',
            borderWidth: isSelected ? 2 : 0,
          },
        ]}
        onPress={() => onPress(item)}>
        <Image source={{uri: item.image}} style={styles.foodImage} />
        <View style={styles.foodInfo}>
          <Text style={[styles.foodName, {color: theme.colors.text.primary}]}>
            {item.name}
          </Text>
          <Text
            style={[styles.foodServing, {color: theme.colors.text.secondary}]}>
            {item.servingSize}
          </Text>
        </View>
        <View style={styles.caloriesContainer}>
          <Text
            style={[styles.caloriesValue, {color: theme.colors.text.primary}]}>
            {item.calories}
          </Text>
          <Text
            style={[styles.caloriesLabel, {color: theme.colors.text.tertiary}]}>
            kcal
          </Text>
        </View>
      </TouchableOpacity>
    );
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
          Add Meal
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
            },
          ]}
          placeholder="Search foods..."
          placeholderTextColor={theme.colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Food List */}
      <FlatList
        data={filteredFoodItems}
        renderItem={({item}) => (
          <FoodItemCard item={item} onPress={handleFoodItemSelect} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.foodList}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Panel for selected food */}
      {selectedFoodItem && (
        <View
          style={[
            styles.selectedFoodPanel,
            {backgroundColor: theme.colors.background.secondary},
          ]}>
          <View style={styles.selectedFoodInfo}>
            <Text
              style={[
                styles.selectedFoodName,
                {color: theme.colors.text.primary},
              ]}>
              {selectedFoodItem.name}
            </Text>

            {/* Servings control */}
            <View style={styles.servingsContainer}>
              <Text
                style={[
                  styles.servingsLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Servings:
              </Text>
              <View style={styles.servingsControls}>
                <TouchableOpacity
                  style={[
                    styles.servingButton,
                    {backgroundColor: theme.colors.background.tertiary},
                  ]}
                  onPress={() => handleServingsChange(servings - 0.5)}>
                  <Text style={{color: theme.colors.text.primary}}>-</Text>
                </TouchableOpacity>
                <Text
                  style={[
                    styles.servingsValue,
                    {color: theme.colors.text.primary},
                  ]}>
                  {servings}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.servingButton,
                    {backgroundColor: theme.colors.background.tertiary},
                  ]}
                  onPress={() => handleServingsChange(servings + 0.5)}>
                  <Text style={{color: theme.colors.text.primary}}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Meal type selection */}
            <View style={styles.mealTypeContainer}>
              <Text
                style={[
                  styles.mealTypeLabel,
                  {color: theme.colors.text.secondary},
                ]}>
                Meal:
              </Text>
              <View style={styles.mealTypeOptions}>
                {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.mealTypeOption,
                      {
                        backgroundColor:
                          mealType === type
                            ? theme.colors.primary
                            : theme.colors.background.tertiary,
                      },
                    ]}
                    onPress={() => handleMealTypeSelect(type)}>
                    <Text
                      style={[
                        styles.mealTypeText,
                        {
                          color:
                            mealType === type
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

            {/* Nutrition summary */}
            <View style={styles.nutritionSummary}>
              <View style={styles.nutrientItem}>
                <Text
                  style={[
                    styles.nutrientValue,
                    {color: theme.colors.text.primary},
                  ]}>
                  {Math.round(selectedFoodItem.calories * servings)}
                </Text>
                <Text
                  style={[
                    styles.nutrientLabel,
                    {color: theme.colors.text.secondary},
                  ]}>
                  Calories
                </Text>
              </View>
              <View style={styles.nutrientItem}>
                <Text
                  style={[styles.nutrientValue, {color: theme.colors.primary}]}>
                  {Math.round(selectedFoodItem.protein * servings)}g
                </Text>
                <Text
                  style={[
                    styles.nutrientLabel,
                    {color: theme.colors.text.secondary},
                  ]}>
                  Protein
                </Text>
              </View>
              <View style={styles.nutrientItem}>
                <Text
                  style={[styles.nutrientValue, {color: theme.colors.warning}]}>
                  {Math.round(selectedFoodItem.carbs * servings)}g
                </Text>
                <Text
                  style={[
                    styles.nutrientLabel,
                    {color: theme.colors.text.secondary},
                  ]}>
                  Carbs
                </Text>
              </View>
              <View style={styles.nutrientItem}>
                <Text
                  style={[styles.nutrientValue, {color: theme.colors.error}]}>
                  {Math.round(selectedFoodItem.fat * servings)}g
                </Text>
                <Text
                  style={[
                    styles.nutrientLabel,
                    {color: theme.colors.text.secondary},
                  ]}>
                  Fat
                </Text>
              </View>
            </View>

            {/* Add meal button */}
            <Button
              title={isLoading ? 'Adding...' : 'Add to Meal Plan'}
              onPress={handleAddMeal}
              disabled={isLoading}
              size="large"
              fullWidth
            />
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  foodList: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  foodItemCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  foodServing: {
    fontSize: 14,
  },
  caloriesContainer: {
    alignItems: 'flex-end',
  },
  caloriesValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  caloriesLabel: {
    fontSize: 12,
  },
  selectedFoodPanel: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 30,
  },
  selectedFoodInfo: {
    width: '100%',
  },
  selectedFoodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  servingsLabel: {
    fontSize: 16,
  },
  servingsControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servingButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servingsValue: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  mealTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  mealTypeLabel: {
    fontSize: 16,
    marginRight: 20,
  },
  mealTypeOptions: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  mealTypeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  nutritionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nutrientItem: {
    alignItems: 'center',
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nutrientLabel: {
    fontSize: 12,
  },
});

export default AddMealScreen;
