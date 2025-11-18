import React from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface WorkoutCompletedModalProps {
  visible: boolean;
  onClose: () => void;
  workoutLabel?: string;
}

const WorkoutCompletedModal = ({
  visible,
  onClose,
  workoutLabel,
}: WorkoutCompletedModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <Pressable
          android_disableSound
          onPress={onClose}
          className="w-full h-full absolute"
        />
        <View className="bg-primary w-11/12 rounded-3xl items-center py-8 px-6 shadow-2xl">
         
          <View className="w-24 h-24 bg-stronggreen rounded-full justify-center items-center mb-4">
            <FontAwesome5 name="trophy" size={48} color="#2d5016" />
          </View>

          <Text className="text-3xl font-rbold text-textcolor mb-2">
            Parabéns!
          </Text>

          <Text className="text-base font-rregular text-secondary text-center mb-6">
            Você completou o treino {workoutLabel || ""}! Continue assim e
            alcance seus objetivos.
          </Text>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="w-full py-4 bg-stronggreen rounded-full items-center"
          >
            <Text className="text-textcolor font-rbold text-lg">Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default WorkoutCompletedModal;
