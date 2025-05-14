import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import Button from '../../components/Button';
import {useTheme} from '../../theme/ThemeProvider';

// Mock subscription plans
const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    billing: 'Forever',
    color: '#4A90E2',
    features: [
      'Basic workout tracking',
      'Limited workout library',
      'Basic nutrition tracking',
      'Ad-supported experience',
    ],
    isPopular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    billing: 'per month',
    color: '#8A2BE2',
    features: [
      'Unlimited workout tracking',
      'Full workout library',
      'Advanced nutrition tracking',
      'Ad-free experience',
      'Workout plan creation',
      'Progress analytics',
    ],
    isPopular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$79.99',
    billing: 'per year',
    color: '#FF9500',
    features: [
      'All Pro features',
      'Personal training plan',
      'Priority support',
      'Early access to new features',
      'Two months free',
    ],
    isPopular: false,
  },
];

type SubscriptionCardProps = {
  plan: (typeof subscriptionPlans)[0];
  isSelected: boolean;
  onSelect: () => void;
};

const SubscriptionCard = ({
  plan,
  isSelected,
  onSelect,
}: SubscriptionCardProps) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[
        styles.planCard,
        {
          backgroundColor: theme.colors.background.secondary,
          borderColor: isSelected ? plan.color : theme.colors.border.light,
          borderWidth: isSelected ? 2 : 1,
        },
      ]}>
      {plan.isPopular && (
        <View
          style={[
            styles.popularBadge,
            {backgroundColor: theme.colors.primary},
          ]}>
          <Text style={styles.popularText}>Most Popular</Text>
        </View>
      )}
      <View style={styles.planHeader}>
        <LinearGradient
          colors={[plan.color, `${plan.color}80`]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.planIconContainer}>
          <Text style={styles.planIcon}>
            {plan.name.charAt(0).toUpperCase()}
          </Text>
        </LinearGradient>
        <View>
          <Text style={[styles.planName, {color: theme.colors.text.primary}]}>
            {plan.name}
          </Text>
          <View style={styles.priceContainer}>
            <Text
              style={[styles.planPrice, {color: theme.colors.text.primary}]}>
              {plan.price}
            </Text>
            <Text
              style={[styles.planBilling, {color: theme.colors.text.tertiary}]}>
              {plan.billing}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={[styles.divider, {backgroundColor: theme.colors.border.light}]}
      />
      <View style={styles.featuresList}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Icon
              name="checkmark-circle"
              size={16}
              color={plan.color}
              style={styles.featureIcon}
            />
            <Text
              style={[
                styles.featureText,
                {color: theme.colors.text.secondary},
              ]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const {user} = useSelector((state: any) => state.user);

  // Assume free plan by default, or get from user profile
  const [selectedPlan, setSelectedPlan] = useState(user?.planType || 'free');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSubscribe = () => {
    // This would integrate with a payment system in a real app
    if (selectedPlan === 'free') {
      Alert.alert('Free Plan', 'You are now on the free plan');
    } else {
      Alert.alert(
        'Subscription',
        `This would open the payment process for the ${
          subscriptionPlans.find(p => p.id === selectedPlan)?.name
        } plan`,
      );
    }
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
        <Text style={[styles.title, {color: theme.colors.text.primary}]}>
          Subscription
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
          Choose Your Plan
        </Text>
        <Text
          style={[
            styles.sectionDescription,
            {color: theme.colors.text.secondary},
          ]}>
          Upgrade your fitness experience with our premium features
        </Text>

        <View style={styles.plansContainer}>
          {subscriptionPlans.map(plan => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={
              selectedPlan === 'free'
                ? 'Continue with Free Plan'
                : `Subscribe to ${
                    subscriptionPlans.find(p => p.id === selectedPlan)?.name
                  }`
            }
            onPress={handleSubscribe}
            size="large"
            fullWidth
          />
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
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    marginBottom: 24,
  },
  plansContainer: {
    marginBottom: 32,
  },
  planCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  planIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 4,
  },
  planBilling: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  featuresList: {
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 16,
  },
});

export default SubscriptionScreen;
