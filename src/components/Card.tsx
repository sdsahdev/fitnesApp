import React from 'react';
import {View, StyleSheet, ViewStyle, TouchableOpacity} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevation' | 'outline' | 'flat';
  padding?: 'none' | 'small' | 'medium' | 'large';
  radius?: 'none' | 'small' | 'medium' | 'large' | 'rounded';
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 'medium',
  radius = 'medium',
}) => {
  const {theme} = useTheme();

  const getContainerStyle = () => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.card.background,
      borderRadius: getRadius(),
      padding: getPadding(),
    };

    switch (variant) {
      case 'elevation':
        return {
          ...baseStyle,
          ...theme.shadows.medium,
        };
      case 'outline':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.card.border,
        };
      case 'flat':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.background.secondary,
        };
      default:
        return baseStyle;
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return theme.spacing.sm;
      case 'medium':
        return theme.spacing.md;
      case 'large':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  };

  const getRadius = () => {
    switch (radius) {
      case 'none':
        return 0;
      case 'small':
        return theme.borderRadius.sm;
      case 'medium':
        return theme.borderRadius.md;
      case 'large':
        return theme.borderRadius.lg;
      case 'rounded':
        return theme.borderRadius.xl;
      default:
        return theme.borderRadius.md;
    }
  };

  const containerStyle = [styles.container, getContainerStyle(), style];

  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});

export default Card;
