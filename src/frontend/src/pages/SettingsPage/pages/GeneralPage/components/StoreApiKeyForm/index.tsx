import * as Form from "@radix-ui/react-form";
import InputComponent from "../../../../../../components/inputComponent";
import { Button } from "../../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card";
import { t } from "i18next";

type StoreApiKeyFormComponentProps = {
  apikey: string;
  handleInput: (event: any) => void;
  handleSaveKey: (apikey: string, handleInput: any) => void;
  loadingApiKey: boolean;
  validApiKey: boolean;
  hasApiKey: boolean;
};
const StoreApiKeyFormComponent = ({
  apikey,
  handleInput,
  handleSaveKey,
  loadingApiKey,
  validApiKey,
  hasApiKey,
}: StoreApiKeyFormComponentProps) => {
  return (
    <>
      <Form.Root
        onSubmit={(event) => {
          event.preventDefault();
          handleSaveKey(apikey, handleInput);
        }}
      >
        <Card x-chunk="dashboard-04-chunk-2" id="api">
          <CardHeader>
            <CardTitle>{t('pages.settings.general.store_api_key')}</CardTitle>
            <CardDescription>
              {(hasApiKey && !validApiKey
                ? t('pages.settings.general.invalid_api_key')
                : !hasApiKey
                  ? t('pages.settings.general.no_api_key')
                  : "") + t('pages.settings.general.store_api_key_insert')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full flex-col gap-3">
              <div className="flex w-full gap-4">
                <Form.Field name="apikey" className="w-full">
                  <InputComponent
                    id="apikey"
                    onChange={(value) => {
                      handleInput({ target: { name: "apikey", value } });
                    }}
                    value={apikey}
                    isForm
                    password={true}
                    placeholder={t('pages.settings.general.store_api_key_insert')}
                    className="w-full"
                  />
                  <Form.Message match="valueMissing" className="field-invalid">
                    {t('pages.settings.general.store_api_key_insert')}
                  </Form.Message>
                </Form.Field>
              </div>
              <span className="pr-1 text-xs text-muted-foreground">
                {t('pages.settings.general.create_api_key')}{" "}
                <a
                  className="text-high-indigo underline"
                  href="https://langflow.store/"
                  target="_blank"
                >
                  langflow.store
                </a>
              </span>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Form.Submit asChild>
              <Button
                loading={loadingApiKey}
                type="submit"
                data-testid="api-key-save-button-store"
              >
                {t('pages.settings.general.save')}
              </Button>
            </Form.Submit>
          </CardFooter>
        </Card>
      </Form.Root>
    </>
  );
};
export default StoreApiKeyFormComponent;
