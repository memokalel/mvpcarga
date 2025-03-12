import * as Location from 'expo-location';

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Haversine formula for calculating distance between two points on Earth
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    // If less than 1 km, show in meters
    return `${Math.round(distance * 1000)}m`;
  }
  // If more than 1 km, show in km with one decimal
  return `${distance.toFixed(1)}km`;
}

export async function getCurrentLocation(): Promise<Location.LocationObject | null> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      if (newStatus !== 'granted') {
        return null;
      }
    }

    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}