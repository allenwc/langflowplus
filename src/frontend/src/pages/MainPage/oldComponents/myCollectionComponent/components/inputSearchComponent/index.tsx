import { ChangeEvent, KeyboardEvent } from "react";
import ForwardedIconComponent from "../../../../../../components/genericIconComponent";
import { Input } from "../../../../../../components/ui/input";
import { useTranslation } from "react-i18next";
type InputSearchComponentProps = {
  loading: boolean;
  divClasses?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  value: string;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
};

const InputSearchComponent = ({
  loading,
  divClasses,
  onChange,
  onClick,
  value,
  onKeyDown,
}: InputSearchComponentProps) => {
  const { t } = useTranslation();
  const pagePath = window.location.pathname;

  const getSearchPlaceholder = () => {
    if (pagePath.includes("flows")) {
      return "Search Flows";
    } else if (pagePath.includes("components")) {
      return "Search Components";
    } else {
      return t("pages.store.search_placeholder");
    }
  };

  return (
    <>
      <div className={`${divClasses ? divClasses : "relative h-12 w-[60%]"}`}>
        <Input
          data-testid="search-store-input"
          disabled={loading}
          placeholder={getSearchPlaceholder()}
          className="absolute h-12 pl-5 pr-12"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={value}
        />
        <button
          onClick={onClick}
          disabled={loading}
          className="absolute bottom-0 right-4 top-0 my-auto h-6 cursor-pointer stroke-1 text-muted-foreground"
          data-testid="search-store-button"
        >
          <ForwardedIconComponent
            name={loading ? "Loader2" : "Search"}
            className={loading ? "animate-spin cursor-not-allowed" : ""}
          />
        </button>
      </div>
    </>
  );
};
export default InputSearchComponent;
