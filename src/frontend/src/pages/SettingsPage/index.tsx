import { useTranslation } from "react-i18next";
import SideBarButtonsComponent from "@/components/sidebarComponent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ENABLE_PROFILE_ICONS } from "@/customization/feature-flags";
import useAuthStore from "@/stores/authStore";
import { useStoreStore } from "@/stores/storeStore";
import { Outlet } from "react-router-dom";
import ForwardedIconComponent from "../../components/genericIconComponent";
import PageLayout from "../../components/pageLayout";

export default function SettingsPage(): JSX.Element {
  const { t } = useTranslation();
  const autoLogin = useAuthStore((state) => state.autoLogin);
  const hasStore = useStoreStore((state) => state.hasStore);

  // Hides the General settings if there is nothing to show
  const showGeneralSettings = ENABLE_PROFILE_ICONS || hasStore || !autoLogin;

  const sidebarNavItems: {
    href?: string;
    title: string;
    icon: React.ReactNode;
  }[] = [];

  if (showGeneralSettings) {
    sidebarNavItems.push({
      title: t('pages.settings.general.title'),
      href: "/settings/general",
      icon: (
        <ForwardedIconComponent
          name="SlidersHorizontal"
          className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
        />
      ),
    });
  }

  sidebarNavItems.push(
    {
      title: t('pages.settings.global_variables.title'),
      href: "/settings/global-variables",
      icon: (
        <ForwardedIconComponent
          name={t('pages.settings.global_variables.icon')}
          className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
        />
      ),
    },
    {
      title: t('pages.settings.api_keys.title'),
      href: "/settings/api-keys",
      icon: (
        <ForwardedIconComponent
          name="Key"
          className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
        />
      ),
    },
    {
      title: t('pages.settings.shortcuts'),
      href: "/settings/shortcuts",
      icon: (
        <ForwardedIconComponent
          name="Keyboard"
          className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
        />
      ),
    },
    {
      title: t('pages.settings.messages.title'),
      href: "/settings/messages",
      icon: (
        <ForwardedIconComponent
          name="MessagesSquare"
          className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
        />
      ),
    },
  );
  return (
    <PageLayout
      backTo={"/"}
      title={t('pages.settings.title')}
      description={t('pages.settings.description')}
    >
      <SidebarProvider width="15rem" defaultOpen={false}>
        <SideBarButtonsComponent items={sidebarNavItems} />
        <main className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col overflow-x-hidden pt-1">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </PageLayout>
  );
}
