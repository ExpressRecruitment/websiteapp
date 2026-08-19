import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from '@expo-google-fonts/montserrat';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors, fonts } from '@/constants/theme';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontFamily: fonts.semiBold },
          headerBackTitle: '',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="jobs/index" options={{ title: 'Vacancies' }} />
        <Stack.Screen name="jobs/[id]/index" options={{ title: 'Job details' }} />
        <Stack.Screen name="jobs/[id]/apply" options={{ title: 'Apply' }} />
        <Stack.Screen name="hire" options={{ title: 'Looking to hire' }} />
        <Stack.Screen name="timesheet" options={{ title: 'Submit a timesheet' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
