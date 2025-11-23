import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { AuthContextProvider } from "@/hooks/authContext";
import { LoadingProvider, useLoading } from "@/hooks/loadingContext";
import { setLoadingHandler } from "@/utils/axiosConfig";
import Toast from "react-native-toast-message";
import "../global.css";

SplashScreen.preventAutoHideAsync();

const LoadingSetup = ({ children }: { children: React.ReactNode }) => {
  const { setLoading } = useLoading();

  useEffect(() => {
    // Configura o handler do axios para controlar o loading globalmente
    setLoadingHandler(setLoading);
  }, [setLoading]);

  return <>{children}</>;
};

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <LoadingProvider>
      <AuthContextProvider>
        <LoadingSetup>
            <StatusBar translucent backgroundColor="transparent" style="auto" />
            <Stack>
              <Stack.Screen
                name="user/login"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                }}
              />
              <Stack.Screen
                name="user/register"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                }}
              />
              <Stack.Screen
                name="workout/[label]"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                }}
              />
              <Stack.Screen
                name="plan/[name]"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                }}
              />
              <Stack.Screen
                name="exercise/[id]"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                }}
              />
              <Stack.Screen
                name="modals/credits"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="modals/createPlan"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="modals/createWorkout"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="modals/workoutOptions"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="modals/planOptions"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="modals/logoutConfirmation"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="modals/workoutDetails"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="modals/workoutCompleted"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="modals/createStudent"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="modals/medicalConditions"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="modals/sharePlan"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="modals/customAlert"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                  presentation: "transparentModal",
                  animation: "fade",
                  contentStyle: { backgroundColor: "transparent" },
                }}
              />
              <Stack.Screen
                name="calendar"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                }}
              />
              <Stack.Screen
                name="profileOptions"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                }}
              />
              <Stack.Screen
                name="studentsManagement"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                }}
              />
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                }}
              />
              <Stack.Screen
                name="help"
                options={{
                  headerShown: false,
                  navigationBarHidden: true,
                }}
              />
            </Stack>
            <Toast />
          </LoadingSetup>
      </AuthContextProvider>
    </LoadingProvider>
  );
};

export default RootLayout;
