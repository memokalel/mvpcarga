import { View, Text, StyleSheet, Animated, PanResponder, Platform } from 'react-native';
import { Battery } from 'lucide-react-native';
import { colors } from '../app/constants/colors';

type BatterySliderProps = {
  value: number;
  onChange: (value: number) => void;
};

export function BatterySlider({ value, onChange }: BatterySliderProps) {
  const position = new Animated.Value((value - 1) / 99);
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const trackWidth = Platform.OS === 'web' ? 300 : 280; // Ancho del track
      const newPosition = Math.max(0, Math.min(1, gestureState.moveX / trackWidth));
      position.setValue(newPosition);
      onChange(Math.round(newPosition * 99 + 1));
    },
  });

  const markers = Array.from({ length: 11 }, (_, i) => i * 10);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Battery size={24} color={colors.primary} />
        <Text style={styles.value}>{value}%</Text>
      </View>

      <View style={styles.sliderContainer}>
        <View style={styles.markersContainer}>
          {markers.map((marker) => (
            <View key={marker} style={styles.markerContainer}>
              <View style={styles.marker} />
              <Text style={styles.markerLabel}>{marker}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.track}>
          <Animated.View
            style={[
              styles.fill,
              {
                width: position.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.thumb,
              {
                transform: [
                  {
                    translateX: position.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, Platform.OS === 'web' ? 300 : 280],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.thumbInner} />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.primary,
  },
  sliderContainer: {
    height: 60,
  },
  markersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 10,
    right: 10,
    top: 0,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 2,
    height: 8,
    backgroundColor: colors.border,
    marginBottom: 4,
  },
  markerLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.text.secondary,
  },
  track: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 8,
    backgroundColor: colors.background.surface,
    borderRadius: 4,
    marginTop: 30,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.surface,
    top: -8,
    marginLeft: -12,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
        cursor: 'pointer',
      },
    }),
  },
  thumbInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    margin: 4,
  },
});