import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Car, BatteryCharging, Settings, Bell, LogOut, Battery, MapPin, Zap, Clock } from 'lucide-react-native';
import { colors, shadows } from '../constants/colors';
import { supabase } from '../utils/supabase';
import { useRouter } from 'expo-router';

type VehicleInfo = {
  connector_type: string | null;
  battery_capacity: string | null;
  vehicle_name: string | null;
  vehicle_id: string | null;
  vehicles: {
    brand: string;
    model: string;
    year: number;
    battery_capacity: number;
    connector_type: string;
    range_km: number;
    charging_power: number;
  } | null;
};

const connectorTypeLabels = {
  ccs2: 'CCS2',
  chademo: 'CHAdeMO',
  type2: 'Type 2',
};

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);

  useEffect(() => {
    loadVehicleInfo();
  }, []);

  const loadVehicleInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/welcome');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select(`
          connector_type,
          battery_capacity,
          vehicle_name,
          vehicle_id,
          vehicles (
            brand,
            model,
            year,
            battery_capacity,
            connector_type,
            range_km,
            charging_power
          )
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setVehicleInfo(data);
    } catch (err) {
      console.error('Error loading vehicle info:', err);
      setError('No se pudo cargar la información del vehículo');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session exists, just redirect to welcome screen
        router.replace('/welcome');
        return;
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        if (error.message.includes('session_not_found')) {
          // If session not found, just redirect to welcome screen
          router.replace('/welcome');
          return;
        }
        throw error;
      }

      // Successfully signed out, redirect to welcome screen
      router.replace('/welcome');
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando información del vehículo...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Vehículo Eléctrico</Text>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={loadVehicleInfo}
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : vehicleInfo?.vehicles ? (
          <View style={styles.vehicleInfo}>
            <Car size={32} color={colors.primary} />
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleName}>
                {vehicleInfo.vehicles.brand} {vehicleInfo.vehicles.model} ({vehicleInfo.vehicles.year})
              </Text>
              
              <View style={styles.specsList}>
                <View style={styles.specItem}>
                  <Battery size={16} color={colors.text.secondary} />
                  <Text style={styles.specText}>
                    Batería: {vehicleInfo.vehicles.battery_capacity} kWh
                  </Text>
                </View>

                <View style={styles.specItem}>
                  <BatteryCharging size={16} color={colors.text.secondary} />
                  <Text style={styles.specText}>
                    Conector: {connectorTypeLabels[vehicleInfo.vehicles.connector_type as keyof typeof connectorTypeLabels]}
                  </Text>
                </View>

                <View style={styles.specItem}>
                  <Zap size={16} color={colors.text.secondary} />
                  <Text style={styles.specText}>
                    Potencia de Carga: {vehicleInfo.vehicles.charging_power} kW
                  </Text>
                </View>

                <View style={styles.specItem}>
                  <MapPin size={16} color={colors.text.secondary} />
                  <Text style={styles.specText}>
                    Autonomía: {vehicleInfo.vehicles.range_km} km
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noVehicleContainer}>
            <Car size={48} color={colors.text.secondary} />
            <Text style={styles.noVehicleText}>
              No hay información del vehículo disponible
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/vehicle-settings')}
        >
          <BatteryCharging size={24} color={colors.primary} />
          <Text style={styles.menuText}>Cambiar Vehículo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('/charging-history')}
        >
          <Clock size={24} color={colors.primary} />
          <Text style={styles.menuText}>Historial de Cargas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Bell size={24} color={colors.primary} />
          <Text style={styles.menuText}>Notificaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Settings size={24} color={colors.primary} />
          <Text style={styles.menuText}>Preferencias</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleSignOut}
        disabled={loading}
      >
        <LogOut size={20} color={colors.text.inverse} />
        <Text style={styles.logoutText}>
          {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.main,
    padding: 20,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 12,
  },
  header: {
    padding: 24,
    backgroundColor: colors.background.surface,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.text.primary,
    marginBottom: 24,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background.surface,
    padding: 16,
    borderRadius: 12,
    ...shadows.medium,
  },
  vehicleDetails: {
    marginLeft: 16,
    flex: 1,
  },
  vehicleName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: 12,
  },
  specsList: {
    gap: 12,
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
  noVehicleContainer: {
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    padding: 24,
    borderRadius: 12,
    gap: 12,
    ...shadows.medium,
  },
  noVehicleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: `${colors.status.error}10`,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
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
  section: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 20,
    backgroundColor: colors.status.error,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    color: colors.text.inverse,
    fontSize: 16,
  },
});