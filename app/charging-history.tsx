import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, MapPin, Zap, CreditCard } from 'lucide-react-native';
import { colors, shadows } from './constants/colors';

const mockHistory = [
  {
    id: '1',
    stationName: 'Estación Central Oaxaca',
    address: 'Av. Universidad 123, Centro',
    date: '2024-02-20',
    startTime: '14:30',
    duration: '45 min',
    energyDelivered: '32.5 kWh',
    cost: '$150 MXN',
    powerUsed: '150 kW',
  },
  {
    id: '2',
    stationName: 'Plaza Oaxaca',
    address: 'Blvd. Guelaguetza 456',
    date: '2024-02-18',
    startTime: '10:15',
    duration: '30 min',
    energyDelivered: '25.0 kWh',
    cost: '$100 MXN',
    powerUsed: '50 kW',
  },
];

export default function ChargingHistoryScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Cargas</Text>
        <Text style={styles.subtitle}>
          Registro de tus sesiones de carga anteriores
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {mockHistory.map((session) => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <Text style={styles.stationName}>{session.stationName}</Text>
              <Text style={styles.date}>{session.date}</Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={16} color={colors.text.secondary} />
              <Text style={styles.address}>{session.address}</Text>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Clock size={16} color={colors.primary} />
                <View>
                  <Text style={styles.detailLabel}>Duración</Text>
                  <Text style={styles.detailValue}>{session.duration}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Zap size={16} color={colors.primary} />
                <View>
                  <Text style={styles.detailLabel}>Energía</Text>
                  <Text style={styles.detailValue}>{session.energyDelivered}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <CreditCard size={16} color={colors.primary} />
                <View>
                  <Text style={styles.detailLabel}>Costo</Text>
                  <Text style={styles.detailValue}>{session.cost}</Text>
                </View>
              </View>
            </View>

            <View style={styles.timeInfo}>
              <Text style={styles.timeText}>
                Inicio: {session.startTime} • {session.powerUsed}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  header: {
    padding: 20,
    backgroundColor: colors.background.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.secondary,
  },
  content: {
    padding: 16,
  },
  sessionCard: {
    backgroundColor: colors.background.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...shadows.medium,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  address: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.main,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.text.secondary,
  },
  detailValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.text.primary,
  },
  timeInfo: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
  },
});