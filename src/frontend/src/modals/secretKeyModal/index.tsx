import * as Form from "@radix-ui/react-form";
import { useEffect, useRef, useState } from "react";
import IconComponent from "../../components/genericIconComponent";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { COPIED_NOTICE_ALERT } from "../../constants/alerts_constants";
import { createApiKey } from "../../controllers/API";
import useAlertStore from "../../stores/alertStore";
import { ApiKeyType } from "../../types/components";
import BaseModal from "../baseModal";
import { useTranslation } from "react-i18next";

export default function SecretKeyModal({
  children,
  data,
  onCloseModal,
}: ApiKeyType) {
  const [open, setOpen] = useState(false);
  const [apiKeyName, setApiKeyName] = useState(data?.apikeyname ?? "");
  const [apiKeyValue, setApiKeyValue] = useState("");
  const [renderKey, setRenderKey] = useState(false);
  const [textCopied, setTextCopied] = useState(true);
  const setSuccessData = useAlertStore((state) => state.setSuccessData);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setRenderKey(false);
      resetForm();
    } else {
      onCloseModal();
    }
  }, [open]);

  function resetForm() {
    setApiKeyName("");
    setApiKeyValue("");
  }

  const handleCopyClick = async () => {
    if (apiKeyValue) {
      await navigator.clipboard.writeText(apiKeyValue);
      inputRef?.current?.focus();
      inputRef?.current?.select();
      setSuccessData({
        title: COPIED_NOTICE_ALERT,
      });
      setTextCopied(false);

      setTimeout(() => {
        setTextCopied(true);
      }, 3000);
    }
  };

  function handleAddNewKey() {
    createApiKey(apiKeyName)
      .then((res) => {
        setApiKeyValue(res["api_key"]);
      })
      .catch((err) => { });
  }

  function handleSubmitForm() {
    if (!renderKey) {
      setRenderKey(true);
      handleAddNewKey();
    } else {
      setOpen(false);
    }
  }

  const { t } = useTranslation();

  return (
    <BaseModal
      onSubmit={handleSubmitForm}
      size="small-h-full"
      open={open}
      setOpen={setOpen}
    >
      <BaseModal.Trigger asChild>{children}</BaseModal.Trigger>
      <BaseModal.Header
        description={
          renderKey ? (
            <>
              {t('pages.settings.api_keys.create_secret_key_description')}
            </>
          ) : (
            <>
              {t('pages.settings.api_keys.create_api_key_description')}
            </>
          )
        }
      >
        <span className="pr-2">{t('pages.settings.api_keys.create_api_key')}</span>
        <IconComponent
          name="Key"
          className="h-6 w-6 pl-1 text-foreground"
          aria-hidden="true"
        />
      </BaseModal.Header>
      <BaseModal.Content>
        {renderKey ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-full">
                <Input ref={inputRef} readOnly={true} value={apiKeyValue} />
              </div>

              <Button
                onClick={() => {
                  handleCopyClick();
                }}
                unstyled
              >
                {textCopied ? (
                  <IconComponent name="Copy" className="h-4 w-4" />
                ) : (
                  <IconComponent name="Check" className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        ) : (
          <Form.Field name="apikey">
            <div className="flex items-center justify-between gap-2">
              <Form.Control asChild>
                <Input
                  //fake api key
                  id="primary-input"
                  value={apiKeyName}
                  ref={inputRef}
                  onChange={({ target: { value } }) => {
                    setApiKeyName(value);
                  }}
                  placeholder={t('pages.settings.api_keys.create_api_key_placeholder')}
                />
              </Form.Control>
            </div>
          </Form.Field>
        )}
      </BaseModal.Content>
      <BaseModal.Footer
        submit={{ label: renderKey ? t('pages.settings.api_keys.done') : t('pages.settings.api_keys.create_secret_key') }}
      />
    </BaseModal>
  );
}
