import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {LineChart} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';

import {useTheme} from '../../theme/ThemeProvider';
import Card from '../../components/Card';

// Mock data for charts
const weightData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [75, 74, 73, 72, 71, 70],
      color: () => '#8A2BE2', // Purple color
      strokeWidth: 2,
    },
  ],
};

const workoutData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [3, 4, 2, 3, 1, 5, 2],
      color: () => '#FF4500', // Orange-red color
      strokeWidth: 2,
    },
  ],
};

const caloriesData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [1800, 2100, 1900, 2200, 1750, 2400, 2000],
      color: () => '#32CD32', // Lime green color
      strokeWidth: 2,
    },
  ],
};

type ProgressTabProps = {
  title: string;
  isActive: boolean;
  onPress: () => void;
};

const ProgressTab = ({title, isActive, onPress}: ProgressTabProps) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.tab,
        {
          backgroundColor: isActive
            ? theme.colors.primary
            : theme.colors.background.secondary,
        },
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.tabText,
          {
            color: isActive ? 'white' : theme.colors.text.primary,
            fontWeight: isActive ? 'bold' : 'normal',
          },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
};

const StatCard = ({title, value, subtitle, icon, color}: StatCardProps) => {
  const {theme} = useTheme();

  return (
    <Card style={styles.statCard}>
      <View style={[styles.statIconContainer, {backgroundColor: `${color}20`}]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statTitle, {color: theme.colors.text.secondary}]}>
        {title}
      </Text>
      <Text style={[styles.statValue, {color: theme.colors.text.primary}]}>
        {value}
      </Text>
      <Text style={[styles.statSubtitle, {color: theme.colors.text.tertiary}]}>
        {subtitle}
      </Text>
    </Card>
  );
};

const ProgressScreen = () => {
  const {theme} = useTheme();
  const [activeTab, setActiveTab] = useState('week');
  const user = useSelector((state: any) => state.auth.user);
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background.secondary,
    backgroundGradientTo: theme.colors.background.secondary,
    color: () => theme.colors.text.primary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: () => theme.colors.text.secondary,
    propsForDots: {
      r: '5',
      strokeWidth: '2',
    },
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.colors.background.primary},
      ]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.text.primary}]}>
          Progress
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <ProgressTab
          title="Week"
          isActive={activeTab === 'week'}
          onPress={() => setActiveTab('week')}
        />
        <ProgressTab
          title="Month"
          isActive={activeTab === 'month'}
          onPress={() => setActiveTab('month')}
        />
        <ProgressTab
          title="Year"
          isActive={activeTab === 'year'}
          onPress={() => setActiveTab('year')}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Workouts"
            value="12"
            subtitle="This month"
            icon="barbell"
            color={theme.colors.primary}
          />
          <StatCard
            title="Active Days"
            value="18"
            subtitle="This month"
            icon="calendar"
            color="#FF4500"
          />
          <StatCard
            title="Weight Loss"
            value="2.5 kg"
            subtitle="Since start"
            icon="trending-down"
            color="#32CD32"
          />
        </View>

        {/* Weight Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text
              style={[styles.chartTitle, {color: theme.colors.text.primary}]}>
              Weight Progress
            </Text>
            <TouchableOpacity>
              <Text style={[styles.chartLink, {color: theme.colors.primary}]}>
                Details
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.chartContainer,
              {backgroundColor: theme.colors.background.secondary},
            ]}>
            <LineChart
              data={weightData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
            <View style={styles.chartLegend}>
              <Text
                style={[
                  styles.chartLegendText,
                  {color: theme.colors.text.primary},
                ]}>
                Starting: 75 kg
              </Text>
              <Text
                style={[
                  styles.chartLegendText,
                  {color: theme.colors.text.primary},
                ]}>
                Current: 70 kg
              </Text>
              <Text
                style={[styles.chartLegendText, {color: theme.colors.success}]}>
                -5 kg (6.7%)
              </Text>
            </View>
          </View>
        </View>

        {/* Workout Frequency Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text
              style={[styles.chartTitle, {color: theme.colors.text.primary}]}>
              Workout Frequency
            </Text>
            <TouchableOpacity>
              <Text style={[styles.chartLink, {color: theme.colors.primary}]}>
                Details
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.chartContainer,
              {backgroundColor: theme.colors.background.secondary},
            ]}>
            <LineChart
              data={workoutData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: () => '#FF4500',
              }}
              bezier
              style={styles.chart}
            />
            <View style={styles.chartLegend}>
              <Text
                style={[
                  styles.chartLegendText,
                  {color: theme.colors.text.primary},
                ]}>
                Total Workouts: 20
              </Text>
              <Text
                style={[
                  styles.chartLegendText,
                  {color: theme.colors.text.primary},
                ]}>
                Weekly Average: 3
              </Text>
            </View>
          </View>
        </View>

        {/* Calories Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text
              style={[styles.chartTitle, {color: theme.colors.text.primary}]}>
              Calorie Intake
            </Text>
            <TouchableOpacity>
              <Text style={[styles.chartLink, {color: theme.colors.primary}]}>
                Details
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.chartContainer,
              {backgroundColor: theme.colors.background.secondary},
            ]}>
            <LineChart
              data={caloriesData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: () => '#32CD32',
              }}
              bezier
              style={styles.chart}
            />
            <View style={styles.chartLegend}>
              <Text
                style={[
                  styles.chartLegendText,
                  {color: theme.colors.text.primary},
                ]}>
                Daily Target: 2000 kcal
              </Text>
              <Text
                style={[
                  styles.chartLegendText,
                  {color: theme.colors.text.primary},
                ]}>
                Weekly Average: 2050 kcal
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
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    padding: 12,
    width: '31%',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 10,
    textAlign: 'center',
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
  },
  chart: {
    marginLeft: -20,
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  chartLegendText: {
    fontSize: 12,
  },
});

export default ProgressScreen;
