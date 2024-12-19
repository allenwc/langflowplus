import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import ShadTooltip from "@/components/shadTooltipComponent";
import ForwardedIconComponent from "@/components/genericIconComponent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export default function LanguageSwitcher(): JSX.Element {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const languages = [
    { value: 'en', label: 'English', icon: '🇺🇸' },
    { value: 'zh', label: '中文', icon: '🇨🇳' }
  ];

  const handleLanguageChange = async (lang: string) => {
    await i18n.changeLanguage(lang);
    setCurrentLang(lang);
    // 强制重新渲染整个应用
    window.dispatchEvent(new Event('languageChanged'));
  };

  // 监听语言变化
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  return (
    <ShadTooltip
      content={currentLang === 'en' ? '切换语言' : 'Switch Language'}
      side="bottom"
      styleClasses="z-10"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative flex items-center gap-2"
          >
            <ForwardedIconComponent
              name="Globe"
              className="side-bar-button-size h-[18px] w-[18px]"
              aria-hidden="true"
            />
            <span className="hidden whitespace-nowrap 2xl:inline">
              {currentLang === 'en' ? 'English' : '中文'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.value}
              className={`flex items-center gap-2 cursor-pointer ${
                currentLang === lang.value ? 'bg-accent' : ''
              }`}
              onClick={() => handleLanguageChange(lang.value)}
            >
              <span>{lang.icon}</span>
              <span>{lang.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ShadTooltip>
  );
}