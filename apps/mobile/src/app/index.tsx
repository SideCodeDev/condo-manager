import { Button, Dropdown, TabContent, TabItem, Tabs } from "@condo-manager/ui";
import { BillingOverview } from "@/components/billing-overview";
import { OrganizationGate } from "@/components/organization-gate";
import { useAuth, useClerk } from "@clerk/expo";
import { useHostedAuth } from "@clerk/expo/hosted-auth";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View } from "react-native-css/components";

const dropdownOptions = [
  { value: "building-a", label: "Edifício A" },
  { value: "building-b", label: "Edifício B" },
  { value: "building-c", label: "Edifício C" },
];

export default function HomeScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { startHostedAuth } = useHostedAuth();
  const [building, setBuilding] = useState("building-a");
  const [authError, setAuthError] = useState<string | null>(null);

  const handleHostedAuth = async (mode: "sign-in" | "sign-up") => {
    setAuthError(null);

    try {
      await startHostedAuth({ mode });
    } catch {
      setAuthError("Não foi possível iniciar a autenticação. Tenta novamente.");
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!isSignedIn) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <Text className="text-2xl font-bold">Condo Manager</Text>
          <Text className="text-center font-p-1">
            Inicia sessão para continuares para a aplicação.
          </Text>
          <Button onPress={() => void handleHostedAuth("sign-in")}>
            Iniciar sessão
          </Button>
          <Button
            variant="secondary"
            onPress={() => void handleHostedAuth("sign-up")}
          >
            Criar conta
          </Button>
          {authError ? (
            <Text className="text-center text-red-600">{authError}</Text>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerClassName="w-full grow items-center gap-6 p-6">
        <Text className="text-2xl font-bold">Condo Manager</Text>
        <Button loading>HELLO WORLD</Button>

        <Dropdown
          className="w-full"
          id="building-dropdown"
          label="Condomínio"
          onChange={setBuilding}
          options={dropdownOptions}
          popupLabel="Selecionar condomínio"
          value={building}
        />

        <Tabs variant="chip" initialValue="home">
          <TabItem value="home">Home</TabItem>
          <TabItem value="profile">Profile</TabItem>
          <TabItem value="settings">Settings</TabItem>
          <TabContent value="home">
            <Text>Home Content</Text>
          </TabContent>
          <TabContent value="profile">
            <Text>Profile Content</Text>
          </TabContent>
          <TabContent value="settings">
            <Text>Settings Content</Text>
          </TabContent>
        </Tabs>
        <OrganizationGate>
          <Button variant="secondary" onPress={() => void signOut()}>
            Terminar sessão
          </Button>
          <BillingOverview />
        </OrganizationGate>
      </ScrollView>
    </SafeAreaView>
  );
}
