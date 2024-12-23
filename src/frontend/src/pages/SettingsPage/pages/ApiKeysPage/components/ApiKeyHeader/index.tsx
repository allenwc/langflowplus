import { t } from "i18next";
import ForwardedIconComponent from "../../../../../../components/genericIconComponent";
import { Button } from "../../../../../../components/ui/button";
import SecretKeyModal from "../../../../../../modals/secretKeyModal";

type ApiKeyHeaderComponentProps = {
  selectedRows: string[];
  fetchApiKeys: () => void;
  userId: string;
};
const ApiKeyHeaderComponent = ({
  selectedRows,
  fetchApiKeys,
  userId,
}: ApiKeyHeaderComponentProps) => {
  return (
    <>
      <div className="flex w-full items-start justify-between gap-6">
        <div className="flex w-full flex-col">
          <h2 className="flex items-center text-lg font-semibold tracking-tight">
            {t('api_keys.title')}
            <ForwardedIconComponent
              name="Key"
              className="ml-2 h-5 w-5 text-primary"
            />
          </h2>
          <p className="text-sm text-muted-foreground">{t('pages.settings.api_keys.description')}</p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <SecretKeyModal data={userId} onCloseModal={fetchApiKeys}>
            <Button data-testid="api-key-button-store" variant="primary">
              <ForwardedIconComponent name="Plus" className="w-4" />
              {t('api_keys.add_new')}
            </Button>
          </SecretKeyModal>
        </div>
      </div>
    </>
  );
};
export default ApiKeyHeaderComponent;
