import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../../theme/ThemeProvider';
import {RootState} from '../../store';
import Button from '../../components/Button';

type MealPlan = {
  id: string;
  name: string;
  description: string;
  days: MealPlanDay[];
  createdAt: string;
  isTemplate: boolean;
};

type MealPlanDay = {
  id: string;
  name: string;
  meals: Meal[];
  totalCalories: number;
};

type Meal = {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: MealFood[];
};

type MealFood = {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

// Mock data for meal plans
const mockMealPlans: MealPlan[] = [
  {
    id: '1',
    name: 'Weight Loss Plan',
    description: 'A balanced plan for healthy weight loss',
    isTemplate: true,
    createdAt: '2023-01-15',
    days: [
      {
        id: 'd1',
        name: 'Day 1',
        totalCalories: 1800,
        meals: [
          {
            id: 'm1',
            type: 'breakfast',
            foods: [
              {
                id: 'f1',
                name: 'Oatmeal with Berries',
                portion: '1 cup',
                calories: 300,
                protein: 10,
                carbs: 50,
                fat: 5,
              },
              {
                id: 'f2',
                name: 'Greek Yogurt',
                portion: '1/2 cup',
                calories: 100,
                protein: 15,
                carbs: 5,
                fat: 0,
              },
            ],
          },
          {
            id: 'm2',
            type: 'lunch',
            foods: [
              {
                id: 'f3',
                name: 'Grilled Chicken Salad',
                portion: '1 bowl',
                calories: 450,
                protein: 35,
                carbs: 20,
                fat: 15,
              },
            ],
          },
          {
            id: 'm3',
            type: 'dinner',
            foods: [
              {
                id: 'f4',
                name: 'Salmon with Vegetables',
                portion: '6 oz',
                calories: 500,
                protein: 40,
                carbs: 15,
                fat: 20,
              },
              {
                id: 'f5',
                name: 'Brown Rice',
                portion: '1/2 cup',
                calories: 150,
                protein: 3,
                carbs: 30,
                fat: 1,
              },
            ],
          },
          {
            id: 'm4',
            type: 'snack',
            foods: [
              {
                id: 'f6',
                name: 'Apple with Almond Butter',
                portion: '1 medium',
                calories: 300,
                protein: 8,
                carbs: 25,
                fat: 15,
              },
            ],
          },
        ],
      },
      // Additional days would be added here
    ],
  },
  {
    id: '2',
    name: 'Muscle Building',
    description: 'High protein plan for muscle gain',
    isTemplate: true,
    createdAt: '2023-02-20',
    days: [
      {
        id: 'd1',
        name: 'Day 1',
        totalCalories: 2800,
        meals: [
          {
            id: 'm1',
            type: 'breakfast',
            foods: [
              {
                id: 'f1',
                name: 'Protein Pancakes',
                portion: '3 pancakes',
                calories: 450,
                protein: 30,
                carbs: 45,
                fat: 10,
              },
            ],
          },
          // More meals would be added here
        ],
      },
    ],
  },
];

const MealPlanScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'myPlans'>(
    'templates',
  );

  // In a real app, you would fetch this from Redux/API
  const mealPlans = mockMealPlans;
  const myPlans = mealPlans.filter(plan => !plan.isTemplate);
  const templates = mealPlans.filter(plan => plan.isTemplate);

  const plansToShow = activeTab === 'templates' ? templates : myPlans;

  const handleSelectPlan = (id: string) => {
    setSelectedTemplate(id === selectedTemplate ? null : id);
  };

  const handleCreateFromTemplate = () => {
    if (selectedTemplate) {
      // In a real app, this would create a new plan based on the template
      // For now, we'll just navigate back to nutrition
      navigation.goBack();
    }
  };

  const handleCreateNew = () => {
    // In a real app, this would navigate to a create meal plan screen
    // For now, we'll just navigate back to nutrition
    navigation.goBack();
  };

  const handleViewPlan = (planId: string) => {
    // In a real app, this would navigate to a meal plan detail screen
    // For now, we'll just navigate back to nutrition
    navigation.goBack();
  };

  const renderMealPlanItem = ({item}: {item: MealPlan}) => {
    const isSelected = item.id === selectedTemplate;
    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: isSelected ? theme.colors.primary : 'transparent',
            borderWidth: isSelected ? 2 : 0,
          },
        ]}
        onPress={() => handleSelectPlan(item.id)}>
        <View style={styles.planHeader}>
          <Text style={[styles.planName, {color: theme.colors.text.primary}]}>
            {item.name}
          </Text>
          {activeTab === 'myPlans' && (
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => handleViewPlan(item.id)}>
              <Text style={{color: theme.colors.primary}}>View</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text
          style={[
            styles.planDescription,
            {color: theme.colors.text.secondary},
          ]}>
          {item.description}
        </Text>
        <View style={styles.planStats}>
          <View style={styles.statItem}>
            <Text
              style={[styles.statValue, {color: theme.colors.text.primary}]}>
              {item.days.length}
            </Text>
            <Text
              style={[styles.statLabel, {color: theme.colors.text.tertiary}]}>
              Days
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              style={[styles.statValue, {color: theme.colors.text.primary}]}>
              {item.days[0]?.totalCalories || 0}
            </Text>
            <Text
              style={[styles.statLabel, {color: theme.colors.text.tertiary}]}>
              Calories/Day
            </Text>
          </View>
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
          <Icon name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text.primary}]}>
          Meal Plans
        </Text>
        <View style={styles.rightHeaderPlaceholder} />
      </View>

      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'templates' && {
              borderBottomColor: theme.colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab('templates')}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'templates'
                    ? theme.colors.primary
                    : theme.colors.text.secondary,
              },
            ]}>
            Templates
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'myPlans' && {
              borderBottomColor: theme.colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab('myPlans')}>
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'myPlans'
                    ? theme.colors.primary
                    : theme.colors.text.secondary,
              },
            ]}>
            My Plans
          </Text>
        </TouchableOpacity>
      </View>

      {plansToShow.length > 0 ? (
        <FlatList
          data={plansToShow}
          renderItem={renderMealPlanItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon
            name="nutrition-outline"
            size={60}
            color={theme.colors.text.tertiary}
          />
          <Text style={[styles.emptyTitle, {color: theme.colors.text.primary}]}>
            {activeTab === 'templates'
              ? 'No Templates Available'
              : 'No Meal Plans Yet'}
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              {color: theme.colors.text.secondary},
            ]}>
            {activeTab === 'templates'
              ? 'Check back later for meal plan templates'
              : 'Create a meal plan to get started'}
          </Text>
        </View>
      )}

      {/* Bottom Action Area */}
      <View
        style={[
          styles.actionArea,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        {activeTab === 'templates' ? (
          <Button
            title="Create From Template"
            disabled={!selectedTemplate}
            onPress={handleCreateFromTemplate}
            size="large"
            fullWidth
          />
        ) : (
          <Button
            title="Create New Meal Plan"
            icon="add-circle"
            onPress={handleCreateNew}
            size="large"
            fullWidth
          />
        )}
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
  rightHeaderPlaceholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  planCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  moreButton: {
    padding: 5,
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  planStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  actionArea: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
});

export default MealPlanScreen;
