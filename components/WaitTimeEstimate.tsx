import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { colors } from '../app/constants/colors';

type WaitTimeEstimateProps = {
  baseMinutes: number;
  variation?: number;
};

export function WaitTimeEstimate({ baseMinutes, variation = 1 }: WaitTimeEstimateProps) {
  const [currentEstimate, setCurrentEstimate] = useState(baseMinutes);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomVariation = Math.random() * variation * 2 - variation;
      setCurrentEstimate(Math.max(1, baseMinutes + randomVariation));
    }, 3000);

    return () => clearInterval(interval);
  }, [baseMinutes, variation]);

  return (
    <View style={styles.container}>
      <Clock size={20} color={colors.status.warning} />
      <Text style={styles.time}>
        ~{Math.round(currentEstimate)} min espera
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  time: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.status.warning,
  },
});