import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAuth } from "@/hooks/authContext";
import api from "@/utils/axiosConfig";
import { eventEmitter } from "@/utils/eventEmitter";

interface Student {
  studentEmail: string;
  trainerId: string;
  createdAt: string;
  nickname: string | null;
  student: {
    id: string;
    name: string;
    email: string;
    type: string;
    medical: string | null;
    gender: string | null;
    birthDate: string | null;
    goal: string | null;
    height: number | null;
    weight: number | null;
    workoutDays: any[];
  };
}

const SharePlan = () => {
  const { planId, planName } = useLocalSearchParams();
  const { userId } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = async () => {
    if (!userId) {
      console.log("UserId não definido");
      return;
    }

    try {
      const response = await api.get(`/users/relation/${userId}`);
      const data = response.data?.data || response.data || [];

      if (Array.isArray(data) && data.length > 0) {
        setStudents(data);
      } else {
        console.log("Nenhum aluno encontrado ou dados inválidos");
        setStudents([]);
      }
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      setStudents([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchStudents();
      }
    }, [userId])
  );

  useEffect(() => {
    const handleAlertConfirm = (data: any) => {
      const { action } = data;
      if (
        (action === "confirmShareWithMedical" || action === "confirmShare") &&
        selectedStudent
      ) {
        sharePlanToStudent(selectedStudent);
      }
    };

    eventEmitter.on("customAlertConfirm", handleAlertConfirm);
    return () => eventEmitter.off("customAlertConfirm", handleAlertConfirm);
  }, [selectedStudent]);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);

    if (student.student.medical) {
      router.push({
        pathname: "/modals/customAlert",
        params: {
          title: "Atenção",
          message: `O aluno ${student.student.name} possui condições médicas registradas: "${student.student.medical}". Deseja mesmo encaminhar o plano?`,
          iconName: "heart-pulse",
          confirmText: "Encaminhar mesmo assim",
          cancelText: "Cancelar",
          action: "confirmShareWithMedical",
        },
      });
    } else {
      router.push({
        pathname: "/modals/customAlert",
        params: {
          title: "Confirmar Encaminhamento",
          message: `Deseja encaminhar este plano de treino para ${student.student.name}?`,
          iconName: "share",
          confirmText: "Encaminhar",
          cancelText: "Cancelar",
          action: "confirmShare",
        },
      });
    }
  };

  const sharePlanToStudent = async (student: Student) => {
    try {
      console.log("Compartilhando plano:", {
        trainerId: userId,
        studentId: student.student.id,
        studentEmail: student.student.email,
        planId: planId,
      });

      await api.post("/workout/plan/share", {
        trainerId: userId,
        studentId: student.student.id,
        studentEmail: student.student.email,
        planId: planId,
      });

      console.log("Plano compartilhado com sucesso");
      router.back();
    } catch (error) {
      console.error("Erro ao encaminhar plano:", error);
    }
  };

  const renderStudent = ({ item }: { item: Student }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm active:bg-secondary/5"
      onPress={() => handleSelectStudent(item)}
    >
      <View className="flex-row items-center">
        <View className="bg-darkgreen/10 w-12 h-12 rounded-xl items-center justify-center mr-3">
          <FontAwesome6 name="user" size={20} color="#D5D962" />
        </View>
        <View className="flex-1">
          <Text className="text-secondary font-rsemi text-base">
            {item.student.name}
          </Text>
          <Text className="text-secondary/60 font-rregular text-sm">
            {item.student.email}
          </Text>
        </View>
        {item.student.medical && (
          <View className="bg-red-500/10 w-10 h-10 rounded-xl items-center justify-center mr-2">
            <FontAwesome6 name="heart-pulse" size={18} color="#EF4444" />
          </View>
        )}
        <View className="bg-darkgreen/10 w-10 h-10 rounded-xl items-center justify-center">
          <FontAwesome6 name="arrow-right" size={18} color="#D5D962" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 justify-center items-center bg-black/50">
      <Pressable
        android_disableSound
        onPress={() => router.back()}
        className="h-full w-full absolute"
      />
      <View className="w-11/12 h-4/5 bg-primary rounded-3xl p-6 shadow-2xl">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-1">
            <Text className="font-rbold text-2xl text-secondary mb-1">
              Encaminhar Plano
            </Text>
            <Text className="font-rregular text-sm text-secondary/60">
              {planName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-secondary/10 w-10 h-10 rounded-2xl items-center justify-center"
          >
            <FontAwesome6 name="xmark" size={20} color="#2D3748" />
          </TouchableOpacity>
        </View>

        {students.length === 0 ? (
          <View className="bg-white rounded-3xl p-8 shadow-md items-center">
            <View className="bg-darkgreen/10 w-20 h-20 rounded-3xl justify-center items-center mb-4">
              <FontAwesome6 name="users" size={32} color="#D5D962" />
            </View>
            <Text className="text-secondary font-rbold text-xl mb-2">
              Nenhum Aluno
            </Text>
            <Text className="text-secondary/60 font-rregular text-sm text-center">
              Você ainda não possui alunos vinculados para encaminhar este plano
            </Text>
          </View>
        ) : (
          <>
            <Text className="text-secondary/60 font-rregular text-sm mb-3">
              Selecione o aluno para encaminhar o plano:
            </Text>
            <FlatList
              data={students}
              renderItem={renderStudent}
              keyExtractor={(item) => item.student.id}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default SharePlan;
