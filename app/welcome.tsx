import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, CircleAlert as AlertCircle, ChevronRight } from 'lucide-react-native';
import { colors, shadows } from './constants/colors';
import { saveUserPreferences, supabase, getUserPreferences } from './utils/supabase';
import { VehicleSelector } from '@/components/VehicleSelector';
import { LocationPermission } from '@/components/LocationPermission';
import * as Location from 'expo-location';

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

export default function WelcomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [step, setStep] = useState<'auth' | 'preferences' | 'location'>('auth');
  const [validationErrors, setValidationErrors] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;

      if (session?.user) {
        const preferences = await getUserPreferences();
        if (preferences?.vehicle_id) {
          // Check location permission before redirecting
          const { status } = await Location.getForegroundPermissionsAsync();
          if (status === 'granted') {
            router.replace('/(tabs)/stations');
          } else {
            setStep('location');
          }
        } else {
          setStep('preferences');
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // If there's a session error, we stay on the auth screen
      setStep('auth');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const errors = {
      email: !validateEmail(email),
      password: !validatePassword(password),
    };
    setValidationErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      setError('Por favor, corrige los errores en el formulario.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('weak_password')) {
          setError('La contraseña debe tener al menos 6 caracteres.');
        } else if (error.message.includes('email')) {
          setError('El correo electrónico no es válido.');
        } else {
          setError('Error al crear la cuenta. Por favor, intenta de nuevo.');
        }
        return;
      }
      
      setStep('preferences');
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Error al crear la cuenta. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      setError('Por favor, corrige los errores en el formulario.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Correo electrónico o contraseña incorrectos.');
        } else {
          setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
        }
        return;
      }

      // After successful sign in, check user preferences
      const preferences = await getUserPreferences();
      if (preferences?.vehicle_id) {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          router.replace('/(tabs)/stations');
        } else {
          setStep('location');
        }
      } else {
        setStep('preferences');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleContinue = async () => {
    if (!selectedVehicle) {
      setError('Por favor, selecciona un vehículo para continuar.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await saveUserPreferences({
        vehicleId: selectedVehicle.id,
        vehicleName: `${selectedVehicle.brand} ${selectedVehicle.model}`,
        connectorType: selectedVehicle.connector_type,
        batteryCapacity: selectedVehicle.battery_capacity.toString(),
      });
      
      setStep('location');
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Error al guardar las preferencias. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationPermission = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        router.replace('/(tabs)/stations');
      } else {
        setError('Se necesita acceso a la ubicación para continuar.');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setError('Error al solicitar permisos de ubicación.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 'auth') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (step === 'location') {
    return (
      <View style={styles.container}>
        <LocationPermission onRequestPermission={handleLocationPermission} />
      </View>
    );
  }

  if (step === 'auth') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800' }}
            style={styles.heroImage}
          />
          <View style={styles.headerContent}>
            <Text style={styles.title}>Bienvenido a EcoCarga</Text>
            <Text style={styles.subtitle}>
              Inicia sesión o crea una cuenta para comenzar
            </Text>
          </View>
        </View>

        <View style={styles.authForm}>
          {error && (
            <View style={styles.errorContainer}>
              <AlertCircle size={20} color={colors.status.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={[
            styles.inputContainer,
            validationErrors.email && styles.inputError
          ]}>
            <Mail size={20} color={validationErrors.email ? colors.status.error : colors.text.secondary} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setValidationErrors(prev => ({ ...prev, email: false }));
                setError(null);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          {validationErrors.email && (
            <Text style={styles.validationError}>
              Ingresa un correo electrónico válido
            </Text>
          )}

          <View style={[
            styles.inputContainer,
            validationErrors.password && styles.inputError
          ]}>
            <Lock size={20} color={validationErrors.password ? colors.status.error : colors.text.secondary} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setValidationErrors(prev => ({ ...prev, password: false }));
                setError(null);
              }}
              secureTextEntry
            />
          </View>
          {validationErrors.password && (
            <Text style={styles.validationError}>
              La contraseña debe tener al menos 6 caracteres
            </Text>
          )}

          <TouchableOpacity
            style={[styles.authButton, loading && styles.authButtonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.authButtonText}>
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.authButton,
              styles.signUpButton,
              loading && styles.authButtonDisabled
            ]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={[styles.authButtonText, styles.signUpButtonText]}>
              {loading ? 'Cargando...' : 'Crear Cuenta'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800' }}
            style={styles.heroImage}
          />
          <View style={styles.headerContent}>
            <Text style={styles.title}>Selecciona tu Vehículo</Text>
            <Text style={styles.subtitle}>
              Elige tu vehículo eléctrico para personalizar tu experiencia
            </Text>
          </View>
        </View>

        {error && (
          <View style={[styles.errorContainer, { marginHorizontal: 20 }]}>
            <AlertCircle size={20} color={colors.status.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <VehicleSelector
          onSelect={handleVehicleSelect}
          selectedVehicleId={selectedVehicle?.id}
        />

        {selectedVehicle && (
          <View style={styles.selectedVehicleInfo}>
            <Text style={styles.infoTitle}>Vehículo Seleccionado</Text>
            <Text style={styles.infoDetail}>
              {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year})
            </Text>
            <Text style={styles.infoSpec}>
              Batería: {selectedVehicle.battery_capacity} kWh
            </Text>
            <Text style={styles.infoSpec}>
              Autonomía: {selectedVehicle.range_km} km
            </Text>
            <Text style={styles.infoSpec}>
              Potencia de Carga: {selectedVehicle.charging_power} kW
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedVehicle || loading) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedVehicle || loading}
        >
          <Text style={styles.continueButtonText}>
            {loading ? 'Guardando...' : 'Continuar'}
          </Text>
          {!loading && <ChevronRight color={colors.text.inverse} size={24} />}
        </TouchableOpacity>
      </View>
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
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  authForm: {
    padding: 20,
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    height: 56,
  },
  inputError: {
    borderColor: colors.status.error,
    backgroundColor: `${colors.status.error}10`,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text.primary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${colors.status.error}10`,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.status.error,
  },
  validationError: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.status.error,
    marginTop: -12,
    marginLeft: 16,
  },
  authButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text.inverse,
  },
  signUpButton: {
    backgroundColor: colors.background.surface,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  signUpButtonText: {
    color: colors.primary,
  },
  selectedVehicleInfo: {
    margin: 20,
    padding: 16,
    backgroundColor: colors.background.surface,
    borderRadius: 12,
    ...shadows.medium,
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.primary,
    marginBottom: 12,
  },
  infoDetail: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 8,
  },
  infoSpec: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadows.medium,
  },
  continueButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.8,
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: colors.text.inverse,
    fontSize: 16,
  },
});