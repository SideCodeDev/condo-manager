import { api } from "@condo-manager/backend";
import { useQuery as useQueryWithStatus } from "convex-helpers/react";
import type { GenericId } from "convex/values";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, ScrollView, Text, View } from "react-native-css/components";

export default function CondoScreen() {
  const { condoId } = useLocalSearchParams<{
    condoId: GenericId<"condos">;
  }>();
  const router = useRouter();
  const condoQuery = useQueryWithStatus(
    api.modules.condos.queries.getById,
    condoId ? { condoId } : "skip",
  );
  const isReturningHome = useRef(false);

  useEffect(() => {
    if (
      !condoQuery.isSuccess ||
      condoQuery.data !== null ||
      isReturningHome.current
    )
      return;
    isReturningHome.current = true;
    router.replace({ pathname: "/", params: { showList: "true" } });
  }, [condoQuery, router]);

  if (condoQuery.isPending) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 p-6">
        <Text className="text-center text-neutral-600">
          A carregar o condomínio…
        </Text>
      </SafeAreaView>
    );
  }

  if (condoQuery.isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 p-6">
        <Text accessibilityRole="alert" className="text-center text-red-700">
          Não foi possível carregar o condomínio. {condoQuery.error.message}
        </Text>
      </SafeAreaView>
    );
  }

  if (condoQuery.data === null) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 p-6">
        <Text className="text-center text-neutral-600">
          A regressar aos seus condomínios…
        </Text>
      </SafeAreaView>
    );
  }

  const condo = condoQuery.data;

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView contentContainerClassName="w-full grow gap-5 p-5">
        <Text
          accessibilityRole="button"
          onPress={() =>
            router.replace({ pathname: "/", params: { showList: "true" } })
          }
          className="font-medium text-teal-800"
        >
          ← Os meus condomínios
        </Text>
        <View className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
          {condo.backdropImageAsset?.url ? (
            <Image
              source={{ uri: condo.backdropImageAsset.url }}
              accessibilityLabel={`Imagem de ${condo.name}`}
              className="h-56 w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-56 justify-end bg-teal-100 p-6">
              <Text className="font-medium text-teal-900">Condo Manager</Text>
            </View>
          )}
          <View className="gap-5 p-6">
            <View className="gap-2">
              <Text className="text-sm font-medium text-teal-700">
                Área do condomínio
              </Text>
              <Text className="text-3xl font-bold text-neutral-950">
                {condo.name}
              </Text>
              <Text className="text-neutral-600">
                {condo.address.street}, {condo.address.postalCode}{" "}
                {condo.address.city}
              </Text>
            </View>
            <View className="gap-4 rounded-2xl bg-neutral-50 p-5">
              <View className="gap-1">
                <Text className="text-sm text-neutral-500">Localidade</Text>
                <Text className="font-medium text-neutral-900">
                  {condo.address.city || "Por definir"}
                </Text>
              </View>
              <View className="gap-1">
                <Text className="text-sm text-neutral-500">Código postal</Text>
                <Text className="font-medium text-neutral-900">
                  {condo.address.postalCode || "Por definir"}
                </Text>
              </View>
              <View className="gap-1">
                <Text className="text-sm text-neutral-500">Criado em</Text>
                <Text className="font-medium text-neutral-900">
                  {new Date(condo.createdAt).toLocaleDateString("pt-PT")}
                </Text>
              </View>
              <View className="gap-1">
                <Text className="text-sm text-neutral-500">Estado</Text>
                <Text className="font-medium text-neutral-900">
                  Pronto a configurar
                </Text>
              </View>
            </View>
            <Text className="text-sm text-neutral-500">
              Esta área está em preparação. Em breve poderá gerir aqui o seu
              condomínio.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
