import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "#00000065",
        tabBarStyle: { backgroundColor: "#D6D984", height: "7%" },
        tabBarButton: (props) => <TouchableOpacity {...(props as React.ComponentProps<typeof TouchableOpacity>)} />
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name="house" color={color} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIconStyle: {
            marginTop: "10%",
          },
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: "Planos",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name="dumbbell" color={color} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIconStyle: {
            marginTop: "10%",
          },
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progresso",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="chart-line" color={color} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIconStyle: {
            marginTop: "10%",
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={24} name="user-large" color={color} />
          ),
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIconStyle: {
            marginTop: "10%",
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
