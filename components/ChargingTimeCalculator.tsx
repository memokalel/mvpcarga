import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { colors } from '../app/constants/colors';

type ChargingTimeCalculatorProps = {
  batteryCapacity: number;  // Vehicle battery capacity in kWh
  chargingPower: number;    // Effective charging power (min between station and vehicle)
  currentPercentage?: number; // Current battery level (default 20%)
  targetPercentage?: number;  // Target battery level (default 80%)
};

export function ChargingTimeCalculator({
  batteryCapacity,
  chargingPower,
  currentPercentage = 20,
  targetPercentage = 80,
}: ChargingTimeCalculatorProps) {
  const calculateChargingTime = () => {
    // Energy needed in kWh
    const energyNeeded = (batteryCapacity * (targetPercentage - currentPercentage)) / 100;
    
    // Charging curve efficiency factors
    const getEfficiencyFactor = (percentage: number) => {
      if (percentage <= 50) return 1.0;  // 100% efficiency up to 50%
      if (percentage <= 80) return 0.7;  // 70% efficiency 50-80%
      return 0.4;  // 40% efficiency above 80%
    };

    // Calculate time considering charging curve
    let remainingEnergy = energyNeeded;
    let totalMinutes = 0;
    let currentLevel = currentPercentage;

    while (currentLevel < targetPercentage) {
      const nextThreshold = currentLevel <= 50 ? Math.min(50, targetPercentage) :
                          currentLevel <= 80 ? Math.min(80, targetPercentage) :
                          targetPercentage;
      
      const energyForThisPhase = (batteryCapacity * (nextThreshold - currentLevel)) / 100;
      const efficiencyFactor = getEfficiencyFactor(currentLevel);
      
      const timeForPhase = (energyForThisPhase / (chargingPower * efficiencyFactor)) * 60;
      totalMinutes += timeForPhase;
      
      currentLevel = nextThreshold;
    }

    return Math.round(totalMinutes);
  };

  const minutes = calculateChargingTime();
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return (
    <View style={styles.container}>
      <Clock size={16} color={colors.primary} />
      <Text style={styles.time}>
        {hours > 0 ? `${hours}h ${remainingMinutes}min` : `${minutes}min`}
        <Text style={styles.percentage}> hasta {targetPercentage}%</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.primary,
  },
  percentage: {
    color: colors.primary,
  },
});