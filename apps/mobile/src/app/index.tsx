import { api } from "@condo-manager/backend";
import { Button } from "@condo-manager/ui";
import { useClerk } from "@clerk/expo";
import { useQuery as useQueryWithStatus } from "convex-helpers/react";
import { useConvexAuth, useMutation } from "convex/react";
import type { GenericId } from "convex/values";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native-css/components";

export default function HomeScreen() {
  const { signOut } = useClerk();
  const { showList } = useLocalSearchParams<{ showList?: string }>();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const router = useRouter();
  const condosQuery = useQueryWithStatus(
    api.modules.condos.queries.listMine,
    isAuthenticated ? {} : "skip",
  );
  const condos = condosQuery.isSuccess ? condosQuery.data : [];
  const selectCondo = useMutation(
    api.modules.userSettings.mutations.selectCondo,
  );
  const autoOpeningCondoId = useRef<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSelecting, setIsSelecting] = useState(false);

  const openCondoRoute = useCallback(
    (condoId: GenericId<"condos">) => {
      router.replace({ pathname: "/", params: { showList: "true" } });
      router.push({ pathname: "/condo/[condoId]", params: { condoId } });
    },
    [router],
  );

  useEffect(() => {
    if (!condosQuery.isSuccess || showList === "true") return;
    const defaultCondo = condos.find((condo) => condo.isDefault);
    if (!defaultCondo || autoOpeningCondoId.current === defaultCondo._id)
      return;
    autoOpeningCondoId.current = defaultCondo._id;
    openCondoRoute(defaultCondo._id);
  }, [condos, condosQuery.isSuccess, openCondoRoute, showList]);

  async function openCondo(condoId: GenericId<"condos">) {
    setIsSelecting(true);
    setErrorMessage("");
    try {
      await selectCondo({ condoId });
      openCondoRoute(condoId);
    } catch {
      setErrorMessage(
        "Não foi possível abrir este condomínio. Tente novamente.",
      );
    } finally {
      setIsSelecting(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 justify-center bg-neutral-50 p-6">
        <Text className="text-center text-neutral-600">
          {isAuthLoading
            ? "A ligar à sua conta…"
            : "Não foi possível ligar à sua conta. Tente novamente."}
        </Text>
      </SafeAreaView>
    );
  }

  const isLoading = condosQuery.isPending;
  const queryError = condosQuery.isError ? condosQuery.error : undefined;

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView
        contentContainerClassName="w-full grow gap-6 p-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1 gap-1">
            <Text className="text-sm font-medium text-teal-700">
              Condo Manager
            </Text>
            <Text className="text-3xl font-bold text-neutral-950">
              Os meus condomínios
            </Text>
          </View>
          <Button variant="secondary" onPress={() => void signOut()}>
            Sair
          </Button>
        </View>

        <View className="gap-4">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="flex-1 text-neutral-600">
              Selecione um condomínio para continuar.
            </Text>
            <Button onPress={() => router.push("/condo/new")}>Criar</Button>
          </View>

          {errorMessage ? (
            <Text
              accessibilityRole="alert"
              className="rounded-xl bg-red-50 p-4 text-red-700"
            >
              {errorMessage}
            </Text>
          ) : null}

          {queryError ? (
            <Text
              accessibilityRole="alert"
              className="rounded-2xl bg-red-50 p-6 text-red-700"
            >
              Não foi possível carregar os seus condomínios.{" "}
              {queryError.message}
            </Text>
          ) : isLoading ? (
            <View className="rounded-2xl border border-neutral-200 bg-white p-6">
              <Text className="text-neutral-600">
                A carregar os seus condomínios…
              </Text>
            </View>
          ) : condos.length === 1 ? (
            <View className="items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-8">
              <Text className="text-center text-neutral-600">
                {errorMessage || `A abrir ${condos[0].name}…`}
              </Text>
              {errorMessage ? (
                <Button onPress={() => void openCondo(condos[0]._id)}>
                  Tentar novamente
                </Button>
              ) : null}
            </View>
          ) : condos.length === 0 ? (
            <View className="items-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-10">
              <Text className="text-center text-xl font-semibold text-neutral-950">
                Ainda não tem condomínios
              </Text>
              <Text className="text-center text-neutral-600">
                Crie o seu primeiro condomínio para começar a gerir o espaço e
                os seus membros.
              </Text>
              <Button onPress={() => router.push("/condo/new")}>
                Criar primeiro condomínio
              </Button>
            </View>
          ) : (
            <View className="gap-4">
              {condos.map((condo) => (
                <Pressable
                  key={condo._id}
                  accessibilityRole="button"
                  disabled={isSelecting}
                  onPress={() => void openCondo(condo._id)}
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white active:border-teal-400"
                >
                  {condo.backdropImageAsset?.url ? (
                    <Image
                      source={{ uri: condo.backdropImageAsset.url }}
                      accessibilityLabel={`Imagem de ${condo.name}`}
                      className="h-44 w-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-36 justify-end bg-teal-100 p-5">
                      <Text className="font-medium text-teal-900">
                        Condo Manager
                      </Text>
                    </View>
                  )}
                  <View className="gap-1 p-5">
                    <Text className="text-lg font-semibold text-neutral-950">
                      {condo.name}
                    </Text>
                    <Text className="text-sm text-neutral-600">
                      {[condo.address.city, condo.address.postalCode]
                        .filter(Boolean)
                        .join(" · ") || "Morada por definir"}
                    </Text>
                    <Text className="mt-3 font-medium text-teal-800">
                      Abrir condomínio →
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
