import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { StorageService } from '@/services/storage';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  useFrameworkReady();
  const router = useRouter();
  const segments = useSegments() as string[];
  const [isReady, setIsReady] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const [hasNavigated, setHasNavigated] = useState(false);

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
    if (!isReady || hasNavigated) return;

    const targetRoute = isActivated ? '/(tabs)/translator' : '/activation';
    const currentRoute = segments.join('/') || '';
    
    // Only navigate if we're not already on the target route
    const shouldNavigate = isActivated 
      ? !segments.includes('(tabs)') 
      : segments[0] !== 'activation';

    if (shouldNavigate) {
      setHasNavigated(true);
      // Single navigation attempt with a small delay
      const timer = setTimeout(() => {
        router.replace(targetRoute);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isReady, isActivated, segments, hasNavigated]);

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