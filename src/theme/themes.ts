import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// Define common values
const commonValues = {
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 50,
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    title: 32,
    header: 36,
  },

  // Font weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },

  // Line heights
  lineHeight: {
    xs: 18,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 38,
  },

  // Animation durations
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};

// Light theme colors
export const lightTheme = {
  ...commonValues,

  // Colors
  colors: {
    // Primary brand colors
    primary: '#007AFF',
    primaryLight: '#4DA2FF',
    primaryDark: '#0055B3',

    // Secondary brand colors
    secondary: '#5E5CE6',
    secondaryLight: '#8A89EF',
    secondaryDark: '#4240A3',

    // Accent colors
    accent: '#FF9500',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',

    // Background colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F2F2F7',
      tertiary: '#E5E5EA',
    },

    // Text colors
    text: {
      primary: '#000000',
      secondary: '#3C3C43',
      tertiary: '#8E8E93',
      disabled: '#C7C7CC',
      inverse: '#FFFFFF',
    },

    // Border colors
    border: {
      light: '#E5E5EA',
      medium: '#C7C7CC',
      dark: '#8E8E93',
    },

    // Card & container colors
    card: {
      background: '#FFFFFF',
      border: '#E5E5EA',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },

    // Input colors
    input: {
      background: '#FFFFFF',
      border: '#C7C7CC',
      placeholderText: '#8E8E93',
      focusBorder: '#007AFF',
    },

    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Specific feature colors
    workoutCard: {
      strength: '#FF9500',
      cardio: '#FF3B30',
      hiit: '#FF2D55',
      flexibility: '#5AC8FA',
      custom: '#007AFF',
    },

    // Progress bars
    progressBar: {
      track: '#E5E5EA',
      progress: '#007AFF',
    },

    // Tab bars & navigation
    tab: {
      active: '#007AFF',
      inactive: '#8E8E93',
      background: '#FFFFFF',
      border: '#E5E5EA',
    },
  },

  // Shadows
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.2,
      shadowRadius: 1.5,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 8,
    },
  },
};

// Dark theme colors
export const darkTheme = {
  ...commonValues,

  // Colors
  colors: {
    // Primary brand colors
    primary: '#0A84FF',
    primaryLight: '#5EB2FF',
    primaryDark: '#0055B3',

    // Secondary brand colors
    secondary: '#5E5CE6',
    secondaryLight: '#8A89EF',
    secondaryDark: '#4240A3',

    // Accent colors
    accent: '#FF9F0A',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#64D2FF',

    // Background colors
    background: {
      primary: '#000000',
      secondary: '#1C1C1E',
      tertiary: '#2C2C2E',
    },

    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#EBEBF5',
      tertiary: '#EBEBF599',
      disabled: '#EBEBF566',
      inverse: '#000000',
    },

    // Border colors
    border: {
      light: '#38383A',
      medium: '#48484A',
      dark: '#636366',
    },

    // Card & container colors
    card: {
      background: '#1C1C1E',
      border: '#38383A',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },

    // Input colors
    input: {
      background: '#1C1C1E',
      border: '#48484A',
      placeholderText: '#EBEBF566',
      focusBorder: '#0A84FF',
    },

    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.7)',

    // Specific feature colors
    workoutCard: {
      strength: '#FF9F0A',
      cardio: '#FF453A',
      hiit: '#FF375F',
      flexibility: '#64D2FF',
      custom: '#0A84FF',
    },

    // Progress bars
    progressBar: {
      track: '#38383A',
      progress: '#0A84FF',
    },

    // Tab bars & navigation
    tab: {
      active: '#0A84FF',
      inactive: '#EBEBF599',
      background: '#1C1C1E',
      border: '#38383A',
    },
  },

  // Shadows
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.4,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};
