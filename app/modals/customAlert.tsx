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
      <View className="w-5/6 gap-3 mt-2">
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
            className={`w-full py-4 rounded-full items-center ${
              act.style === "destructive" ? "bg-red-500" : "bg-stronggreen"
            }`}
          >
            <Text className="text-textcolor font-rbold text-lg">{act.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-transparent">
        <Pressable android_disableSound onPress={onClose} className="w-full h-full absolute"/>
        <View className="bg-primary w-11/12 rounded-2xl items-center py-6 gap-4 absolute shadow-lg shadow-stone-950">
          <View className="w-20 h-20 bg-lightgreen rounded-full justify-center items-center mb-2">
            <FontAwesome6 name={iconName} size={36} color="#364033" />
          </View>

          <Text className="text-2xl font-rbold text-textcolor">{title}</Text>
          <Text className="text-base font-rregular text-secondary text-center px-6">{message}</Text>

          {renderActions()}
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
