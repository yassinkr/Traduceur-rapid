import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StorageService } from '@/services/storage';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        const activation = await StorageService.getActivation();
        
        if (activation) {
          // User is activated, go to main app
          router.replace('/(tabs)/translator');
        } else {
          // User is not activated, go to activation screen
          router.replace('/activation');
        }
      } catch (error) {
        console.error('Error in index redirect:', error);
        // Default to activation screen on error
        router.replace('/activation');
      }
    };

    checkAndRedirect();
  }, []);

  // Show loading spinner while redirecting
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}