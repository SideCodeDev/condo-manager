import { SignOutButton } from "@clerk/react";
import { api } from "@condo-manager/backend";
import {
  Button,
  Dropdown,
  ImageInput,
  Input,
  type FileUploadFile,
} from "@condo-manager/ui";
import { useQuery as useQueryWithStatus } from "convex-helpers/react";
import { useAction, useMutation } from "convex/react";
import type { GenericId } from "convex/values";
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useImageUpload } from "../hooks/use-image-upload";
import {
  createManyUnits,
  sendCondoInvitations,
  type CondoInvitationInput,
  type CondoUnitInput,
} from "../lib/condo-setup-api";

export const Route = createFileRoute("/condo/new")({
  component: RouteComponent,
});

type Step = 1 | 2 | 3;
type UnitDraft = CondoUnitInput & { key: number };
type SavedUnit = CondoUnitInput & { id: GenericId<"units"> };
type MemberDraft = {
  key: number;
  email: string;
  unitId: GenericId<"units"> | "";
};

function newUnit(key: number): UnitDraft {
  return {
    key,
    floor: "",
    side: "",
    permillage: 0,
    usageType: "residential",
  };
}

function RouteComponent() {
  const organizationsQuery = useQueryWithStatus(
    api.authProvider.organizations.queries.getUserOrgs,
    {},
  );
  const organizations = organizationsQuery.isSuccess
    ? organizationsQuery.data
    : [];
  const createCondo = useMutation(api.modules.condos.mutations.create);
  const selectCondo = useMutation(
    api.modules.userSettings.mutations.selectCondo,
  );
  const createAsset = useMutation(api.modules.assets.mutations.createAsset);
  const createUnits = useMutation(createManyUnits);
  const sendInvitations = useAction(sendCondoInvitations);
  const navigate = useNavigate();
  const { uploadImage, isUploading } = useImageUpload();

  const [step, setStep] = useState<Step>(1);
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
  const [condoId, setCondoId] = useState<GenericId<"condos">>();
  const [units, setUnits] = useState<UnitDraft[]>([newUnit(0)]);
  const [savedUnits, setSavedUnits] = useState<SavedUnit[]>([]);
  const [adminUnitId, setAdminUnitId] = useState<GenericId<"units"> | "">("");
  const [members, setMembers] = useState<MemberDraft[]>([]);
  const [nextKey, setNextKey] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inviteResults, setInviteResults] = useState<
    Array<{ email: string; status: string; message?: string }>
  >([]);

  const selectedOrganizationId = organizationId ?? organizations[0]?.id;

  async function createCondoStep() {
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
      const createdCondoId = await createCondo({
        name,
        address: { street, postalCode, city },
        org: selectedOrganizationId,
        ...(assetId ? { backdropImage: assetId } : {}),
      });
      setCondoId(createdCondoId);
      setStep(2);
      try {
        await selectCondo({ condoId: createdCondoId });
      } catch {
        setErrorMessage(
          "O condomínio foi criado, mas não foi possível selecioná-lo como atual.",
        );
      }
    } catch {
      setErrorMessage("Não foi possível criar o condomínio. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function createUnitsStep() {
    if (!condoId || units.length === 0) return;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const inputs = units.map((unit) => ({
        floor: unit.floor,
        side: unit.side,
        permillage: unit.permillage,
        usageType: unit.usageType,
      }));
      const ids = await createUnits({ condoId, units: inputs });
      setSavedUnits(inputs.map((unit, index) => ({ ...unit, id: ids[index] })));
      setStep(3);
    } catch {
      setErrorMessage("Não foi possível guardar as unidades. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function finishMembersStep() {
    if (!condoId) return;
    const emails = members.map((member) => member.email.trim().toLowerCase());
    if (emails.some((email) => !email || !email.includes("@"))) {
      setErrorMessage("Indique um email válido para cada membro.");
      return;
    }
    if (new Set(emails).size !== emails.length) {
      setErrorMessage("Cada email só pode aparecer uma vez.");
      return;
    }
    if (members.some((member) => !member.unitId)) {
      setErrorMessage("Selecione uma unidade para cada membro convidado.");
      return;
    }
    const normalized: CondoInvitationInput[] = members.flatMap((member) =>
      member.unitId
        ? [{ email: member.email.trim().toLowerCase(), unitId: member.unitId }]
        : [],
    );

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const results = await sendInvitations({
        condoId,
        ...(adminUnitId ? { adminUnitId } : {}),
        members: normalized,
      });
      setInviteResults(results);
      if (results.some((result) => result.status === "failed")) {
        setErrorMessage(
          "Alguns convites não foram enviados. Pode tentar novamente.",
        );
        return;
      }
      await navigate({ to: "/condo/$condoId", params: { condoId } });
    } catch {
      setErrorMessage("Não foi possível guardar os membros. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateUnit(key: number, update: Partial<UnitDraft>) {
    setUnits((current) =>
      current.map((unit) => (unit.key === key ? { ...unit, ...update } : unit)),
    );
  }

  function addUnit() {
    setUnits((current) => [...current, newUnit(nextKey)]);
    setNextKey((current) => current + 1);
  }

  function addMember() {
    setMembers((current) => [
      ...current,
      { key: nextKey, email: "", unitId: "" },
    ]);
    setNextKey((current) => current + 1);
  }

  const unitOptions = savedUnits.map((unit) => ({
    value: unit.id,
    label: `${unit.floor} · ${unit.side}`,
  }));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-950">
            Criar condomínio
          </h1>
          <p className="mt-2 text-neutral-600">
            Passo {step} de 3 ·{" "}
            {step === 1 ? "Condomínio" : step === 2 ? "Unidades" : "Membros"}
          </p>
        </div>
        <SignOutButton />
      </header>

      {step === 1 ? (
        <section className="flex flex-col gap-5">
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
          {organizationsQuery.isError ? (
            <p className="text-sm text-red-700" role="alert">
              Não foi possível carregar as organizações.{" "}
              {organizationsQuery.error.message}
            </p>
          ) : null}
          {organizations.length > 0 && selectedOrganizationId ? (
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
          ) : null}
          {organizationsQuery.isSuccess && organizations.length === 0 ? (
            <p className="text-sm text-neutral-600">
              Não encontrámos uma organização associada à sua conta.
            </p>
          ) : null}
          <Button
            onPress={() => void createCondoStep()}
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
            Criar condomínio e continuar
          </Button>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">
              Adicionar unidades
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Crie as unidades antes de associar os membros.
            </p>
          </div>
          {units.map((unit, index) => (
            <section
              key={unit.key}
              className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-neutral-900">
                  Unidade {index + 1}
                </h3>
                {units.length > 1 ? (
                  <button
                    type="button"
                    className="text-sm text-red-700"
                    onClick={() =>
                      setUnits((current) =>
                        current.filter((item) => item.key !== unit.key),
                      )
                    }
                  >
                    Remover
                  </button>
                ) : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  id={`unit-floor-${unit.key}`}
                  label="Andar"
                  value={unit.floor}
                  onChangeText={(floor) => updateUnit(unit.key, { floor })}
                />
                <Input
                  id={`unit-side-${unit.key}`}
                  label="Porta / lado"
                  value={unit.side}
                  onChangeText={(side) => updateUnit(unit.key, { side })}
                />
                <Input
                  id={`unit-permillage-${unit.key}`}
                  label="Permilagem"
                  keyboardType="numeric"
                  value={String(unit.permillage)}
                  onChangeText={(value) =>
                    updateUnit(unit.key, {
                      permillage: Number(value.replace(",", ".")) || 0,
                    })
                  }
                />
                <Dropdown
                  id={`unit-type-${unit.key}`}
                  label="Utilização"
                  popupLabel="Selecionar utilização"
                  options={[
                    { value: "residential", label: "Residencial" },
                    { value: "commercial", label: "Comercial" },
                  ]}
                  value={unit.usageType}
                  onChange={(usageType: CondoUnitInput["usageType"]) =>
                    updateUnit(unit.key, { usageType })
                  }
                />
              </div>
            </section>
          ))}
          <Button variant="secondary" onPress={addUnit}>
            Adicionar outra unidade
          </Button>
          <Button
            onPress={() => void createUnitsStep()}
            loading={isSubmitting}
            disabled={
              isSubmitting ||
              units.some((unit) => !unit.floor.trim() || !unit.side.trim()) ||
              units.some(
                (unit) => unit.permillage < 0 || unit.permillage > 1000,
              )
            }
          >
            Guardar unidades e continuar
          </Button>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="flex flex-col gap-5">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">
              Associar membros às unidades
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Os convidados recebem um email e ficam ativos quando aceitarem.
            </p>
          </div>
          <Dropdown
            id="admin-unit"
            label="A sua unidade (opcional)"
            popupLabel="Selecionar a sua unidade"
            options={[{ value: "", label: "Sem unidade" }, ...unitOptions]}
            value={adminUnitId}
            onChange={setAdminUnitId}
          />
          {members.map((member, index) => (
            <section
              key={member.key}
              className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-neutral-900">
                  Membro {index + 1}
                </h3>
                <button
                  type="button"
                  className="text-sm text-red-700"
                  onClick={() =>
                    setMembers((current) =>
                      current.filter((item) => item.key !== member.key),
                    )
                  }
                >
                  Remover
                </button>
              </div>
              <Input
                id={`member-email-${member.key}`}
                label="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={member.email}
                onChangeText={(email) =>
                  setMembers((current) =>
                    current.map((item) =>
                      item.key === member.key ? { ...item, email } : item,
                    ),
                  )
                }
              />
              <Dropdown
                id={`member-unit-${member.key}`}
                label="Unidade"
                popupLabel="Selecionar unidade"
                options={[
                  { value: "", label: "Selecionar unidade" },
                  ...unitOptions,
                ]}
                value={member.unitId}
                onChange={(unitId: GenericId<"units"> | "") =>
                  setMembers((current) =>
                    current.map((item) =>
                      item.key === member.key ? { ...item, unitId } : item,
                    ),
                  )
                }
              />
            </section>
          ))}
          <Button variant="secondary" onPress={addMember}>
            Adicionar membro
          </Button>
          {inviteResults.map((result) => (
            <p
              key={result.email}
              className={
                result.status === "failed"
                  ? "text-sm text-red-700"
                  : "text-sm text-neutral-600"
              }
            >
              {result.email}:{" "}
              {result.status === "failed"
                ? result.message
                : result.status === "already_active"
                  ? "já pertence ao condomínio"
                  : "convite enviado"}
            </p>
          ))}
          <Button
            onPress={() => void finishMembersStep()}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {inviteResults.some((result) => result.status === "failed")
              ? "Tentar enviar novamente"
              : "Concluir configuração"}
          </Button>
        </section>
      ) : null}

      {errorMessage ? (
        <p className="text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </main>
  );
}
