import React from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

interface AlertAction {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  iconName?: string;
  actions?: AlertAction[];
}

const CustomAlert = ({
  visible,
  title,
  message,
  onClose,
  iconName = "triangle-exclamation",
  actions,
}: CustomAlertProps) => {
  const renderActions = () => {
    const items = actions && actions.length > 0 ? actions : [{ text: "Entendi" }];

    return (
      <View className="w-full gap-3">
        {items.map((act, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              try {
                act.onPress && act.onPress();
              } catch (e) {
                // ignore
              }
              onClose();
            }}
            activeOpacity={0.7}
            className={`w-full py-4 rounded-2xl items-center ${
              act.style === "destructive" 
                ? "bg-red-500" 
                : act.style === "cancel" 
                ? "bg-secondary/10" 
                : "bg-darkgreen"
            }`}
          >
            <Text className={`font-rbold text-base ${
              act.style === "destructive" || act.style === "default" && !act.style 
                ? "text-white" 
                : act.style === "cancel"
                ? "text-secondary"
                : "text-white"
            }`}>
              {act.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50">
        <Pressable android_disableSound onPress={onClose} className="w-full h-full absolute"/>
        <View className="bg-white w-11/12 rounded-3xl py-8 px-6 shadow-2xl">
          <View className="items-center mb-6">
            <View className="bg-darkgreen/10 w-20 h-20 rounded-3xl justify-center items-center mb-4">
              <FontAwesome6 name={iconName} size={36} color="#D5D962" />
            </View>
            <Text className="text-2xl font-rbold text-secondary mb-2">{title}</Text>
            <Text className="text-base font-rregular text-secondary/60 text-center px-2">{message}</Text>
          </View>

          {renderActions()}
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
