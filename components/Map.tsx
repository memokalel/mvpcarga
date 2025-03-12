import { Platform, StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface MapProps {
  latitude: number;
  longitude: number;
  title?: string;
}

export default function Map({ latitude, longitude, title }: MapProps) {
  if (Platform.OS === 'web') {
    return <WebMap latitude={latitude} longitude={longitude} title={title} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          title={title}
        />
      </MapView>
    </View>
  );
}

function WebMap({ latitude, longitude, title }: MapProps) {
  return (
    <View style={styles.container}>
      <View style={styles.webMapContainer}>
        <Text style={styles.fallbackText}>
          Map view is not available in this environment
        </Text>
        {title && <Text style={styles.titleText}>{title}</Text>}
        <Text style={styles.coordsText}>
          Latitude: {latitude}, Longitude: {longitude}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webMapContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fallbackText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  titleText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 8,
  },
  coordsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
});