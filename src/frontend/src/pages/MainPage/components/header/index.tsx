import ForwardedIconComponent from "@/components/genericIconComponent";
import ShadTooltip from "@/components/shadTooltipComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

interface HeaderComponentProps {
  flowType: "flows" | "components";
  setFlowType: (flowType: "flows" | "components") => void;
  view: "list" | "grid";
  setView: (view: "list" | "grid") => void;
  setNewProjectModal: (newProjectModal: boolean) => void;
  folderName?: string;
  setSearch: (search: string) => void;
  isEmptyFolder: boolean;
}

const HeaderComponent = ({
  folderName = "",
  flowType,
  setFlowType,
  view,
  setView,
  setNewProjectModal,
  setSearch,
  isEmptyFolder,
}: HeaderComponentProps) => {
  const { t } = useTranslation();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce the setSearch function from the parent
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 1000),
    [setSearch],
  );

  useEffect(() => {
    debouncedSetSearch(debouncedSearch);

    return () => {
      debouncedSetSearch.cancel(); // Cleanup on unmount
    };
  }, [debouncedSearch, debouncedSetSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedSearch(e.target.value);
  };

  return (
    <>
      <div
        className="flex items-center pb-8 text-xl font-semibold"
        data-testid="mainpage_title"
      >
        <div className="h-7 w-10 transition-all group-data-[open=true]/sidebar-wrapper:md:w-0 lg:hidden">
          <div className="relative left-0 opacity-100 transition-all group-data-[open=true]/sidebar-wrapper:md:opacity-0">
            <SidebarTrigger>
              <ForwardedIconComponent
                name="PanelLeftOpen"
                aria-hidden="true"
                className=""
              />
            </SidebarTrigger>
          </div>
        </div>
        {folderName}
      </div>
      {!isEmptyFolder && (
        <>
          <div className="flex flex-row-reverse pb-8">
            <div className="w-full border-b dark:border-border" />
            {["components", "flows"].map((type) => (
              <Button
                key={type}
                unstyled
                id={`${type}-btn`}
                data-testid={`${type}-btn`}
                onClick={() => setFlowType(type as "flows" | "components")}
                className={`border-b ${flowType === type
                    ? "border-b-2 border-foreground text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                  } px-3 pb-2 text-sm`}
              >
                <div className={`${flowType === type ? "-mb-px" : ""} whitespace-nowrap`}>
                  {type === "flows" ? t('pages.main.header.flows') : t('pages.main.header.components')}
                </div>
              </Button>
            ))}
          </div>
          {/* Search and filters */}
          <div className="flex justify-between">
            <div className="flex w-full xl:w-5/12">
              <Input
                icon="Search"
                data-testid="search-store-input"
                type="text"
                placeholder={`${t('pages.main.header.search')} ${flowType === "flows" ? t('pages.main.header.flows') : t('pages.main.header.components')}...`}
                className="mr-2"
                value={debouncedSearch}
                onChange={handleSearch}
              />
              <div className="relative mr-2 flex rounded-lg border border-muted bg-muted">
                {/* Sliding Indicator */}
                <div
                  className={`absolute top-[3px] h-[33px] w-8 transform rounded-lg bg-background shadow-md transition-transform duration-300 ${view === "list"
                      ? "left-[2px] translate-x-0"
                      : "left-[6px] translate-x-full"
                    }`}
                ></div>

                {/* Buttons */}
                {["list", "grid"].map((viewType) => (
                  <Button
                    key={viewType}
                    unstyled
                    size="icon"
                    className={`group relative z-10 mx-[2px] my-[2px] flex-1 rounded-lg p-2 ${view === viewType
                        ? "text-foreground"
                        : "text-muted-foreground hover:bg-muted"
                      }`}
                    onClick={() => setView(viewType as "list" | "grid")}
                  >
                    <ForwardedIconComponent
                      name={viewType === "list" ? "Menu" : "LayoutGrid"}
                      aria-hidden="true"
                      className="h-4 w-4 group-hover:text-foreground"
                    />
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <ShadTooltip content="New Flow" side="bottom">
                <Button
                  variant="default"
                  onClick={() => setNewProjectModal(true)}
                  id="new-project-btn"
                >
                  <ForwardedIconComponent
                    name="Plus"
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                  <span className="hidden whitespace-nowrap font-semibold md:inline">
                    {t('pages.main.header.new_flow')}
                  </span>
                </Button>
              </ShadTooltip>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HeaderComponent;
