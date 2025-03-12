import { View, Text, StyleSheet } from 'react-native';
import { Users } from 'lucide-react-native';
import { colors } from '../app/constants/colors';

type OccupancyIndicatorProps = {
  available: number;
  total: number;
  size?: 'small' | 'large';
};

export function OccupancyIndicator({ available, total, size = 'small' }: OccupancyIndicatorProps) {
  const occupancyPercentage = ((total - available) / total) * 100;
  
  const getOccupancyLevel = () => {
    if (occupancyPercentage >= 80) return 'Alto';
    if (occupancyPercentage >= 40) return 'Medio';
    return 'Bajo';
  };

  const getStatusColor = () => {
    if (occupancyPercentage >= 80) return colors.status.error;
    if (occupancyPercentage >= 40) return colors.status.warning;
    return colors.status.success;
  };

  return (
    <View style={[
      styles.container,
      size === 'large' && styles.containerLarge
    ]}>
      <View style={styles.header}>
        <Users size={size === 'large' ? 24 : 20} color={getStatusColor()} />
        <Text style={[
          styles.level,
          size === 'large' && styles.textLarge,
          { color: getStatusColor() }
        ]}>
          Ocupación {getOccupancyLevel()}
        </Text>
      </View>
      <View style={styles.details}>
        <Text style={[
          styles.text,
          size === 'large' && styles.textLarge
        ]}>
          {available} de {total} puntos disponibles
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.main,
    borderRadius: 12,
    padding: 12,
  },
  containerLarge: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  level: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  details: {
    marginLeft: 32,
  },
  text: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
  },
  textLarge: {
    fontSize: 16,
  },
});