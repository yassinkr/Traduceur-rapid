// app/_layout.tsx
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { StorageService } from '@/services/storage';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  useFrameworkReady();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    const checkActivation = async () => {
      try {
        const activation = await StorageService.getActivation();
        // const activation = null; // For testing - uncomment this line to test activation flow
        
        setIsActivated(!!activation);
        setIsReady(true);
      } catch (error) {
        console.error('Error checking activation:', error);
        setIsActivated(false);
        setIsReady(true);
      }
    };

    checkActivation();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!isActivated && !inAuthGroup) {
      // Not activated and not on activation screen → redirect to activation
      router.replace('/activation');
    } else if (isActivated && inAuthGroup) {
      // Activated but on activation screen → redirect to main app
      router.replace('/(tabs)/translator');
    }
  }, [isReady, isActivated, segments]);

  if (!isReady) {
    // Show splash or loader while checking activation
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="activation" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}