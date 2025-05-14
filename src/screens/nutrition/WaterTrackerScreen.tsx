import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import {useTheme} from '../../theme/ThemeProvider';
import {RootState} from '../../store';
import {
  addWaterEntry,
  fetchWaterEntriesByDate,
} from '../../store/slices/nutritionSlice';

const WaterTrackerScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {user} = useSelector((state: RootState) => state.auth);
  const {dailyNutrition, nutritionGoals} = useSelector(
    (state: RootState) => state.nutrition,
  );

  const [currentDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  // Make sure we fetch the latest data when the screen opens
  useEffect(() => {
    if (user?.uid) {
      setLoading(true);
      dispatch(
        fetchWaterEntriesByDate({userId: user.uid, date: currentDate}) as any,
      )
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  }, [dispatch, user, currentDate]);

  // Default water goal if not set
  const waterGoal = nutritionGoals?.waterGoal || 2500; // Default 2.5L
  const currentWater = dailyNutrition?.water || 0;

  const [waterAmount, setWaterAmount] = useState(250); // Default to 250ml

  // Calculate percentage of goal achieved
  const percentComplete = Math.min((currentWater / waterGoal) * 100, 100);

  // Define water amount presets
  const presets = [100, 250, 500, 750, 1000];

  const handleAddWater = () => {
    if (user?.uid && waterAmount > 0) {
      dispatch(
        addWaterEntry({
          userId: user.uid,
          amount: waterAmount,
          date: currentDate,
        }) as any,
      );
      // Optionally reset to default amount
      setWaterAmount(250);
    }
  };

  const handleSelectPreset = (amount: number) => {
    setWaterAmount(amount);
  };

  // Format ml to L for display when appropriate
  const formatWaterAmount = (ml: number) => {
    return ml >= 1000 ? `${(ml / 1000).toFixed(1)}L` : `${ml}ml`;
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: theme.colors.background.primary},
        ]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[styles.loadingText, {color: theme.colors.text.secondary}]}>
            Loading water data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          Water Tracker
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Today's Progress */}
        <View style={styles.progressSection}>
          <Text
            style={[
              styles.progressTitle,
              {color: theme.colors.text.secondary},
            ]}>
            Today's Progress
          </Text>
          <View style={styles.goalContainer}>
            <Text style={[styles.goalText, {color: theme.colors.text.primary}]}>
              {formatWaterAmount(currentWater)} / {formatWaterAmount(waterGoal)}
            </Text>
            <Text
              style={[
                styles.percentText,
                {
                  color:
                    percentComplete >= 100
                      ? theme.colors.success
                      : theme.colors.info,
                },
              ]}>
              {Math.round(percentComplete)}%
            </Text>
          </View>

          {/* Progress Bar */}
          <View
            style={[
              styles.progressBarContainer,
              {backgroundColor: `${theme.colors.info}30`},
            ]}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${percentComplete}%`,
                  backgroundColor: theme.colors.info,
                },
              ]}
            />
          </View>

          {/* Visual Water Glass Representation */}
          <View style={styles.waterGlassVisual}>
            <View
              style={[
                styles.glassOutline,
                {borderColor: theme.colors.text.secondary},
              ]}>
              <View
                style={[
                  styles.waterFill,
                  {
                    height: `${percentComplete}%`,
                    backgroundColor: theme.colors.info,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Add Water Section */}
        <View
          style={[
            styles.addWaterSection,
            {backgroundColor: theme.colors.background.secondary},
          ]}>
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
            Add Water
          </Text>

          {/* Current Selection Display */}
          <View style={styles.amountDisplay}>
            <Icon name="water" size={24} color={theme.colors.info} />
            <Text
              style={[styles.amountText, {color: theme.colors.text.primary}]}>
              {formatWaterAmount(waterAmount)}
            </Text>
          </View>

          {/* Slider */}
          <Slider
            style={styles.slider}
            minimumValue={50}
            maximumValue={1000}
            step={50}
            value={waterAmount}
            onValueChange={value => setWaterAmount(value)}
            minimumTrackTintColor={theme.colors.info}
            maximumTrackTintColor={`${theme.colors.info}30`}
            thumbTintColor={theme.colors.info}
          />

          {/* Preset Amount Buttons */}
          <View style={styles.presetContainer}>
            {presets.map(preset => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.presetButton,
                  {
                    backgroundColor:
                      waterAmount === preset
                        ? theme.colors.info
                        : `${theme.colors.info}30`,
                  },
                ]}
                onPress={() => handleSelectPreset(preset)}>
                <Text
                  style={[
                    styles.presetText,
                    {
                      color:
                        waterAmount === preset ? '#FFFFFF' : theme.colors.info,
                    },
                  ]}>
                  {formatWaterAmount(preset)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add Button */}
          <TouchableOpacity
            style={[styles.addButton, {backgroundColor: theme.colors.info}]}
            onPress={handleAddWater}>
            <Icon name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Water</Text>
          </TouchableOpacity>
        </View>

        {/* Water Benefits Section */}
        <View
          style={[
            styles.benefitsSection,
            {backgroundColor: theme.colors.background.secondary},
          ]}>
          <Text
            style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
            Benefits of Staying Hydrated
          </Text>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Icon
                name="fitness-outline"
                size={20}
                color={theme.colors.info}
              />
              <Text
                style={[
                  styles.benefitText,
                  {color: theme.colors.text.secondary},
                ]}>
                Improves physical performance
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="brain-outline" size={20} color={theme.colors.info} />
              <Text
                style={[
                  styles.benefitText,
                  {color: theme.colors.text.secondary},
                ]}>
                Enhances brain function
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="body-outline" size={20} color={theme.colors.info} />
              <Text
                style={[
                  styles.benefitText,
                  {color: theme.colors.text.secondary},
                ]}>
                Helps regulate body temperature
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="heart-outline" size={20} color={theme.colors.info} />
              <Text
                style={[
                  styles.benefitText,
                  {color: theme.colors.text.secondary},
                ]}>
                Supports cardiovascular health
              </Text>
            </View>
          </View>
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
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  goalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  percentText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  waterGlassVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  glassOutline: {
    width: 100,
    height: 150,
    borderWidth: 3,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  waterFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 8,
  },
  addWaterSection: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  amountText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 16,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  presetButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 10,
    minWidth: '18%',
    alignItems: 'center',
  },
  presetText: {
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  benefitsSection: {
    padding: 20,
    borderRadius: 16,
  },
  benefitsList: {
    marginTop: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 16,
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});

export default WaterTrackerScreen;
