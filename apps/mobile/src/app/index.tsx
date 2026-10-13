import { Button, Dropdown, TabContent, TabItem, Tabs } from "@condo-manager/ui";
import { BillingOverview } from "@/components/billing-overview";
import { OrganizationGate } from "@/components/organization-gate";
import { useAuth, useClerk } from "@clerk/expo";
import { useHostedAuth } from "@clerk/expo/hosted-auth";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!isSignedIn) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.authContainer}>
          <Text style={styles.title}>Condo Manager</Text>
          <Text style={styles.description}>
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
          {authError ? <Text style={styles.error}>{authError}</Text> : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Condo Manager</Text>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  authContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    gap: 24,
    padding: 24,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
  error: {
    color: "#b91c1c",
    textAlign: "center",
  },
});
