import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { colors, shadows } from '../app/constants/colors';

type LocationPermissionProps = {
  onRequestPermission: () => void;
};

export function LocationPermission({ onRequestPermission }: LocationPermissionProps) {
  return (
    <View style={styles.container}>
      <MapPin size={48} color={colors.primary} />
      <Text style={styles.title}>Ubicación necesaria</Text>
      <Text style={styles.description}>
        Necesitamos acceso a tu ubicación para mostrarte los cargadores más cercanos y brindarte una mejor experiencia.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onRequestPermission}>
        <Text style={styles.buttonText}>Permitir acceso</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    borderRadius: 16,
    margin: 16,
    ...shadows.medium,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    color: colors.text.inverse,
    fontSize: 16,
  },
});