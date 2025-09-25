import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/authContext';

const Index = () => {
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoggedIn, isLoading]);

  return (
    <View className="flex-1 bg-primary" />
  );
};

export default Index;
