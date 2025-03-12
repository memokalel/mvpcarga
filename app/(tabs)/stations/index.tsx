import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Search, Star, Zap, CreditCard } from 'lucide-react-native';
import { StatusLight } from '@/components/StatusLight';
import { colors, shadows } from '../../constants/colors';
import { supabase } from '@/app/utils/supabase';
import { calculateDistance, formatDistance, getCurrentLocation } from '@/app/utils/distance';
import { LocationPermission } from '@/components/LocationPermission';
import * as Location from 'expo-location';

type Station = {
  id: string;
  name: string;
  address: string;
  rating: number;
  power_kw: number;
  status: 'available' | 'waiting' | 'unavailable';
  waitTime?: number;
  images: string[];
  latitude: number;
  longitude: number;
  distance?: string;
  price_per_kwh: number;
  connectors: string[];
};

function StationCard({ station }: { station: Station }) {
  const router = useRouter();
  
  const defaultImage = 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop&q=80';
  
  return (
    <TouchableOpacity 
      style={[styles.stationCard, shadows.medium]}
      onPress={() => router.push(`/stations/${station.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: station.images?.[0] || defaultImage }} 
          style={styles.stationImage} 
        />
        <View style={styles.statusOverlay}>
          <StatusLight status={station.status} showLabel />
          {station.status === 'waiting' && station.waitTime && (
            <View style={styles.waitTimeContainer}>
              <Text style={styles.waitTime}>
                ~{station.waitTime} min espera
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.stationName}>{station.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.accent} />
            <Text style={styles.rating}>{station.rating || 4.5}</Text>
          </View>
        </View>

        <View style={styles.addressRow}>
          <MapPin size={14} color={colors.text.light} />
          <Text style={styles.stationAddress}>{station.address}</Text>
          {station.distance && (
            <Text style={styles.distance}>{station.distance}</Text>
          )}
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Zap size={20} color={colors.primary} />
            <Text style={styles.infoValue}>{station.power_kw}kW</Text>
          </View>
          <View style={styles.infoItem}>
            <CreditCard size={20} color={colors.accent} />
            <Text style={styles.price}>${station.price_per_kwh}/kWh</Text>
          </View>
        </View>

        <View style={styles.connectorsRow}>
          {station.connectors?.map((connector, index) => (
            <View key={index} style={styles.connectorTag}>
              <Text style={styles.connectorText}>{connector}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function StationsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    checkLocationAndLoadStations();
  }, []);

  const checkLocationAndLoadStations = async () => {
    try {
      setLoading(true);
      setError(null);

      const location = await getCurrentLocation();
      if (!location) {
        setLocationPermission(false);
        return;
      }

      setLocationPermission(true);
      setUserLocation(location);

      // Fetch stations from Supabase
      const { data: stationsData, error: stationsError } = await supabase
        .from('charging_stations')
        .select(`
          *,
          station_connectors (
            connector_type
          )
        `);

      if (stationsError) throw stationsError;

      // Process stations data
      const processedStations = stationsData.map(station => ({
        ...station,
        connectors: station.station_connectors.map((c: any) => c.connector_type),
        distance: formatDistance(calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          station.latitude,
          station.longitude
        ))
      }));

      // Sort by distance
      processedStations.sort((a, b) => {
        const distA = parseFloat(a.distance.replace('km', '').replace('m', ''));
        const distB = parseFloat(b.distance.replace('km', '').replace('m', ''));
        return distA - distB;
      });

      setStations(processedStations);
    } catch (err) {
      console.error('Error loading stations:', err);
      setError('No se pudieron cargar las estaciones');
    } finally {
      setLoading(false);
    }
  };

  const visibleStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (locationPermission === false) {
    return <LocationPermission onRequestPermission={checkLocationAndLoadStations} />;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando estaciones cercanas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cargadores cerca de ti</Text>
        <View style={styles.searchContainer}>
          <Search size={18} color={colors.text.light} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar estaciones..."
            placeholderTextColor={colors.text.light}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={checkLocationAndLoadStations}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.stationList}>
          {visibleStations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </ScrollView>
      )}
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.status.error,
    textAlign: 'center',
    marginBottom: 16,
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
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.main,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.primary,
  },
  stationList: {
    padding: 16,
  },
  stationCard: {
    backgroundColor: colors.background.surface,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  stationImage: {
    width: '100%',
    height: '100%',
  },
  statusOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background.surface + 'E6',
  },
  waitTimeContainer: {
    backgroundColor: colors.background.main,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  waitTime: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.status.warning,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background.main,
    padding: 6,
    borderRadius: 8,
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.text.primary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stationAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  distance: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.primary,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background.main,
    padding: 12,
    borderRadius: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.primary,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.accent,
  },
  connectorsRow: {
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
    fontSize: 14,
    color: colors.text.primary,
  },
});