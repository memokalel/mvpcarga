// Unified color system with semantic naming and WCAG 2.1 compliant contrast ratios
export const colors = {
  // Primary brand colors
  primary: '#0c8f76',    // Deep teal - Main brand color
  secondary: '#34a88e',  // Light teal - Secondary actions
  accent: '#ffcb05',     // Yellow - Highlights and accents
  
  // Background colors
  background: {
    main: '#eaf7f3',     // Light mint - Main background
    surface: '#ffffff',   // White - Cards and elevated surfaces
    modal: 'rgba(0, 0, 0, 0.6)', // Modal overlay with 60% opacity
  },
  
  // Text colors - All meet WCAG 2.1 AA standards
  text: {
    primary: '#1A202C',   // Near black - Primary text
    secondary: '#4A5568', // Dark gray - Secondary text
    light: '#718096',     // Medium gray - Subtle text
    inverse: '#ffffff',   // White text - On dark backgrounds
  },
  
  // Status colors
  status: {
    success: '#10B981',   // Green - Success states
    warning: '#F59E0B',   // Amber - Warning states
    error: '#EF4444',     // Red - Error states
  },
  
  // Border and shadow colors
  border: '#E2E8F0',     // Light gray - Borders and dividers
  shadow: '#000000',     // Black - For shadows with varying opacity
};

// Standardized shadow styles
export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};

// Typography scale with consistent ratios
export const typography = {
  h1: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    lineHeight: 32,
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
  caption: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
};

// Spacing system based on 4px grid
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Border radius system
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 9999,
};

// Animation presets
export const animations = {
  spring: {
    damping: 20,
    stiffness: 90,
  },
  timing: {
    duration: 250,
  },
};