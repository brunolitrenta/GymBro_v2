import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { WorkoutContextProvider } from "@/hooks/workoutContext";
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
    <WorkoutContextProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true }} />
        <Stack.Screen name="workout/[label]" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true }} />
        <Stack.Screen name="exercise/[id]" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true }} />
        <Stack.Screen name="modals/creditsModal" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true, presentation: "transparentModal", animation: "fade" }} />
        <Stack.Screen name="modals/addWorkoutModal" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true, presentation: "transparentModal", animation: "fade" }} />
        <Stack.Screen name="modals/workoutOptionsModal" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true, presentation: "transparentModal", animation: "fade" }} />
        <Stack.Screen name="calendar" options={{ headerShown: false, statusBarTranslucent: true, navigationBarHidden: true }} />
      </Stack>
    </WorkoutContextProvider>
  );
};

export default RootLayout;