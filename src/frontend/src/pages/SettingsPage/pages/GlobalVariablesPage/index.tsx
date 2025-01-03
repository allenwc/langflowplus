import IconComponent from "../../../../components/genericIconComponent";
import { Button } from "../../../../components/ui/button";

import {
  useDeleteGlobalVariables,
  useGetGlobalVariables,
} from "@/controllers/API/queries/variables";
import { GlobalVariable } from "@/types/global_variables";
import {
  ColDef,
  RowClickedEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import { useRef, useState } from "react";
import GlobalVariableModal from "../../../../components/GlobalVariableModal/GlobalVariableModal";
import Dropdown from "../../../../components/dropdownComponent";
import ForwardedIconComponent from "../../../../components/genericIconComponent";
import TableComponent from "../../../../components/tableComponent";
import { Badge } from "../../../../components/ui/badge";
import useAlertStore from "../../../../stores/alertStore";
import { useTranslation } from "react-i18next";

export default function GlobalVariablesPage() {
  const { t } = useTranslation();
  const setErrorData = useAlertStore((state) => state.setErrorData);
  const [openModal, setOpenModal] = useState(false);
  const initialData = useRef<GlobalVariable | undefined>(undefined);
  const BadgeRenderer = (props) => {
    return props.value !== "" ? (
      <div>
        <Badge variant="outline" size="md" className="font-normal">
          {props.value}
        </Badge>
      </div>
    ) : (
      <div></div>
    );
  };

  const DropdownEditor = ({ options, value, onValueChange }) => {
    return (
      <Dropdown options={options} value={value} onSelect={onValueChange}>
        <div className="-mt-1.5 w-full"></div>
      </Dropdown>
    );
  };
  // Column Definitions: Defines the columns to be displayed.
  const colDefs: ColDef[] = [
    {
      headerName: t('pages.settings.global_variables.grid_name'),
      field: "name",
      flex: 2,
    }, //This column will be twice as wide as the others
    {
      headerName: t('pages.settings.global_variables.grid_type'),
      field: "type",
      cellRenderer: BadgeRenderer,
      cellEditor: DropdownEditor,
      cellEditorParams: {
        options: ["Generic", "Credential"],
      },
      flex: 1,
    },
    {
      headerName: t('pages.settings.global_variables.grid_value'),
      field: "value",
    },
    {
      headerName: t('pages.settings.global_variables.grid_apply_to_fields'),
      field: "default_fields",
      valueFormatter: (params) => {
        return params.value?.join(", ") ?? "";
      },
      flex: 1,
      resizable: false,
    },
  ];

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { data: globalVariables } = useGetGlobalVariables();
  const { mutate: mutateDeleteGlobalVariable } = useDeleteGlobalVariables();

  async function removeVariables() {
    selectedRows.map(async (row) => {
      const id = globalVariables?.find((variable) => variable.name === row)?.id;
      mutateDeleteGlobalVariable(
        { id },
        {
          onError: () => {
            setErrorData({
              title: `Error deleting variable`,
              list: [`ID not found for variable: ${row}`],
            });
          },
        },
      );
    });
  }

  function updateVariables(event: RowClickedEvent<GlobalVariable>) {
    initialData.current = event.data;
    setOpenModal(true);
  }

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6">
      <div className="flex w-full items-start justify-between gap-6">
        <div className="flex w-full flex-col">
          <h2 className="flex items-center text-lg font-semibold tracking-tight">
            {t('pages.settings.global_variables.title')}
            <ForwardedIconComponent
              name="Globe"
              className="ml-2 h-5 w-5 text-primary"
            />
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('pages.settings.global_variables.description')}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <GlobalVariableModal asChild>
            <Button data-testid="api-key-button-store" variant="primary">
              <IconComponent name="Plus" className="w-4" />
              {t('pages.settings.global_variables.add_new')}
            </Button>
          </GlobalVariableModal>
        </div>
      </div>

      <div className="flex h-full w-full flex-col justify-between">
        <TableComponent
          key={"globalVariables"}
          overlayNoRowsTemplate="No data available"
          onSelectionChanged={(event: SelectionChangedEvent) => {
            setSelectedRows(event.api.getSelectedRows().map((row) => row.name));
          }}
          rowSelection="multiple"
          onRowClicked={updateVariables}
          suppressRowClickSelection={true}
          pagination={true}
          columnDefs={colDefs}
          rowData={globalVariables ?? []}
          onDelete={removeVariables}
        />
        {initialData.current && (
          <GlobalVariableModal
            key={initialData.current.id}
            initialData={initialData.current}
            open={openModal}
            setOpen={setOpenModal}
          />
        )}
      </div>
    </div>
  );
}
