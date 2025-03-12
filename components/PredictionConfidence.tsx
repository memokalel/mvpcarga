import { View, Text, StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';
import { colors } from '../app/constants/colors';

type PredictionConfidenceProps = {
  confidence: number;
  size?: 'small' | 'large';
};

export function PredictionConfidence({ confidence, size = 'small' }: PredictionConfidenceProps) {
  const getConfidenceColor = (value: number) => {
    if (value >= 80) return colors.status.success;
    if (value >= 60) return colors.status.warning;
    return colors.status.error;
  };

  return (
    <View style={[
      styles.container,
      size === 'large' && styles.containerLarge
    ]}>
      <Info 
        size={size === 'large' ? 20 : 16} 
        color={getConfidenceColor(confidence)} 
      />
      <Text style={[
        styles.text,
        size === 'large' && styles.textLarge,
        { color: getConfidenceColor(confidence) }
      ]}>
        {confidence}% confianza
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background.main,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  containerLarge: {
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  textLarge: {
    fontSize: 14,
  },
});