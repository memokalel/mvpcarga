import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export async function saveUserPreferences(preferences: {
  connectorType: string;
  batteryCapacity: string;
  vehicleName?: string;
  vehicleId?: string;
}) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('Auth error:', authError);
    throw new Error('No authenticated user');
  }

  const { error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email!,
      connector_type: preferences.connectorType,
      battery_capacity: preferences.batteryCapacity,
      vehicle_name: preferences.vehicleName,
      vehicle_id: preferences.vehicleId,
    }, {
      onConflict: 'id'
    });

  if (error) {
    console.error('Supabase error:', error);
    throw new Error('Failed to save preferences');
  }
}

export async function getUserPreferences() {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('No authenticated user');
    }

    // First check if the user exists in the users table
    const { data: userExists, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking user existence:', checkError);
      throw new Error('Failed to check user existence');
    }

    // If user doesn't exist yet, return null
    if (!userExists) {
      return null;
    }

    // Get user preferences with vehicle information
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

    if (error) {
      console.error('Error fetching user preferences:', error);
      throw new Error('Failed to get preferences');
    }

    return data;
  } catch (err) {
    console.error('Error in getUserPreferences:', err);
    throw err;
  }
}