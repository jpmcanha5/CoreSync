import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAppStore } from '../src/store/useAppStore';

export default function RootLayout() {
  const { isAuthenticated } = useAppStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário está na pasta das Tabs ou no Login/Registro
    const inTabsGroup = segments[0] === '(tabs)';

    if (isAuthenticated && !inTabsGroup) {
      // Se está logado mas não está nas tabs, manda para a Home
      router.replace('/(tabs)');
    } else if (!isAuthenticated && inTabsGroup) {
      // Se não está logado mas tentou entrar nas tabs, manda para o Login
      router.replace('/');
    }
  }, [isAuthenticated, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}