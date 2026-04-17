import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { COLORS } from '../../src/styles/Colors';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: COLORS.primary, 
      tabBarInactiveTintColor: COLORS.textLight,
      headerShown: false,
      tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 10, backgroundColor: COLORS.card, borderTopColor: COLORS.border }
    }}>
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" size={28} color={color} /> }} />
      <Tabs.Screen name="treinos" options={{ title: 'Treinos', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="dumbbell" size={28} color={color} /> }} />
      <Tabs.Screen name="dieta" options={{ title: 'Sincronizar', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="robot-outline" size={28} color={color} /> }} />
      <Tabs.Screen name="ajustes" options={{ title: 'Ajustes', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cog" size={28} color={color} /> }} />
    </Tabs>
  );
}