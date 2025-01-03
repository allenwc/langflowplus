import {
  useGetGlobalVariables,
  usePatchGlobalVariables,
  usePostGlobalVariables,
} from "@/controllers/API/queries/variables";
import getUnavailableFields from "@/stores/globalVariablesStore/utils/get-unavailable-fields";
import { GlobalVariable } from "@/types/global_variables";
import { useEffect, useState } from "react";
import BaseModal from "../../modals/baseModal";
import useAlertStore from "../../stores/alertStore";
import { useTypesStore } from "../../stores/typesStore";
import { ResponseErrorDetailAPI } from "../../types/api";
import ForwardedIconComponent from "../genericIconComponent";
import InputComponent from "../inputComponent";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import sortByName from "./utils/sort-by-name";
import { useTranslation } from "react-i18next";

//TODO IMPLEMENT FORM LOGIC

export default function GlobalVariableModal({
  children,
  asChild,
  initialData,
  open: myOpen,
  setOpen: mySetOpen,
  disabled = false,
}: {
  children?: JSX.Element;
  asChild?: boolean;
  initialData?: GlobalVariable;
  open?: boolean;
  setOpen?: (a: boolean | ((o?: boolean) => boolean)) => void;
  disabled?: boolean;
}): JSX.Element {
  const { t } = useTranslation();
  const [key, setKey] = useState(initialData?.name ?? "");
  const [value, setValue] = useState(initialData?.value ?? "");
  const [type, setType] = useState(initialData?.type ?? "Generic");
  const [fields, setFields] = useState<string[]>(
    initialData?.default_fields ?? [],
  );
  const [open, setOpen] =
    mySetOpen !== undefined && myOpen !== undefined
      ? [myOpen, mySetOpen]
      : useState(false);
  const setErrorData = useAlertStore((state) => state.setErrorData);
  const componentFields = useTypesStore((state) => state.ComponentFields);
  const { mutate: mutateAddGlobalVariable } = usePostGlobalVariables();
  const { mutate: updateVariable } = usePatchGlobalVariables();
  const { data: globalVariables } = useGetGlobalVariables();
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  useEffect(() => {
    if (globalVariables && componentFields.size > 0) {
      const unavailableFields = getUnavailableFields(globalVariables);
      const fields = Array.from(componentFields).filter(
        (field) => !unavailableFields.hasOwnProperty(field.trim()),
      );
      setAvailableFields(
        sortByName(fields.concat(initialData?.default_fields ?? [])),
      );
    }
  }, [globalVariables, componentFields, initialData]);

  const setSuccessData = useAlertStore((state) => state.setSuccessData);

  function handleSaveVariable() {
    let data: {
      name: string;
      value: string;
      type?: string;
      default_fields?: string[];
    } = {
      name: key,
      type,
      value,
      default_fields: fields,
    };

    mutateAddGlobalVariable(data, {
      onSuccess: (res) => {
        const { name } = res;
        setKey("");
        setValue("");
        setType("");
        setFields([]);
        setOpen(false);

        setSuccessData({
          title: `Variable ${name} ${initialData ? "updated" : "created"} successfully`,
        });
      },
      onError: (error) => {
        let responseError = error as ResponseErrorDetailAPI;
        setErrorData({
          title: `Error ${initialData ? "updating" : "creating"} variable`,
          list: [
            responseError?.response?.data?.detail ??
            `An unexpected error occurred while ${initialData ? "updating a new" : "creating"} variable. Please try again.`,
          ],
        });
      },
    });
  }

  function submitForm() {
    if (!initialData) {
      handleSaveVariable();
    } else {
      updateVariable({
        id: initialData.id,
        name: key,
        value: value,
        default_fields: fields,
      });
      setOpen(false);
    }
  }

  return (
    <BaseModal
      open={open}
      setOpen={setOpen}
      size="x-small"
      onSubmit={submitForm}
      disable={disabled}
    >
      <BaseModal.Header
        description={
          t('pages.settings.global_variables.modal_description')
        }
      >
        <span className="pr-2">
          {" "}
          {initialData ? t('pages.settings.global_variables.modal_update') : t('pages.settings.global_variables.modal_save')} Variable{" "}
        </span>
        <ForwardedIconComponent
          name="Globe"
          className="h-6 w-6 pl-1 text-primary"
          aria-hidden="true"
        />
      </BaseModal.Header>
      <BaseModal.Trigger disable={disabled} asChild={asChild}>
        {children}
      </BaseModal.Trigger>
      <BaseModal.Content>
        <div className="flex h-full w-full flex-col gap-4 align-middle">
          <Label>{t('pages.settings.global_variables.modal_name')}</Label>
          <Input
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
            }}
            placeholder={t('pages.settings.global_variables.modal_name_placeholder')}
          ></Input>
          <Label>{t('pages.settings.global_variables.modal_type')}</Label>

          <Select
            disabled={disabled}
            onValueChange={setType}
            value={type}
            defaultValue={type}
          >
            <SelectTrigger
              className="h-full w-full"
              data-testid="select-type-global-variables"
            >
              <SelectValue placeholder="Choose a type for the variable..." />
            </SelectTrigger>
            <SelectContent id="type-global-variables">
              {["Generic", "Credential"].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>{t('pages.settings.global_variables.modal_value')}</Label>
          {type === "Credential" ? (
            <InputComponent
              password
              value={value}
              onChange={(e) => {
                setValue(e);
              }}
              placeholder={t('pages.settings.global_variables.modal_value_placeholder')}
              nodeStyle
            />
          ) : (
            <Textarea
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              placeholder="Insert a value for the variable..."
              className="w-full resize-none custom-scroll"
            />
          )}

          <Label>{t('pages.settings.global_variables.modal_apply_to_fields')}</Label>
          <InputComponent
            setSelectedOptions={(value) => setFields(value)}
            selectedOptions={fields}
            options={availableFields}
            password={false}
            placeholder={t('pages.settings.global_variables.modal_apply_to_fields_placeholder')}
            id={"apply-to-fields"}
          ></InputComponent>
        </div>
      </BaseModal.Content>
      <BaseModal.Footer
        submit={{
          label: `${initialData ? t('pages.settings.global_variables.modal_update') : t('pages.settings.global_variables.modal_save')}`,
          dataTestId: "save-variable-btn",
        }}
      />
    </BaseModal>
  );
}
