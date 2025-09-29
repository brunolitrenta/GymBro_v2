import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { workoutData } from "@/datasets/exercises";

type ExerciseLog = {
    id: string;
    load: string;
    sets: string;
    restTime: string;
    notes: string;
    createdAt: string;
};

const imagePlaceholder = require("@/assets/images/partial-react-logo.png");

const ExercisePage = () => {
    const params = useLocalSearchParams<{
        id?: string;
        exercise?: string;
    }>();

    const exerciseId = useMemo(() => {
        if (params?.id) {
            const parsed = Number(params.id);
            return Number.isNaN(parsed) ? undefined : parsed;
        }

        if (params?.exercise) {
            try {
                const parsed = JSON.parse(params.exercise);
                if (typeof parsed === "number") return parsed;
                const asNumber = Number(parsed);
                return Number.isNaN(asNumber) ? undefined : asNumber;
            } catch (error) {
                return undefined;
            }
        }

        return undefined;
    }, [params?.exercise, params?.id]);

    const exerciseData = useMemo(
        () => workoutData.find((item) => item.id === exerciseId),
        [exerciseId]
    );
    const teste = "xablau";
    const [loadIsActive, setLoadIsActive] = useState(false);
    const [setsIsActive, setSetsIsActive] = useState(false);
    const [restTimeIsActive, setRestTimeIsActive] = useState(false);
    const [notesIsActive, setNotesIsActive] = useState(false);

    const [load, setLoad] = useState(teste);
    const [sets, setSets] = useState("");
    const [restTime, setRestTime] = useState("");
    const [notes, setNotes] = useState("");
    const [logs, setLogs] = useState<ExerciseLog[]>([]);

    const isSaveDisabled = !load.trim() || !sets.trim() || !restTime.trim();

    const handleSaveLog = () => {
        
    };

    if (!exerciseData) {
        return (
            <SafeAreaView className="flex-1 bg-primary justify-center items-center">
                <Text className="text-textcolor font-rbold text-xl mb-4">
                    Exercício não encontrado
                </Text>
                <TouchableOpacity
                    className="bg-secondary px-6 py-3 rounded-2xl"
                    onPress={() => router.back()}
                >
                    <Text className="text-white font-rsemi text-lg">Voltar</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
            >
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: 32,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="px-6 pt-6">
                        <View className="flex-row items-center justify-between mb-8">
                            <TouchableOpacity
                                className="h-12 w-12 items-center justify-center bg-lightgreen rounded-full"
                                activeOpacity={0.7}
                                onPress={() => router.back()}
                            >
                                <FontAwesome6 name="arrow-left" size={20} color="black" />
                            </TouchableOpacity>
                            <Text className="font-rbold text-2xl text-textcolor flex-1 text-center">
                                {exerciseData.exercicio}
                            </Text>
                            <View className="h-12 w-12" />
                        </View>

                        <View className="bg-lightgreen rounded-3xl p-4 mb-6">
                            <Image
                                source={imagePlaceholder}
                                resizeMode="contain"
                                className="w-full h-48 rounded-2xl"
                            />
                            <View className="mt-4">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-textcolor font-rsemi">
                                        Grupo Muscular
                                    </Text>
                                    <Text className="text-textcolor font-rsemi">
                                        {exerciseData.bp}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-textcolor font-rsemi">Foco</Text>
                                    <Text className="text-textcolor font-rsemi">
                                        {exerciseData.tipoDeMusculo}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-textcolor font-rsemi">Séries</Text>
                                    <Text className="text-textcolor font-rsemi">
                                        {exerciseData.series} x {exerciseData.repeticoesPorSerie}
                                    </Text>
                                </View>
                            </View>
                        </View>



                        <View className="bg-white rounded-3xl p-6 shadow shadow-black/10 mb-6">
                            <Text className="text-textcolor font-rbold text-lg mb-4">
                                Registrar desempenho
                            </Text>

                            <View className="flex-row justify-between mb-4">
                                <View className='w-[45%]'>
                                    <Text className="text-gray-600 font-rregular mb-2">
                                        Carga (kg)
                                    </Text>
                                    <View className='flex-row justify-between items-center'>
                                        <TextInput
                                            value={load}
                                            onChangeText={setLoad}
                                            placeholder="Ex: 50"
                                            editable={loadIsActive}
                                            placeholderTextColor="#9CA3AF"
                                            keyboardType="numeric"
                                            className="h-14 w-[76%] bg-lightgreen/40 rounded-2xl px-4 text-lg font-rregular"
                                        />
                                        <TouchableOpacity>
                                            <FontAwesome6 name="pen" size={32} color="#000000ff" onPress={() => setLoadIsActive(true)}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View className="w-[45%]">
                                    <Text className="text-gray-600 font-rregular mb-2">
                                        Séries x repetições
                                    </Text>
                                    <View className='flex-row justify-between items-center'>
                                        <TextInput
                                            value={sets}
                                            onChangeText={setSets}
                                            editable={setsIsActive}
                                            placeholder="Ex: 4 x 10"
                                            placeholderTextColor="#9CA3AF"
                                            keyboardType="numeric"
                                            className="h-14 w-[76%] bg-lightgreen/40 rounded-2xl px-4 text-lg font-rregular"
                                        />
                                        <TouchableOpacity>
                                            <FontAwesome6 name="pen" size={32} color="#000000ff" onPress={() => setSetsIsActive(true)}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-600 font-rregular mb-2">
                                    Descanso (min)
                                </Text>
                                <View className='flex-row justify-between items-center'>
                                    <TextInput
                                        value={restTime}
                                        onChangeText={setRestTime}
                                        editable={restTimeIsActive}
                                        placeholder="Ex: 01:30"
                                        placeholderTextColor="#9CA3AF"
                                        className="h-14 w-[90%] bg-lightgreen/40 rounded-2xl px-4 text-lg font-rregular"
                                    />
                                    <TouchableOpacity>
                                        <FontAwesome6 name="pen" size={32} color="#000000ff" onPress={() => setRestTimeIsActive(true)}/>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-600 font-rregular mb-2">
                                    Anotações gerais
                                </Text>
                                <View className='flex-row justify-between items-center'>
                                    <TextInput
                                        value={notes}
                                        onChangeText={setNotes}
                                        editable={notesIsActive}
                                        placeholder="Registre detalhes importantes do treino"
                                        placeholderTextColor="#9CA3AF"
                                        multiline
                                        numberOfLines={2}
                                        className="bg-lightgreen/40 w-[90%] rounded-2xl px-4 py-3 text-lg font-rregular min-h-[60px]"
                                    />
                                    <TouchableOpacity onPress={() => { }}>
                                        <FontAwesome6 name="pen" size={32} color="#000000ff" onPress={() => setNotesIsActive(true)}/>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                disabled={isSaveDisabled}
                                onPress={handleSaveLog}
                                className={`flex-row items-center justify-center h-14 rounded-2xl ${isSaveDisabled ? "bg-grayish opacity-50" : "bg-secondary"
                                    }`}
                            >
                                <MaterialCommunityIcons
                                    name="content-save"
                                    size={24}
                                    color="white"
                                    style={{ marginRight: 8 }}
                                />
                                <Text className="text-white font-rsemi text-lg">Salvar anotação</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ExercisePage;