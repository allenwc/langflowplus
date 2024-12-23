import ForwardedIconComponent from "@/components/genericIconComponent";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useCustomNavigate } from "@/customization/hooks/use-custom-navigate";
import { track } from "@/customization/utils/analytics";
import useAddFlow from "@/hooks/flows/use-add-flow";
import { Category } from "@/types/templates/types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { newFlowModalPropsType } from "../../types/components";
import BaseModal from "../baseModal";
import GetStartedComponent from "./components/GetStartedComponent";
import TemplateContentComponent from "./components/TemplateContentComponent";
import { Nav } from "./components/navComponent";
import { t } from "i18next";

export default function TemplatesModal({
  open,
  setOpen,
}: newFlowModalPropsType): JSX.Element {
  const [currentTab, setCurrentTab] = useState("get-started");
  const addFlow = useAddFlow();
  const navigate = useCustomNavigate();
  const { folderId } = useParams();

  // Define categories and their items
  const categories: Category[] = [
    {
      title: t("pages.main.templates.title"),
      items: [
        { title: t("pages.main.templates.get_started"), icon: "SquarePlay", id: "get-started" },
        { title: t("pages.main.templates.all_templates"), icon: "LayoutPanelTop", id: "all-templates" },
      ],
    },
    {
      title: t("templates.use_cases"),
      items: [
        { title: t("pages.main.templates.assistants"), icon: "BotMessageSquare", id: "assistants" },
        { title: t("pages.main.templates.classification"), icon: "Tags", id: "classification" },
        { title: t("pages.main.templates.coding"), icon: "TerminalIcon", id: "coding" },
        {
          title: t("pages.main.templates.content_generation"),
          icon: "Newspaper",
          id: "content-generation",
        },
        { title: t("pages.main.templates.q_a"), icon: "Database", id: "q-a" },
        // { title: "Summarization", icon: "Bot", id: "summarization" },
        // { title: "Web Scraping", icon: "CodeXml", id: "web-scraping" },
      ],
    },
    {
      title: t("pages.main.templates.methodology"),
      items: [
        { title: t("pages.main.templates.prompting"), icon: "MessagesSquare", id: "chatbots" },
        { title: t("pages.main.templates.rag"), icon: "Database", id: "rag" },
        { title: t("pages.main.templates.agents"), icon: "Bot", id: "agents" },
      ],
    },
  ];

  return (
    <BaseModal size="templates" open={open} setOpen={setOpen} className="p-0">
      <BaseModal.Content overflowHidden className="flex flex-col p-0">
        <div className="flex h-full">
          <SidebarProvider width="15rem" defaultOpen={false}>
            <Nav
              categories={categories}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
            <main className="flex flex-1 flex-col gap-4 overflow-hidden p-6 md:gap-8">
              {currentTab === "get-started" ? (
                <GetStartedComponent />
              ) : (
                <TemplateContentComponent
                  currentTab={currentTab}
                  categories={categories.flatMap((category) => category.items)}
                />
              )}
              <BaseModal.Footer>
                <div className="flex w-full flex-col justify-between gap-4 pb-4 sm:flex-row sm:items-center">
                  <div className="flex flex-col items-start justify-center">
                    <div className="font-semibold">{t("pages.main.templates.get_started_blank_flow")}</div>
                    <div className="text-sm text-muted-foreground">
                      {t("pages.main.templates.get_started_blank_flow_description")}
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      addFlow().then((id) => {
                        navigate(
                          `/flow/${id}${folderId ? `/folder/${folderId}` : ""}`,
                        );
                      });
                      track("New Flow Created", { template: "Blank Flow" });
                    }}
                    size="sm"
                    data-testid="blank-flow"
                    className="shrink-0"
                  >
                    <ForwardedIconComponent
                      name="Plus"
                      className="h-4 w-4 shrink-0"
                    />
                    {t("pages.main.templates.get_started_blank_flow_button")}
                  </Button>
                </div>
              </BaseModal.Footer>
            </main>
          </SidebarProvider>
        </div>
      </BaseModal.Content>
    </BaseModal>
  );
}
