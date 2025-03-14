import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Progress = () => {
  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 items-center justify-center bg-primary"
    >
      <Text className="text-3xl font-rregular">Progresso</Text>
    </SafeAreaView>
  );
};

export default Progress;
