import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeProvider';
import Button from '../../components/Button';

type Goal = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
};

const goals: Goal[] = [
  {
    id: 'lose_weight',
    name: 'Lose Weight',
    description: 'Reduce body fat and get leaner',
    emoji: '⚖️',
    color: '#FF6347',
  },
  {
    id: 'build_muscle',
    name: 'Build Muscle',
    description: 'Gain strength and increase muscle mass',
    emoji: '💪',
    color: '#4682B4',
  },
  {
    id: 'increase_endurance',
    name: 'Increase Endurance',
    description: 'Improve stamina and cardiovascular health',
    emoji: '🏃',
    color: '#32CD32',
  },
  {
    id: 'improve_flexibility',
    name: 'Improve Flexibility',
    description: 'Enhance range of motion and reduce injury risk',
    emoji: '🧘',
    color: '#9370DB',
  },
  {
    id: 'general_fitness',
    name: 'General Fitness',
    description: 'Maintain a healthy lifestyle and overall wellbeing',
    emoji: '🏆',
    color: '#FFD700',
  },
];

const FitnessGoalsScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
  };

  const handleContinue = () => {
    // In a real app, you would save the selected goals
    navigation.navigate('ActivityLevel' as never);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <View style={styles.header}>
        <Text style={[styles.stepText, {color: theme.colors.text.secondary}]}>
          Step 2 of 4
        </Text>
        <Text style={[styles.title, {color: theme.colors.text.primary}]}>
          What are your fitness goals?
        </Text>
        <Text style={[styles.subtitle, {color: theme.colors.text.secondary}]}>
          Select all that apply. This helps us personalize your experience.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {goals.map(goal => {
          const isSelected = selectedGoals.includes(goal.id);
          return (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                {
                  backgroundColor: theme.colors.background.secondary,
                  borderColor: isSelected
                    ? theme.colors.primary
                    : 'transparent',
                  borderWidth: isSelected ? 2 : 0,
                },
              ]}
              onPress={() => toggleGoal(goal.id)}>
              <View style={styles.goalContent}>
                <View
                  style={[
                    styles.emojiContainer,
                    {backgroundColor: `${goal.color}30`},
                  ]}>
                  <Text style={styles.emoji}>{goal.emoji}</Text>
                </View>
                <View style={styles.goalTextContainer}>
                  <Text
                    style={[
                      styles.goalName,
                      {color: theme.colors.text.primary},
                    ]}>
                    {goal.name}
                  </Text>
                  <Text
                    style={[
                      styles.goalDescription,
                      {color: theme.colors.text.secondary},
                    ]}>
                    {goal.description}
                  </Text>
                </View>
                <View
                  style={[
                    styles.checkboxContainer,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.background.tertiary,
                    },
                  ]}>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          size="large"
          fullWidth
          disabled={selectedGoals.length === 0}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 0,
  },
  stepText: {
    fontSize: 14,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
  },
  goalCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  goalContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 24,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    padding: 24,
  },
});

export default FitnessGoalsScreen;
