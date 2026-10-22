import { SignOutButton } from "@clerk/react";
import { api } from "@condo-manager/backend";
import {
  Button,
  Dropdown,
  ImageInput,
  Input,
  type FileUploadFile,
} from "@condo-manager/ui";
import { useMutation, useQuery } from "convex/react";
import type { GenericId } from "convex/values";
import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useImageUpload } from "../hooks/use-image-upload";

export const Route = createFileRoute("/condo/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const organizations = useQuery(
    api.authProvider.organizations.queries.getUserOrgs,
    {},
  );
  const createCondo = useMutation(api.modules.condos.mutations.create);
  const selectCondo = useMutation(
    api.modules.userSettings.mutations.selectCondo,
  );
  const createAsset = useMutation(api.modules.assets.mutations.createAsset);
  const navigate = useNavigate();
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

  async function submitForm() {
    if (!selectedOrganizationId) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const storageId = backdropImage
        ? await uploadImage(backdropImage)
        : undefined;
      const assetId = storageId
        ? await createAsset({
            storageId,
            type: "image",
            mimeType:
              backdropImage instanceof File
                ? backdropImage.type
                : backdropImage?.mimeType,
          })
        : undefined;

      const condoId = await createCondo({
        name,
        address: { street, postalCode, city },
        org: selectedOrganizationId,
        ...(assetId ? { backdropImage: assetId } : {}),
      });
      await selectCondo({ condoId });
      await navigate({
        to: "/condo/$condoId",
        params: { condoId },
      });
    } catch {
      setErrorMessage("Não foi possível criar o condomínio. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitForm();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-950">
            Criar condomínio
          </h1>
          <p className="mt-2 text-neutral-600">
            Adicione um condomínio à sua organização.
          </p>
        </div>
        <SignOutButton />
      </header>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Input
          id="condo-name"
          label="Nome do condomínio"
          value={name}
          onChangeText={setName}
        />
        <Input
          id="condo-street"
          label="Morada"
          value={street}
          onChangeText={setStreet}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            id="condo-postal-code"
            label="Código postal"
            value={postalCode}
            onChangeText={setPostalCode}
          />
          <Input
            id="condo-city"
            label="Localidade"
            value={city}
            onChangeText={setCity}
          />
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-700">
            Imagem de fundo (opcional)
          </h2>
          <ImageInput
            id="condo-backdrop-image"
            alt="Pré-visualização da imagem de fundo do condomínio"
            className="w-full"
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
        </section>

        {organizations &&
          organizations.length > 0 &&
          selectedOrganizationId && (
            <Dropdown
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
          )}

        {organizations?.length === 0 && (
          <p className="text-sm text-neutral-600">
            Não encontrámos uma organização associada à sua conta.
          </p>
        )}
        {errorMessage && (
          <p className="text-sm text-red" role="alert">
            {errorMessage}
          </p>
        )}
        <Button
          onPress={() => void submitForm()}
          loading={isSubmitting}
          disabled={
            isUploading ||
            isSubmitting ||
            !selectedOrganizationId ||
            !name.trim() ||
            !street.trim() ||
            !postalCode.trim() ||
            !city.trim()
          }
        >
          Criar condomínio
        </Button>
      </form>
    </main>
  );
}
