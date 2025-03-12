import { Tabs } from 'expo-router';
import { BatteryCharging, CircleUser as UserCircle, LifeBuoy } from 'lucide-react-native';
import { Platform } from 'react-native';
import { colors, shadows } from '../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.light,
        tabBarStyle: {
          backgroundColor: colors.background.surface,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 34 : 8,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            },
            android: {
              elevation: 2,
            },
            default: {
              boxShadow: '0 -2px 6px rgba(0, 0, 0, 0.1)',
            },
          }),
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Regular',
          fontSize: 12,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="stations"
        options={{
          title: 'Estaciones',
          tabBarIcon: ({ color, size }) => (
            <BatteryCharging size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <UserCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Ayuda',
          tabBarIcon: ({ color, size }) => (
            <LifeBuoy size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}