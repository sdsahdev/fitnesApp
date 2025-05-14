import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeProvider';
import Button from '../../components/Button';

type ActivityLevel = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const activityLevels: ActivityLevel[] = [
  {
    id: 'sedentary',
    title: 'Sedentary',
    description: 'Little to no exercise, desk job',
    icon: '💤',
  },
  {
    id: 'lightly_active',
    title: 'Lightly Active',
    description: 'Light exercise 1-3 days per week',
    icon: '🚶',
  },
  {
    id: 'moderately_active',
    title: 'Moderately Active',
    description: 'Moderate exercise 3-5 days per week',
    icon: '🏃',
  },
  {
    id: 'very_active',
    title: 'Very Active',
    description: 'Hard exercise 6-7 days per week',
    icon: '🏋️',
  },
  {
    id: 'extremely_active',
    title: 'Extremely Active',
    description: 'Hard daily exercise and physical job or training twice a day',
    icon: '🚴',
  },
];

const ActivityLevelScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handleSelectLevel = (levelId: string) => {
    setSelectedLevel(levelId);
  };

  const handleContinue = () => {
    if (selectedLevel) {
      // In a real app, you would save the selected activity level
      navigation.navigate('DietPreference' as never);
    }
  };

  // Helper function to ensure we always get a string color value
  const getColorString = (color: any): string => {
    return typeof color === 'string' ? color : color?.light || '#000000';
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: getColorString(theme.colors.background.primary)},
      ]}>
      <View style={styles.header}>
        <Text
          style={[
            styles.stepText,
            {color: getColorString(theme.colors.text.secondary)},
          ]}>
          Step 3 of 4
        </Text>
        <Text
          style={[
            styles.title,
            {color: getColorString(theme.colors.text.primary)},
          ]}>
          What's your activity level?
        </Text>
        <Text
          style={[
            styles.subtitle,
            {color: getColorString(theme.colors.text.secondary)},
          ]}>
          This helps us calculate your daily caloric needs
        </Text>
      </View>

      <View style={styles.content}>
        {activityLevels.map(level => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.activityCard,
              {
                backgroundColor: getColorString(
                  theme.colors.background.secondary,
                ),
                borderColor:
                  selectedLevel === level.id
                    ? getColorString(theme.colors.primary)
                    : 'transparent',
                borderWidth: selectedLevel === level.id ? 2 : 0,
              },
            ]}
            onPress={() => handleSelectLevel(level.id)}>
            <View style={styles.activityContent}>
              <Text style={styles.activityIcon}>{level.icon}</Text>
              <View style={styles.activityTextContainer}>
                <Text
                  style={[
                    styles.activityTitle,
                    {color: getColorString(theme.colors.text.primary)},
                  ]}>
                  {level.title}
                </Text>
                <Text
                  style={[
                    styles.activityDescription,
                    {color: getColorString(theme.colors.text.secondary)},
                  ]}>
                  {level.description}
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  {
                    borderColor:
                      selectedLevel === level.id
                        ? getColorString(theme.colors.primary)
                        : getColorString(theme.colors.border),
                  },
                ]}>
                {selectedLevel === level.id && (
                  <View
                    style={[
                      styles.radioButtonSelected,
                      {backgroundColor: getColorString(theme.colors.primary)},
                    ]}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          size="large"
          fullWidth
          disabled={!selectedLevel}
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
    paddingBottom: 16,
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
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 0,
  },
  activityCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  activityContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  activityIcon: {
    fontSize: 26,
    marginRight: 16,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  buttonsContainer: {
    padding: 24,
  },
});

export default ActivityLevelScreen;
