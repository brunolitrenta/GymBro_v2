import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { WorkoutContextProvider } from "@/hooks/workoutContext";
import { AuthContextProvider } from "@/hooks/authContext";
import "../global.css";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {

  const [fontsLoaded, error] = useFonts({
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf")
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();

  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <AuthContextProvider>
      <WorkoutContextProvider>
  {/* Root StatusBar will not force style so modals can override with light */}
  <StatusBar translucent backgroundColor="transparent" style="auto" />
        <Stack
          screenOptions={{
            statusBarTranslucent: true,
            statusBarBackgroundColor: "transparent",
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true, statusBarStyle: 'auto' }} />
          <Stack.Screen name="register" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true, statusBarStyle: 'auto' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true, statusBarStyle: 'auto' }} />
          <Stack.Screen name="workout/[label]" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true, statusBarStyle: 'auto' }} />
          <Stack.Screen name="exercise/[id]" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true, statusBarStyle: 'auto' }} />
          <Stack.Screen name="modals/creditsModal" options={{ headerShown: false, statusBarTranslucent: true, statusBarBackgroundColor: "transparent", statusBarStyle: 'light', navigationBarHidden: true, presentation: "transparentModal", animation: "fade", contentStyle: { backgroundColor: "transparent" } }} />
          <Stack.Screen name="modals/addWorkoutModal" options={{ headerShown: false, statusBarTranslucent: true, statusBarBackgroundColor: "transparent", statusBarStyle: 'light', navigationBarHidden: true, presentation: "transparentModal", animation: "fade", contentStyle: { backgroundColor: "transparent" } }} />
          <Stack.Screen name="modals/workoutOptionsModal" options={{ headerShown: false, statusBarTranslucent: true, statusBarBackgroundColor: "transparent", statusBarStyle: 'light', navigationBarHidden: true, presentation: "transparentModal", animation: "fade", contentStyle: { backgroundColor: "transparent" } }} />
          <Stack.Screen name="calendar" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true, statusBarStyle: 'auto' }} />
          <Stack.Screen name="profileOptions" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true, statusBarStyle: 'auto' }} />
          <Stack.Screen name="studentsManagement" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true, statusBarStyle: 'auto' }} />
          <Stack.Screen name="index" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true, statusBarStyle: 'auto' }} />
        </Stack>
      </WorkoutContextProvider>
    </AuthContextProvider>
  );
};

export default RootLayout;