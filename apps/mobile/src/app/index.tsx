import { Button } from "@condo-manager/ui";
import { useClerk } from "@clerk/expo";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text } from "react-native-css/components";

export default function HomeScreen() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerClassName="w-full grow gap-6 p-6">
        <Text className="text-2xl font-bold">Condo Manager</Text>
        <Text className="text-neutral-600">
          Comece por criar um condomínio.
        </Text>
        <Button className="w-full" onPress={() => router.push("/condo/new")}>
          Criar condomínio
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          onPress={() => void signOut()}
        >
          Terminar sessão
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
