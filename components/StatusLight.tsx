import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { useEffect, useRef } from 'react';
import { colors } from '../app/constants/colors';

const statusColors = {
  available: {
    primary: colors.status.success,
    glow: '#DCFCE7',
    text: '#065F46',
  },
  waiting: {
    primary: colors.status.warning,
    glow: '#FEF3C7',
    text: '#92400E',
  },
  unavailable: {
    primary: colors.status.error,
    glow: '#FEE2E2',
    text: '#991B1B',
  },
};

type StatusLightProps = {
  status: 'available' | 'waiting' | 'unavailable';
  size?: number;
  showLabel?: boolean;
  showPulse?: boolean;
};

export function StatusLight({ 
  status, 
  size = 12, 
  showLabel = false,
  showPulse = true 
}: StatusLightProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (showPulse && status === 'available') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [status, showPulse]);

  const getLabel = () => {
    switch (status) {
      case 'available':
        return 'Sin espera';
      case 'waiting':
        return 'En espera';
      case 'unavailable':
        return 'No disponible';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.lightContainer}>
        {showPulse && status === 'available' && (
          <Animated.View
            style={[
              styles.pulse,
              {
                backgroundColor: statusColors[status].glow,
                width: size * 2.5,
                height: size * 2.5,
                borderRadius: (size * 2.5) / 2,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        )}
        <View
          style={[
            styles.light,
            {
              backgroundColor: statusColors[status].primary,
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: statusColors[status].glow,
              borderWidth: 2,
            },
          ]}
        />
      </View>
      {showLabel && (
        <View style={[
          styles.labelContainer,
          { backgroundColor: statusColors[status].glow }
        ]}>
          <Text style={[
            styles.label,
            { color: statusColors[status].text }
          ]}>
            {getLabel()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lightContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  light: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      default: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  pulse: {
    position: 'absolute',
    opacity: 0.5,
  },
  labelContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
});