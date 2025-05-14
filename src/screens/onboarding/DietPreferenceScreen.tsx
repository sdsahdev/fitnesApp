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

type DietType = {
  id: string;
  name: string;
  description: string;
  emoji: string;
};

const dietTypes: DietType[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Balanced diet with all food groups',
    emoji: '🍳',
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    description: 'No meat, but includes dairy and eggs',
    emoji: '🥗',
  },
  {
    id: 'vegan',
    name: 'Vegan',
    description: 'No animal products at all',
    emoji: '🥦',
  },
  {
    id: 'keto',
    name: 'Keto',
    description: 'High fat, low carb diet',
    emoji: '🥑',
  },
  {
    id: 'paleo',
    name: 'Paleo',
    description:
      'Based on foods similar to those eaten during the Paleolithic era',
    emoji: '🥩',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    description: 'Rich in fruits, vegetables, olive oil, and fish',
    emoji: '🫒',
  },
  {
    id: 'gluten_free',
    name: 'Gluten-Free',
    description: 'Avoids gluten found in wheat and other grains',
    emoji: '🌾',
  },
];

const DietPreferenceScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [selectedDiet, setSelectedDiet] = useState<string | null>(null);

  // Helper function to ensure we always get a string color value
  const getColorString = (color: any): string => {
    return typeof color === 'string' ? color : color?.light || '#000000';
  };

  const handleSelectDiet = (dietId: string) => {
    setSelectedDiet(dietId);
  };

  const handleContinue = () => {
    if (selectedDiet) {
      // In a real app, you would save the selected diet preference
      navigation.navigate('OnboardingComplete' as never);
    }
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
          Step 4 of 4
        </Text>
        <Text
          style={[
            styles.title,
            {color: getColorString(theme.colors.text.primary)},
          ]}>
          What's your diet preference?
        </Text>
        <Text
          style={[
            styles.subtitle,
            {color: getColorString(theme.colors.text.secondary)},
          ]}>
          We'll customize your meal plans based on your preference
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {dietTypes.map(diet => (
          <TouchableOpacity
            key={diet.id}
            style={[
              styles.dietCard,
              {
                backgroundColor: getColorString(
                  theme.colors.background.secondary,
                ),
                borderColor:
                  selectedDiet === diet.id
                    ? getColorString(theme.colors.primary)
                    : 'transparent',
                borderWidth: selectedDiet === diet.id ? 2 : 0,
              },
            ]}
            onPress={() => handleSelectDiet(diet.id)}>
            <View style={styles.dietContent}>
              <View
                style={[
                  styles.emojiContainer,
                  {
                    backgroundColor: `${getColorString(
                      theme.colors.primary,
                    )}20`,
                  },
                ]}>
                <Text style={styles.emoji}>{diet.emoji}</Text>
              </View>
              <View style={styles.dietTextContainer}>
                <Text
                  style={[
                    styles.dietName,
                    {color: getColorString(theme.colors.text.primary)},
                  ]}>
                  {diet.name}
                </Text>
                <Text
                  style={[
                    styles.dietDescription,
                    {color: getColorString(theme.colors.text.secondary)},
                  ]}>
                  {diet.description}
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  {
                    borderColor:
                      selectedDiet === diet.id
                        ? getColorString(theme.colors.primary)
                        : getColorString(theme.colors.border),
                  },
                ]}>
                {selectedDiet === diet.id && (
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
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          size="large"
          fullWidth
          disabled={!selectedDiet}
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
    paddingHorizontal: 24,
  },
  dietCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  dietContent: {
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
  dietTextContainer: {
    flex: 1,
  },
  dietName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  dietDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
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

export default DietPreferenceScreen;
