import { t } from "i18next";
import { useMemo } from "react";

const useDescriptionModal = (
  selectedFlowsComponentsCards: string[] | undefined,
  type: string | undefined,
) => {
  const getDescriptionModal = useMemo(() => {
    const getTypeLabel = (type) => {
      const labels = {
        all: "item",
        component: t('main_page.components'),
        flow: t('main_page.flows'),
      };
      return labels[type] || "";
    };

    const getPluralizedLabel = (type) => {
      const labels = {
        all: "items",
        component: "components",
        flow: "flows",
      };
      return labels[type] || "";
    };

    if (selectedFlowsComponentsCards?.length === 1) {
      return getTypeLabel(type);
    }
    return getPluralizedLabel(type);
  }, [selectedFlowsComponentsCards, type]);

  return getDescriptionModal;
};

export default useDescriptionModal;
