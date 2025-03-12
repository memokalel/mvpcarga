import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  MapPin, 
  Star, 
  Clock, 
  Battery, 
  Zap, 
  CreditCard, 
  Calendar, 
  Coffee, 
  Wifi, 
  Car, 
  Bath, 
  Shield, 
  ChevronDown,
  TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle2,
  Clock4,
  WifiOff 
} from 'lucide-react-native';
import { StatusLight } from '@/components/StatusLight';
import { colors } from '../../constants/colors';
import { supabase } from '@/app/utils/supabase';

// Cache para almacenar las estaciones ya cargadas
const stationsCache = new Map();

type Station = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'available' | 'waiting' | 'unavailable';
  total_connectors: number;
  available_connectors: number;
  power_kw: number;
  price_per_kwh: number;
  images: string[];
  station_connectors: {
    connector_type: string;
    power_kw: number;
    status: string;
  }[];
};

const defaultImage = 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop&q=80';

export default function StationDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [station, setStation] = useState<Station | null>(() => stationsCache.get(id) || null);
  const [loading, setLoading] = useState(!stationsCache.has(id));
  const [error, setError] = useState<string | null>(null);
  const [userVehicle, setUserVehicle] = useState<any>(null);

  useEffect(() => {
    if (!stationsCache.has(id)) {
      loadStationDetails();
    }
    loadUserVehicle();
  }, [id]);

  const loadStationDetails = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace('/welcome');
        return;
      }

      const { data, error } = await supabase
        .from('charging_stations')
        .select(`
          *,
          station_connectors (
            connector_type,
            power_kw,
            status
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        setError(
          error.message.includes('JSON object requested') 
            ? 'Estación no encontrada'
            : 'Error al cargar la información'
        );
        return;
      }

      if (!data) {
        setError('No se encontró la estación');
        return;
      }

      // Guardar en caché y actualizar estado
      stationsCache.set(id, data);
      setStation(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar la información');
    } finally {
      setLoading(false);
    }
  };

  const loadUserVehicle = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('users')
        .select(`
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
        .eq('id', session.user.id)
        .single();

      if (error) return;
      if (data?.vehicles) {
        setUserVehicle(data.vehicles);
      }
    } catch (error) {
      console.error('Error loading user vehicle:', error);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
        >
          <ChevronDown size={24} color={colors.primary} />
        </TouchableOpacity>

        {loading ? (
          <View style={styles.contentContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando información...</Text>
          </View>
        ) : error ? (
          <View style={styles.contentContainer}>
            {error.includes('conexión') ? (
              <WifiOff size={48} color={colors.status.error} />
            ) : (
              <AlertTriangle size={48} color={colors.status.error} />
            )}
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={loadStationDetails}
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : station ? (
          <>
            <ScrollView style={styles.scrollView}>
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: station.images?.[0] || defaultImage }} 
                  style={styles.image}
                />
                <View style={styles.imageOverlay}>
                  <StatusLight status={station.status} size={16} showLabel={true} />
                </View>
              </View>
              
              <View style={styles.content}>
                <Text style={styles.name}>{station.name}</Text>
                
                <View style={styles.infoRow}>
                  <MapPin size={16} color={colors.text.light} />
                  <Text style={styles.address}>{station.address}</Text>
                </View>

                <View style={styles.statsContainer}>
                  <View style={styles.stat}>
                    <Star size={16} color={colors.accent} />
                    <Text style={[styles.statText, { color: colors.accent }]}>
                      4.8
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Zap size={16} color={colors.primary} />
                    <Text style={[styles.statText, { color: colors.primary }]}>
                      {station.power_kw}kW
                    </Text>
                  </View>
                  {userVehicle && (
                    <View style={styles.stat}>
                      <Clock size={16} color={colors.primary} />
                      <ChargingTimeCalculator />
                    </View>
                  )}
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Precio por kWh</Text>
                  <Text style={styles.priceValue}>${station.price_per_kwh}/kWh</Text>
                </View>

                <Text style={styles.description}>
                  Estación de carga rápida ubicada en una zona estratégica. Contamos con personal capacitado y todas las comodidades para hacer tu experiencia de carga más placentera.
                </Text>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Conectores Disponibles</Text>
                  <Text style={styles.availabilityText}>
                    {station.available_connectors} de {station.total_connectors} disponibles
                  </Text>
                  <View style={styles.connectorsList}>
                    {station.station_connectors.map((connector, index) => (
                      <View key={index} style={styles.connectorTag}>
                        <Text style={styles.connectorText}>
                          {connector.connector_type.toUpperCase()}
                          <Text style={styles.connectorPower}>{' • '}{connector.power_kw}kW</Text>
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Amenidades</Text>
                  <View style={styles.amenitiesList}>
                    <View style={styles.amenityItem}>
                      <Coffee size={16} color={colors.text.secondary} />
                      <Text style={styles.amenityText}>Cafetería</Text>
                    </View>
                    <View style={styles.amenityItem}>
                      <Wifi size={16} color={colors.text.secondary} />
                      <Text style={styles.amenityText}>WiFi Gratis</Text>
                    </View>
                    <View style={styles.amenityItem}>
                      <Car size={16} color={colors.text.secondary} />
                      <Text style={styles.amenityText}>Estacionamiento Techado</Text>
                    </View>
                    <View style={styles.amenityItem}>
                      <Bath size={16} color={colors.text.secondary} />
                      <Text style={styles.amenityText}>Baños</Text>
                    </View>
                    <View style={styles.amenityItem}>
                      <Shield size={16} color={colors.text.secondary} />
                      <Text style={styles.amenityText}>Seguridad 24/7</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Horario</Text>
                  <View style={styles.infoRow}>
                    <Calendar size={16} color={colors.text.light} />
                    <Text style={styles.scheduleText}>24/7</Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Métodos de Pago</Text>
                  <View style={styles.paymentMethodsList}>
                    {['Tarjeta de Crédito', 'Débito', 'PayPal', 'Apple Pay', 'Google Pay'].map((method, index) => (
                      <View key={index} style={styles.paymentMethodTag}>
                        <CreditCard size={14} color={colors.primary} />
                        <Text style={styles.paymentMethodText}>{method}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {userVehicle && (
                  <View style={styles.compatibilitySection}>
                    <Text style={styles.sectionTitle}>Tu Vehículo</Text>
                    <View style={styles.vehicleInfo}>
                      <Text style={styles.vehicleName}>
                        {userVehicle.brand} {userVehicle.model} ({userVehicle.year})
                      </Text>
                      <Text style={styles.vehicleSpecs}>
                        Conector: {userVehicle.connector_type.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={[
                styles.reserveButton,
                station.status === 'unavailable' && styles.reserveButtonDisabled
              ]}
              onPress={() => router.push('/reservation')}
              disabled={station.status === 'unavailable'}
            >
              <Text style={styles.reserveButtonText}>
                {station.status === 'available' 
                  ? 'Reservar Cargador' 
                  : station.status === 'waiting'
                  ? 'Unirse a la Cola'
                  : 'No Disponible'}
              </Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.background.modal,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.surface,
    marginTop: '15%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.surface,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 12,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.status.error,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    fontFamily: 'Inter-SemiBold',
    color: colors.text.inverse,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background.surface + 'E6',
  },
  content: {
    padding: 20,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: colors.text.primary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  address: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.background.main,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  priceContainer: {
    backgroundColor: colors.background.main,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.secondary,
  },
  priceValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.accent,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.primary,
    marginBottom: 12,
  },
  availabilityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  connectorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  connectorTag: {
    backgroundColor: colors.background.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  connectorText: {
    fontFamily: 'Inter-Regular',
    color: colors.primary,
    fontSize: 14,
  },
  connectorPower: {
    color: colors.text.secondary,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background.main,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: '45%',
  },
  amenityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
  },
  scheduleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 8,
  },
  paymentMethodsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  paymentMethodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  paymentMethodText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.primary,
  },
  compatibilitySection: {
    backgroundColor: colors.background.main,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  vehicleInfo: {
    gap: 8,
  },
  vehicleName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text.primary,
  },
  vehicleSpecs: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
  },
  reserveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  reserveButtonDisabled: {
    backgroundColor: colors.border,
  },
  reserveButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: colors.text.inverse,
    fontSize: 16,
  },
});
