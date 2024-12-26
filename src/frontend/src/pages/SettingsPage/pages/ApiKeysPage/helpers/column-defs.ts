import { useTranslation } from "react-i18next";
import TableAutoCellRender from "../../../../../components/tableComponent/components/tableAutoCellRender";

export const getColumnDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      headerName: t('pages.settings.api_keys.grid_name'),
      field: "name",
      cellRenderer: TableAutoCellRender,
      flex: 2,
    },
    {
      headerName: t('pages.settings.api_keys.grid_key'),
      field: "api_key",
      cellRenderer: TableAutoCellRender,
      flex: 1,
    },
    {
      headerName: t('pages.settings.api_keys.grid_created'),
      field: "created_at",
      cellRenderer: TableAutoCellRender,
      flex: 1,
    },
    {
      headerName: t('pages.settings.api_keys.grid_last_used'),
      field: "last_used_at",
      cellRenderer: TableAutoCellRender,
      flex: 1,
    },
    {
      headerName: t('pages.settings.api_keys.grid_total_uses'),
      field: "total_uses",
      cellRenderer: TableAutoCellRender,
      flex: 1,
      resizable: false,
    },
  ];
};
