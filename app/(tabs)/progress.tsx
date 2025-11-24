import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useAuth } from "@/hooks/authContext";
import api from "@/utils/axiosConfig";
import { LineChart } from "@/components/LineChart";
import { CustomPicker } from "@/components/CustomPicker";

type ExerciseLogPoint = {
  weight: number;
  date: Date;
};

const resolveLogsArray = (raw: any): any[] => {
  if (!raw) {
    return [];
  }

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return resolveLogsArray(parsed);
    } catch (error) {
      return [];
    }
  }

  if (Array.isArray(raw)) {
    return raw;
  }

  if (typeof raw === "object") {
    const candidateKeys = [
      "logs",
      "items",
      "results",
      "entries",
      "data",
      "records",
    ];

    for (const key of candidateKeys) {
      const value = raw[key];
      const resolved = resolveLogsArray(value);
      if (resolved.length > 0) {
        return resolved;
      }
    }

    for (const value of Object.values(raw)) {
      const resolved = resolveLogsArray(value);
      if (resolved.length > 0) {
        return resolved;
      }
    }
  }

  return [];
};

const Progress = () => {
  const { userId } = useAuth();
  const [progressData, setProgressData] = useState<any>(null);
  const [weightHistoryPoints, setWeightHistoryPoints] = useState<number[]>([]);
  const [weightHistoryLabels, setWeightHistoryLabels] = useState<string[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);
  const [progressSummary, setProgressSummary] = useState<string | null>(null);
  const [exerciseLogsByName, setExerciseLogsByName] = useState<
    Record<string, ExerciseLogPoint[]>
  >({});
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [logsError, setLogsError] = useState<string | null>(null);
  const chartWidth = Dimensions.get("window").width - 80;

  useFocusEffect(
    useCallback(() => {
      const fetchProgressData = async () => {
        if (!userId) return;

        try {
          setIsLoadingProgress(true);
          setProgressError(null);
          setLogsError(null);

          const [progressResponse, logsResponse] = await Promise.all([
            api.get(`/users/progress/${userId}`),
            api.get(`/users/progress/logs/${userId}`),
          ]);

          const progress = progressResponse.data?.data;
          const logs = logsResponse.data?.data;

          setProgressData(progress);

          const logsArray = resolveLogsArray(logs);

          const parseToNumber = (value: unknown): number | null => {
            if (typeof value === "number" && Number.isFinite(value)) {
              return value;
            }
            if (typeof value === "string") {
              const normalized = value.replace(",", ".").trim();
              if (!normalized) {
                return null;
              }
              const parsed = Number.parseFloat(normalized);
              return Number.isFinite(parsed) ? parsed : null;
            }
            return null;
          };

          const extractWeightValue = (entry: any): number | null => {
            if (!entry || typeof entry !== "object") {
              return null;
            }

            const candidates: unknown[] = [
              entry?.weight,
              entry?.weightKg,
              entry?.loadKg,
              entry?.load,
              entry?.kg,
              entry?.value,
              entry?.workoutExercise?.weight,
              entry?.workoutExercise?.weightKg,
              entry?.workoutExercise?.loadKg,
              entry?.sessionExercise?.weight,
              entry?.sessionExercise?.weightKg,
              entry?.metrics?.weight,
              entry?.metrics?.weightKg,
            ];

            const setsCollections = [
              entry?.sets,
              entry?.sessionSets,
              entry?.workoutSets,
              entry?.exerciseSets,
              entry?.performedSets,
            ];

            setsCollections.forEach((collection) => {
              if (Array.isArray(collection)) {
                collection.forEach((setItem) => {
                  candidates.push(setItem?.weight);
                  candidates.push(setItem?.weightKg);
                  candidates.push(setItem?.load);
                  candidates.push(setItem?.loadKg);
                });
              }
            });

            for (const candidate of candidates) {
              const parsed = parseToNumber(candidate);
              if (parsed !== null) {
                return parsed;
              }
            }

            return null;
          };

          const extractDateValue = (entry: any): Date | null => {
            if (!entry || typeof entry !== "object") {
              return null;
            }

            // Tenta buscar a data de várias propriedades possíveis
            const candidateValues = [
              entry?.session?.startedAt,
              entry?.workoutExercise?.createdAt,
              entry?.workoutExercise?.updatedAt,
              entry?.createdAt,
            ];

            for (const rawValue of candidateValues) {
              if (!rawValue) continue;
              const parsedDate = new Date(rawValue);
              if (!Number.isNaN(parsedDate.getTime())) {
                return parsedDate;
              }
            }

            return null;
          };

          const groupedLogs: Record<string, ExerciseLogPoint[]> = {};

          logsArray.forEach((entry: any) => {
            const rawExerciseDef = entry?.workoutExercise?.exerciseDef;
            const exerciseName =
              rawExerciseDef?.name ??
              rawExerciseDef?.title ??
              rawExerciseDef?.label ??
              rawExerciseDef?.displayName ??
              entry?.workoutExercise?.name ??
              entry?.exerciseName ??
              entry?.name ??
              entry?.workoutExerciseId;
            if (!exerciseName) {
              return;
            }

            const weightValue = extractWeightValue(entry);

            if (
              weightValue === null ||
              !Number.isFinite(weightValue) ||
              weightValue < 0
            ) {
              return;
            }

            const parsedDate = extractDateValue(entry);

            if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
              return;
            }

            const sanitizedWeight = Number(weightValue.toFixed(2));

            if (!groupedLogs[exerciseName]) {
              groupedLogs[exerciseName] = [];
            }

            groupedLogs[exerciseName].push({
              weight: sanitizedWeight,
              date: parsedDate,
            });
          });

          Object.keys(groupedLogs).forEach((name) => {
            groupedLogs[name].sort(
              (a, b) => a.date.getTime() - b.date.getTime()
            );
          });

          const groupedNames = Object.keys(groupedLogs).sort((a, b) =>
            a.localeCompare(b, "pt-BR", { sensitivity: "base" })
          );

          setExerciseLogsByName(groupedLogs);
          setSelectedExercise((previous) => {
            if (previous && groupedLogs[previous]) {
              return previous;
            }
            return groupedNames.length > 0 ? groupedNames[0] : null;
          });

          const historyEntries = Array.isArray(progress?.weightHistory)
            ? [...progress.weightHistory]
            : [];

          const sanitizedHistory = historyEntries
            .map((entry) => {
              const rawWeight = entry?.weightKg;
              const rawDate = entry?.date || entry?.createdAt;
              const weight =
                typeof rawWeight === "number"
                  ? rawWeight
                  : parseFloat(rawWeight ?? "");
              const parsedDate = rawDate ? new Date(rawDate) : null;
              return {
                weight,
                date: parsedDate,
              };
            })
            .filter(
              (item) =>
                item.date instanceof Date &&
                !Number.isNaN(item.date.getTime()) &&
                typeof item.weight === "number" &&
                !Number.isNaN(item.weight)
            )
            .sort(
              (a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0)
            );

          const weights = sanitizedHistory.map((item) =>
            Number(item.weight.toFixed(2))
          );
          const labels = sanitizedHistory.map((item) =>
            item.date
              ? new Intl.DateTimeFormat("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                }).format(item.date)
              : ""
          );

          setWeightHistoryPoints(weights);
          setWeightHistoryLabels(labels);

          const goal = progress?.goal;
          const supportedGoal =
            goal === "muscle_gain" || goal === "weight_loss";

          let summary: string | null = null;

          if (supportedGoal) {
            if (weights.length >= 2) {
              const startWeight = weights[0];
              const latestWeight = weights[weights.length - 1];
              const diff = Number((latestWeight - startWeight).toFixed(2));
              const diffAbs = Math.abs(diff).toFixed(2);

              if (goal === "muscle_gain") {
                if (diff > 0) {
                  summary = `+${diffAbs} kg desde a primeira medição.`;
                } else if (diff < 0) {
                  summary = `-${diffAbs} kg desde a primeira medição.`;
                } else {
                  summary = "Sem variação de peso até agora.";
                }
              } else if (goal === "weight_loss") {
                if (diff < 0) {
                  summary = `-${diffAbs} kg desde a primeira medição.`;
                } else if (diff > 0) {
                  summary = `+${diffAbs} kg desde a primeira medição.`;
                } else {
                  summary = "Sem variação de peso até agora.";
                }
              }
            } else if (weights.length === 1) {
              summary =
                "Registre uma nova medição para visualizar a tendência.";
            } else {
              summary = "Ainda não existem medições registradas.";
            }
          }

          setProgressSummary(summary);
        } catch (error) {
          console.error("Erro ao buscar dados de progresso:", error);
          setProgressError("Não foi possível carregar o progresso corporal.");
          setLogsError("Não foi possível carregar os registros de treino.");
          setWeightHistoryPoints([]);
          setWeightHistoryLabels([]);
          setProgressSummary(null);
          setExerciseLogsByName({});
          setSelectedExercise(null);
        }
        setIsLoadingProgress(false);
      };

      fetchProgressData();
    }, [userId])
  );

  const goal = progressData?.goal;
  const isGoalSupported = goal === "muscle_gain" || goal === "weight_loss";
  const goalLabel =
    goal === "muscle_gain"
      ? "Ganho de massa muscular"
      : goal === "weight_loss"
      ? "Emagrecimento"
      : undefined;
  const hasWeightHistory = weightHistoryPoints.length > 0 && isGoalSupported;
  const invertChart = goal === "weight_loss";

  const exerciseNames = useMemo(
    () =>
      Object.keys(exerciseLogsByName).sort((a, b) =>
        a.localeCompare(b, "pt-BR", { sensitivity: "base" })
      ),
    [exerciseLogsByName]
  );

  const exercisePickerItems = useMemo(
    () => exerciseNames.map((name) => ({ label: name, value: name })),
    [exerciseNames]
  );

  const exerciseChartData = useMemo(() => {
    if (!selectedExercise) {
      return { points: [] as number[], labels: [] as string[] };
    }

    const entries = exerciseLogsByName[selectedExercise] ?? [];
    if (entries.length === 0) {
      return { points: [] as number[], labels: [] as string[] };
    }

    const formatter = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });

    return {
      points: entries.map((entry) => entry.weight),
      labels: entries.map((entry) => formatter.format(entry.date)),
    };
  }, [selectedExercise, exerciseLogsByName]);

  const hasExerciseHistory = exerciseChartData.points.length > 0;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-primary">
      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 mb-6">
          <Text className="font-rbold text-4xl color-textcolor">Progresso</Text>
          <View className="h-1 w-16 bg-darkgreen rounded-full mt-2" />
        </View>

        <View className="px-6 mb-6">
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 bg-white rounded-3xl p-5 shadow-md">
              <View className="bg-darkgreen/10 w-12 h-12 rounded-2xl items-center justify-center mb-3">
                <FontAwesome6 name="dumbbell" size={20} color="#D5D962" />
              </View>
              <Text className="text-secondary/60 font-rregular text-xs mb-1">
                TREINOS
              </Text>
              <Text className="text-secondary font-rbold text-3xl">
                {progressData?.monthSessionsCount || 0}
              </Text>
              <Text className="text-secondary/60 font-rregular text-xs mt-1">
                este mês
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-3xl p-5 shadow-md">
              <View className="bg-darkgreen/10 w-12 h-12 rounded-2xl items-center justify-center mb-3">
                <FontAwesome6 name="fire" size={20} color="#D5D962" />
              </View>
              <Text className="text-secondary/60 font-rregular text-xs mb-1">
                SEQUÊNCIA
              </Text>
              <Text className="text-secondary font-rbold text-3xl">
                {progressData?.currentStreak || 0}
              </Text>
              <Text className="text-secondary/60 font-rregular text-xs mt-1">
                dias seguidos
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 mb-6">
          <Text className="text-secondary font-rbold text-xl mb-3">
            Evolução corporal
          </Text>
          <View className="bg-white rounded-3xl overflow-hidden shadow-md">
            <View className="bg-lightgreen/30 p-4 items-center justify-center">
              {isLoadingProgress ? (
                <ActivityIndicator size="small" color="#364033" />
              ) : progressError ? (
                <Text className="text-secondary/60 font-rregular text-sm text-center">
                  {progressError}
                </Text>
              ) : !progressData ? (
                <Text className="text-secondary/60 font-rregular text-sm text-center">
                  Não encontramos dados de progresso.
                </Text>
              ) : !isGoalSupported ? (
                <Text className="text-secondary font-rregular text-sm text-center">
                  Atualize seu objetivo nos dados pessoais para acompanhar o
                  progresso.
                </Text>
              ) : hasWeightHistory ? (
                <LineChart
                  data={weightHistoryPoints}
                  labels={weightHistoryLabels}
                  width={chartWidth}
                  height={220}
                  xLabel="Data"
                  yLabel="Peso (kg)"
                  invertYAxis={invertChart}
                  showDataPoints
                />
              ) : (
                <Text className="text-secondary/60 font-rregular text-sm text-center">
                  Registre novos pesos para visualizar sua evolução.
                </Text>
              )}
            </View>
            <View className="p-5 flex-row items-center justify-between bg-white">
              <View className="flex-1 pr-3">
                <Text className="font-rbold text-base text-secondary">
                  {goalLabel
                    ? `Objetivo: ${goalLabel}`
                    : "Objetivo não definido"}
                </Text>
                <Text className="font-rregular text-sm text-secondary/60 mt-1">
                  {progressSummary ||
                    (isGoalSupported
                      ? "Aguarde novas medições para gerar insights."
                      : "Atualize seu perfil para acompanhar este gráfico.")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6">
          <Text className="text-secondary font-rbold text-xl mb-3">
            Progressão por exercício
          </Text>
          <View className="bg-white rounded-3xl shadow-md overflow-hidden">
            <View className="px-6 pt-6 pb-4 border-b border-secondary/10">
              <Text className="text-secondary/60 font-rregular text-xs mb-3">
                SELECIONE UM EXERCÍCIO
              </Text>
              {isLoadingProgress ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#364033" />
                  <Text className="text-secondary/60 font-rregular text-sm ml-3">
                    Carregando exercícios...
                  </Text>
                </View>
              ) : exerciseNames.length > 0 ? (
                <CustomPicker
                  items={exercisePickerItems}
                  selectedValue={selectedExercise}
                  onValueChange={(value) => setSelectedExercise(value)}
                  placeholder="Selecione um exercício"
                  emptyMessage="Nenhum exercício disponível"
                />
              ) : logsError ? (
                <Text className="text-secondary/60 font-rregular text-sm">
                  {logsError}
                </Text>
              ) : (
                <Text className="text-secondary/60 font-rregular text-sm">
                  Registre seus treinos para acompanhar a evolução dos
                  exercícios.
                </Text>
              )}
            </View>
            <View className="bg-lightgreen/30 px-6 py-6 items-center justify-center">
              {isLoadingProgress ? (
                <ActivityIndicator size="small" color="#364033" />
              ) : logsError ? (
                <Text className="text-secondary/60 font-rregular text-sm text-center">
                  {logsError}
                </Text>
              ) : exerciseNames.length === 0 ? (
                <Text className="text-secondary/60 font-rregular text-sm text-center">
                  Registre seus treinos para visualizar este gráfico.
                </Text>
              ) : !selectedExercise || !hasExerciseHistory ? (
                <Text className="text-secondary/60 font-rregular text-sm text-center">
                  Selecione um exercício com registros para ver a progressão de
                  carga.
                </Text>
              ) : (
                <View className="w-full items-center">
                  <Text className="text-secondary font-rbold text-base mb-4 text-center">
                    {selectedExercise}
                  </Text>
                  <LineChart
                    data={exerciseChartData.points}
                    labels={exerciseChartData.labels}
                    width={chartWidth}
                    height={220}
                    xLabel="Data"
                    yLabel="Carga (kg)"
                    showDataPoints
                  />
                </View>
              )}
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Progress;
