import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const {theme} = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.border.medium;

    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'outline':
      case 'ghost':
        return 'transparent';
      case 'danger':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.text.disabled;

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return theme.colors.text.inverse;
      case 'outline':
        return theme.colors.primary;
      case 'ghost':
        return theme.colors.text.primary;
      default:
        return theme.colors.text.inverse;
    }
  };

  const getBorderColor = () => {
    if (disabled) return theme.colors.border.medium;

    switch (variant) {
      case 'outline':
        return theme.colors.primary;
      default:
        return 'transparent';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return {paddingVertical: 8, paddingHorizontal: 16};
      case 'medium':
        return {paddingVertical: 12, paddingHorizontal: 24};
      case 'large':
        return {paddingVertical: 16, paddingHorizontal: 32};
      default:
        return {paddingVertical: 12, paddingHorizontal: 24};
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return theme.fontSize.sm;
      case 'medium':
        return theme.fontSize.md;
      case 'large':
        return theme.fontSize.lg;
      default:
        return theme.fontSize.md;
    }
  };

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          width: fullWidth ? '100%' : undefined,
          ...getPadding(),
        },
        style,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {leftIcon && <span style={styles.leftIcon}>{leftIcon}</span>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                fontWeight: theme.fontWeight.semiBold,
              },
              textStyle,
            ]}>
            {title}
          </Text>
          {rightIcon && <span style={styles.rightIcon}>{rightIcon}</span>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  text: {
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button;
