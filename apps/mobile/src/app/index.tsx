import {
  Button,
  Dropdown,
  Input,
  TabContent,
  TabItem,
  Tabs,
} from "@condo-manager/ui";
import { useClerk } from "@clerk/expo";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text } from "react-native-css/components";

const dropdownOptions = [
  { value: "building-a", label: "Edifício A" },
  { value: "building-b", label: "Edifício B" },
  { value: "building-c", label: "Edifício C" },
];

export default function HomeScreen() {
  const { signOut } = useClerk();
  const [building, setBuilding] = useState("building-a");

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

        <Input label="MY LABEL" id="my-input" className="w-full" />

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
        <Button variant="secondary" onPress={() => void signOut()}>
          Terminar sessão
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
