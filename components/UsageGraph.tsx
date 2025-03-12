import { View, StyleSheet } from 'react-native';
import { colors } from '../app/constants/colors';

type UsageGraphProps = {
  usage: number; // 0-100
  size?: 'small' | 'large';
};

export function UsageGraph({ usage, size = 'small' }: UsageGraphProps) {
  const bars = [20, 40, 60, 80, 100];
  const activeColor = usage > 66 
    ? colors.status.error 
    : usage > 33 
    ? colors.status.warning 
    : colors.status.success;

  return (
    <View style={[
      styles.container,
      size === 'large' && styles.containerLarge
    ]}>
      {bars.map((threshold, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            size === 'large' && styles.barLarge,
            {
              backgroundColor: usage >= threshold 
                ? activeColor 
                : colors.background.main,
              height: 8 + (index * 2),
            }
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 16,
  },
  containerLarge: {
    height: 24,
    gap: 3,
  },
  bar: {
    width: 3,
    borderRadius: 1,
  },
  barLarge: {
    width: 4,
    borderRadius: 2,
  },
});