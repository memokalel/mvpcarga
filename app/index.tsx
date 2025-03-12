import { Redirect } from 'expo-router';
import { supabase } from './utils/supabase';

export default function Index() {
  // Redirigir a la pantalla de bienvenida por defecto
  return <Redirect href="/(tabs)/stations" />;
}