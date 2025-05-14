import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../../components/Button';
import {useTheme} from '../../theme/ThemeProvider';

// Mock exercise data (this would normally come from a prop, Redux or an API)
const mockExerciseData = {
  id: 'ex1',
  name: 'Push-ups',
  description:
    'The push-up is a classic bodyweight exercise that targets the chest, shoulders, and triceps. It also engages the core and helps to build functional upper body strength.',
  instructions: [
    'Start in a plank position with your hands slightly wider than shoulder-width apart.',
    'Keep your body in a straight line from head to heels.',
    'Lower your body until your chest nearly touches the floor.',
    'Pause, then push yourself back up to the starting position.',
    'Keep your elbows at about a 45-degree angle to your body during the movement.',
  ],
  sets: 3,
  reps: 15,
  restTime: 60,
  imageURL: 'https://via.placeholder.com/400',
  videoURL: 'https://example.com/videos/pushup.mp4',
  muscleGroup: 'chest',
  secondaryMuscles: ['shoulders', 'triceps', 'core'],
  equipment: 'none',
  difficulty: 'beginner',
  tips: [
    'Keep your core engaged throughout the movement.',
    "Don't let your hips sag or pike up.",
    'Focus on full range of motion.',
    'If too difficult, try from knees or against a wall.',
    'For more challenge, elevate your feet or use a weighted vest.',
  ],
  variations: [
    {
      name: 'Wide Push-ups',
      description:
        'Place hands wider than shoulder width to focus more on chest.',
    },
    {
      name: 'Diamond Push-ups',
      description:
        'Place hands close together under chest to focus more on triceps.',
    },
    {
      name: 'Decline Push-ups',
      description:
        'Elevate feet to increase difficulty and shift focus to upper chest and shoulders.',
    },
  ],
};

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section = ({title, children}: SectionProps) => {
  const {theme} = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
        {title}
      </Text>
      {children}
    </View>
  );
};

const ExerciseDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {theme} = useTheme();

  // In a real app, this would fetch data based on the exerciseId from route.params
  // const exerciseId = route.params?.exerciseId;
  const [exercise] = useState(mockExerciseData);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={[
            styles.backButton,
            {backgroundColor: theme.colors.background.secondary},
          ]}>
          <Icon name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text.primary}]}>
          Exercise Details
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Exercise Image */}
        <Image
          source={{uri: exercise.imageURL}}
          style={styles.exerciseImage}
          resizeMode="cover"
        />

        {/* Title and Quick Stats */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, {color: theme.colors.text.primary}]}>
            {exercise.name}
          </Text>
          <View
            style={[
              styles.difficultyBadge,
              {backgroundColor: `${theme.colors.primary}20`},
            ]}>
            <Text
              style={[styles.difficultyText, {color: theme.colors.primary}]}>
              {capitalizeFirst(exercise.difficulty)}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon
              name="time-outline"
              size={20}
              color={theme.colors.text.secondary}
            />
            <Text
              style={[styles.statText, {color: theme.colors.text.secondary}]}>
              {exercise.sets} sets
            </Text>
          </View>
          <View style={styles.statItem}>
            <Icon
              name="repeat-outline"
              size={20}
              color={theme.colors.text.secondary}
            />
            <Text
              style={[styles.statText, {color: theme.colors.text.secondary}]}>
              {exercise.reps} reps
            </Text>
          </View>
          <View style={styles.statItem}>
            <Icon
              name="hourglass-outline"
              size={20}
              color={theme.colors.text.secondary}
            />
            <Text
              style={[styles.statText, {color: theme.colors.text.secondary}]}>
              {exercise.restTime}s rest
            </Text>
          </View>
        </View>

        {/* Target Muscles */}
        <Section title="Target Muscles">
          <View style={styles.musclesContainer}>
            <View
              style={[
                styles.muscleBadge,
                {backgroundColor: `${theme.colors.workoutCard.strength}20`},
              ]}>
              <Text
                style={[
                  styles.primaryMuscleText,
                  {color: theme.colors.workoutCard.strength},
                ]}>
                {capitalizeFirst(exercise.muscleGroup)}
              </Text>
            </View>
            {exercise.secondaryMuscles.map((muscle, index) => (
              <View
                key={index}
                style={[
                  styles.muscleBadge,
                  {backgroundColor: `${theme.colors.workoutCard.cardio}10`},
                ]}>
                <Text
                  style={[
                    styles.secondaryMuscleText,
                    {color: theme.colors.workoutCard.cardio},
                  ]}>
                  {capitalizeFirst(muscle)}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Description */}
        <Section title="Description">
          <Text
            style={[styles.description, {color: theme.colors.text.secondary}]}>
            {exercise.description}
          </Text>
        </Section>

        {/* Instructions */}
        <Section title="Instructions">
          {exercise.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View
                style={[
                  styles.instructionNumber,
                  {backgroundColor: theme.colors.primary},
                ]}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <Text
                style={[
                  styles.instructionText,
                  {color: theme.colors.text.secondary},
                ]}>
                {instruction}
              </Text>
            </View>
          ))}
        </Section>

        {/* Tips */}
        <Section title="Tips">
          {exercise.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Icon
                name="bulb-outline"
                size={16}
                color={theme.colors.warning}
                style={styles.tipIcon}
              />
              <Text
                style={[styles.tipText, {color: theme.colors.text.secondary}]}>
                {tip}
              </Text>
            </View>
          ))}
        </Section>

        {/* Variations */}
        <Section title="Variations">
          {exercise.variations.map((variation, index) => (
            <View
              key={index}
              style={[
                styles.variationItem,
                {backgroundColor: theme.colors.background.secondary},
              ]}>
              <Text
                style={[
                  styles.variationName,
                  {color: theme.colors.text.primary},
                ]}>
                {variation.name}
              </Text>
              <Text
                style={[
                  styles.variationDescription,
                  {color: theme.colors.text.secondary},
                ]}>
                {variation.description}
              </Text>
            </View>
          ))}
        </Section>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        <Button
          title="Watch Video Tutorial"
          onPress={() => {}}
          size="large"
          fullWidth
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingBottom: 100,
  },
  exerciseImage: {
    width: '100%',
    height: 250,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  musclesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  muscleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  primaryMuscleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  secondaryMuscleText: {
    fontSize: 14,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  numberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 3,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  variationItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  variationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  variationDescription: {
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});

export default ExerciseDetailScreen;
