import { api } from "@condo-manager/backend";
import {
  Button,
  Dropdown,
  ImageInput,
  Input,
  type FileUploadFile,
} from "@condo-manager/ui";
import { useQuery as useQueryWithStatus } from "convex-helpers/react";
import { useConvexAuth, useMutation } from "convex/react";
import type { GenericId } from "convex/values";
import type { ErrorBoundaryProps } from "expo-router";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View } from "react-native-css/components";
import { useImageUpload } from "../../hooks/use-image-upload";

export default function NewCondoScreen() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const organizationsQuery = useQueryWithStatus(
    api.authProvider.organizations.queries.getUserOrgs,
    isAuthenticated ? {} : "skip",
  );
  const organizations = organizationsQuery.isSuccess
    ? organizationsQuery.data
    : [];
  const createCondo = useMutation(api.modules.condos.mutations.create);
  const selectCondo = useMutation(
    api.modules.userSettings.mutations.selectCondo,
  );
  const createAsset = useMutation(api.modules.assets.mutations.createAsset);
  const router = useRouter();
  const { uploadImage, isUploading } = useImageUpload();

  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [backdropImage, setBackdropImage] = useState<FileUploadFile | null>(
    null,
  );
  const [organizationId, setOrganizationId] = useState<
    GenericId<"organizations"> | undefined
  >();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedOrganizationId = organizationId ?? organizations?.[0]?.id;

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 justify-center bg-white p-6">
        <Text className="text-neutral-600">
          {isAuthLoading
            ? "A ligar à sua conta…"
            : "Não foi possível autenticar com o servidor. Verifique a configuração de autenticação e tente novamente."}
        </Text>
      </SafeAreaView>
    );
  }

  async function submitCondo() {
    if (!selectedOrganizationId) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const storageId = backdropImage
        ? await uploadImage(backdropImage)
        : undefined;
      const mimeType = backdropImage
        ? "uri" in backdropImage
          ? backdropImage.mimeType
          : backdropImage.type
        : undefined;
      const assetId = storageId
        ? await createAsset({ storageId, type: "image", mimeType })
        : undefined;

      const condoId = await createCondo({
        name,
        address: { street, postalCode, city },
        org: selectedOrganizationId,
        ...(assetId ? { backdropImage: assetId } : {}),
      });
      await selectCondo({ condoId });
      router.replace({ pathname: "/condo/[condoId]", params: { condoId } });
    } catch {
      setErrorMessage("Não foi possível criar o condomínio. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit =
    Boolean(selectedOrganizationId) &&
    Boolean(name.trim()) &&
    Boolean(street.trim()) &&
    Boolean(postalCode.trim()) &&
    Boolean(city.trim()) &&
    !isSubmitting &&
    !isUploading;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerClassName="w-full grow gap-5 p-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-2">
          <Text className="text-2xl font-semibold text-neutral-950">
            Criar condomínio
          </Text>
          <Text className="text-neutral-600">
            Adicione um condomínio à sua organização.
          </Text>
        </View>

        <Input
          id="condo-name"
          className="w-full"
          label="Nome do condomínio"
          value={name}
          onChangeText={setName}
        />
        <Input
          id="condo-street"
          className="w-full"
          label="Morada"
          value={street}
          onChangeText={setStreet}
        />
        <View className="w-full flex-row gap-4">
          <Input
            id="condo-postal-code"
            className="flex-1"
            label="Código postal"
            value={postalCode}
            onChangeText={setPostalCode}
          />
          <Input
            id="condo-city"
            className="flex-1"
            label="Localidade"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View className="gap-2">
          <Text className="font-medium text-neutral-700">
            Imagem de fundo (opcional)
          </Text>
          <ImageInput
            id="condo-backdrop-image"
            className="w-full"
            alt="Pré-visualização da imagem de fundo do condomínio"
            value={backdropImage}
            onChange={setBackdropImage}
            maxFileSizeMB={10}
            labels={{
              add: "Selecionar imagem",
              dragAndDrop: "ou arraste a imagem",
              size: (size) => `Máximo ${size}`,
              replace: "Alterar imagem",
              remove: "Remover imagem",
            }}
          />
        </View>

        {organizationsQuery.isError ? (
          <Text accessibilityRole="alert" className="text-sm text-red-700">
            Não foi possível carregar as organizações.{" "}
            {organizationsQuery.error.message}
          </Text>
        ) : null}

        {organizations && organizations.length > 0 && selectedOrganizationId ? (
          <Dropdown
            className="w-full"
            id="condo-organization"
            label="Organização"
            popupLabel="Selecionar organização"
            options={organizations.map((organization) => ({
              value: organization.id,
              label: organization.name,
            }))}
            value={selectedOrganizationId}
            onChange={setOrganizationId}
          />
        ) : isAuthLoading ? (
          <Text className="text-sm text-neutral-600">A verificar sessão…</Text>
        ) : !isAuthenticated ? (
          <Text className="text-sm text-neutral-600">
            Não foi possível validar a sessão. Tente novamente.
          </Text>
        ) : organizationsQuery.isSuccess && organizations.length === 0 ? (
          <Text className="text-sm text-neutral-600">
            Não encontrámos uma organização associada à sua conta.
          </Text>
        ) : organizationsQuery.isPending ? (
          <Text className="text-sm text-neutral-600">
            A carregar organizações…
          </Text>
        ) : null}

        {errorMessage ? (
          <Text accessibilityRole="alert" className="text-sm text-red">
            {errorMessage}
          </Text>
        ) : null}
        <Button
          className="w-full"
          loading={isSubmitting || isUploading}
          disabled={!canSubmit}
          onPress={() => void submitCondo()}
        >
          Criar condomínio
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  return (
    <SafeAreaView className="flex-1 justify-center bg-white p-6">
      <Text className="text-lg font-semibold text-neutral-950">
        Não foi possível abrir a criação do condomínio.
      </Text>
      <Text className="mt-2 text-neutral-600">{error.message}</Text>
    </SafeAreaView>
  );
}
