import { Platform } from 'react-native';

// Unified color palette
export const colors = {
  primary: {
    main: '#1E3A8A',    // Deep blue
    light: '#3B82F6',   // Light blue
    dark: '#1E40AF',    // Dark blue
    contrast: '#FFFFFF', // White text
  },
  secondary: {
    main: '#059669',    // Green
    light: '#10B981',   // Light green
    dark: '#047857',    // Dark green
  },
  status: {
    available: {
      bg: '#DCFCE7',
      text: '#065F46',
      icon: '#10B981',
    },
    waiting: {
      bg: '#FEF3C7',
      text: '#92400E',
      icon: '#F59E0B',
    },
    unavailable: {
      bg: '#FEE2E2',
      text: '#991B1B',
      icon: '#EF4444',
    }
  },
  text: {
    primary: '#1A202C',
    secondary: '#4A5568',
    tertiary: '#718096',
    inverse: '#FFFFFF',
  },
  background: {
    main: '#F8FAFC',
    card: '#FFFFFF',
    modal: 'rgba(0, 0, 0, 0.5)',
  },
  border: '#E2E8F0',
};

// Typography
export const typography = {
  h1: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    lineHeight: 34,
  },
  h2: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    lineHeight: 30,
  },
  h3: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    lineHeight: 28,
  },
  body1: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Shadows
export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
    default: {
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
    default: {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    android: {
      elevation: 8,
    },
    default: {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
  }),
};

// Border Radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 9999,
};

// Animation Configs
export const animations = {
  spring: {
    damping: 20,
    stiffness: 90,
  },
  timing: {
    duration: 250,
  },
};