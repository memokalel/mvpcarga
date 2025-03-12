import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Car, Battery, Zap, MapPin } from 'lucide-react-native';
import { colors, shadows } from '@/app/constants/colors';
import { supabase } from '@/app/utils/supabase';

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  battery_capacity: number;
  connector_type: string;
  range_km: number;
  charging_power: number;
};

type VehicleSelectorProps = {
  onSelect: (vehicle: Vehicle) => void;
  selectedVehicleId?: string | null;
};

export function VehicleSelector({ onSelect, selectedVehicleId }: VehicleSelectorProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('brand', { ascending: true });

      if (error) throw error;
      setVehicles(data);
    } catch (err) {
      console.error('Error loading vehicles:', err);
      setError('No se pudieron cargar los vehículos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando vehículos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadVehicles}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu Vehículo</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {vehicles.map((vehicle) => (
          <TouchableOpacity
            key={vehicle.id}
            style={[
              styles.vehicleCard,
              selectedVehicleId === vehicle.id && styles.selectedCard,
            ]}
            onPress={() => onSelect(vehicle)}
          >
            <Car 
              size={32} 
              color={selectedVehicleId === vehicle.id ? colors.primary : colors.text.secondary} 
            />
            
            <View style={styles.vehicleInfo}>
              <Text style={styles.brand}>{vehicle.brand}</Text>
              <Text style={styles.model}>{vehicle.model}</Text>
              <Text style={styles.year}>{vehicle.year}</Text>
            </View>

            <View style={styles.specs}>
              <View style={styles.specItem}>
                <Battery size={16} color={colors.text.secondary} />
                <Text style={styles.specText}>{vehicle.battery_capacity} kWh</Text>
              </View>

              <View style={styles.specItem}>
                <Zap size={16} color={colors.text.secondary} />
                <Text style={styles.specText}>{vehicle.charging_power} kW</Text>
              </View>

              <View style={styles.specItem}>
                <MapPin size={16} color={colors.text.secondary} />
                <Text style={styles.specText}>{vehicle.range_km} km</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.status.error,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.status.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.text.inverse,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: colors.text.primary,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  vehicleCard: {
    backgroundColor: colors.background.surface,
    borderRadius: 16,
    padding: 16,
    width: 220,
    alignItems: 'center',
    ...shadows.medium,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.primary,
  },
  vehicleInfo: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  brand: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
  },
  model: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text.primary,
    marginTop: 2,
  },
  year: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  specs: {
    width: '100%',
    gap: 8,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  specText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
  },
});